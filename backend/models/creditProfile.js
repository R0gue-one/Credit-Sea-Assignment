const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  firstLine: String,
  secondLine: String,
  thirdLine: String,
  city: String,
  state: String,
  pincode: String,
  countryCode: String
});

const creditAccountSchema = new mongoose.Schema({
  accountNumber: String,
  bankName: String,
  accountType: String,
  currentBalance: Number,
  amountOverdue: Number,
  creditLimit: Number,
  accountStatus: String,
  address: addressSchema
});

const creditProfileSchema = new mongoose.Schema({
  name: String,
  mobilePhone: String,
  pan: String,
  creditScore: Number,
  
  reportSummary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalance: Number,
    securedBalance: Number,
    unsecuredBalance: Number,
    last7DaysEnquiries: Number
  },

  creditAccounts: [creditAccountSchema],
  addresses: [addressSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model("CreditProfile", creditProfileSchema);