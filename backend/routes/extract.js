const express = require("express");
const fs = require("fs");
const xml2js = require("xml2js");
const mongoose = require("mongoose");
const CreditProfile = require("../models/creditProfile");

const router = express.Router();

const readFileAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const deleteFileAsync = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err, data) => {
        if (err) reject(err);
        else resolve(data);
        });
    }); 
};

router.post("/", async (req, res) => {
  console.log("Extract request received:", req.body);

  const { filename, forceUpdate } = req.body;
  if (!filename) {
    return res.status(400).json({ error: "Filename required" });
  }

  const filePath = `./uploads/${filename}`;
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    return res.status(404).json({ error: "File not found" });
  }

  try {
    const data = await readFileAsync(filePath);
    const parsedXML = await xml2js.parseStringPromise(data, { explicitArray: false });

    if (!mongoose.connection.readyState) {
      console.error("MongoDB not connected");
      return res.status(500).json({ error: "MongoDB not connected" });
    }

    const profile = parsedXML.INProfileResponse;
    const applicant = profile?.Current_Application?.Current_Application_Details?.Current_Applicant_Details || {};
    const summary = profile?.CAIS_Account?.CAIS_Summary || {};
    const totalOutstanding = summary?.Total_Outstanding_Balance || {};
    const accounts = Array.isArray(profile?.CAIS_Account?.CAIS_Account_DETAILS) 
      ? profile.CAIS_Account.CAIS_Account_DETAILS 
      : [profile?.CAIS_Account?.CAIS_Account_DETAILS] || [];
    const score = profile?.SCORE || {};

    // Extract credit accounts information
    const creditAccounts = accounts.map(account => {
      const address = account?.CAIS_Holder_Address_Details || {};
      
      return {
        accountNumber: account.Account_Number || "",
        bankName: account.Subscriber_Name?.trim() || "",
        accountType: account.Account_Type || "",
        currentBalance: parseFloat(account.Current_Balance) || 0,
        amountOverdue: parseFloat(account.Amount_Past_Due) || 0,
        creditLimit: parseFloat(account.Credit_Limit_Amount) || 0,
        accountStatus: account.Account_Status || "",
        address: {
          firstLine: address.First_Line_Of_Address_non_normalized || "",
          secondLine: address.Second_Line_Of_Address_non_normalized || "",
          thirdLine: address.Third_Line_Of_Address_non_normalized || "",
          city: address.City_non_normalized || "",
          state: address.State_non_normalized || "",
          pincode: address.ZIP_Postal_Code_non_normalized || "",
          countryCode: address.CountryCode_non_normalized || ""
        }
      };
    });

    // Extract unique addresses
    const uniqueAddresses = [...new Set(creditAccounts.map(acc => 
      JSON.stringify(acc.address)))].map(addr => JSON.parse(addr));

    const extractedData = {
      name: `${applicant.First_Name || ""} ${applicant.Last_Name || ""}`.trim(),
      mobilePhone: applicant.MobilePhoneNumber || "",
      pan: accounts[0]?.CAIS_Holder_Details?.Income_TAX_PAN || "",
      creditScore: parseInt(score?.BureauScore) || null,

      reportSummary: {
        totalAccounts: parseInt(summary?.Credit_Account?.CreditAccountTotal) || 0,
        activeAccounts: parseInt(summary?.Credit_Account?.CreditAccountActive) || 0,
        closedAccounts: parseInt(summary?.Credit_Account?.CreditAccountClosed) || 0,
        currentBalance: parseFloat(totalOutstanding?.Outstanding_Balance_All) || 0,
        securedBalance: parseFloat(totalOutstanding?.Outstanding_Balance_Secured) || 0,
        unsecuredBalance: parseFloat(totalOutstanding?.Outstanding_Balance_UnSecured) || 0,
        last7DaysEnquiries: parseInt(profile?.TotalCAPS_Summary?.TotalCAPSLast7Days) || 0,
      },

      creditAccounts: creditAccounts,
      addresses: uniqueAddresses
    };

    // Check if record with same PAN exists
    const existingProfile = await CreditProfile.findOne({ pan: extractedData.pan });

    if (existingProfile && !forceUpdate) {
      return res.status(409).json({ 
        message: "Profile with this PAN already exists", 
        existingData: existingProfile 
      });
    }

    // Save or update the profile
    const savedProfile = await CreditProfile.findOneAndUpdate(
      { pan: extractedData.pan }, 
      { $set: extractedData }, 
      { upsert: true, new: true }
    );

    await deleteFileAsync(filePath);
    console.log(`File Successfully Deleted at: ${filePath}`);

    res.json({ message: "Data extracted & saved", data: savedProfile });

  } catch (error) {
    console.error("Extraction error:", error);
    res.status(500).json({ error: "Extraction Error" });
  }
});

module.exports = router;