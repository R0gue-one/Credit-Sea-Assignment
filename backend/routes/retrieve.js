const express = require("express");
const mongoose = require("mongoose");
const CreditProfile = require("../models/creditProfile");

const router = express.Router();

// Get all credit profiles with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      name,
      pan,
      minScore,
      maxScore,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    // Build filter object
    const filter = {};
    if (name) filter.name = new RegExp(name, "i"); // Case-insensitive name search
    if (pan) filter.pan = pan.toUpperCase();
    if (minScore || maxScore) {
      filter.creditScore = {};
      if (minScore) filter.creditScore.$gte = parseInt(minScore);
      if (maxScore) filter.creditScore.$lte = parseInt(maxScore);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const profiles = await CreditProfile
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v"); // Exclude version key

    // Get total count for pagination
    const totalProfiles = await CreditProfile.countDocuments(filter);

    res.json({
      profiles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProfiles / parseInt(limit)),
        totalRecords: totalProfiles,
        hasNextPage: skip + profiles.length < totalProfiles,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error("Error fetching credit profiles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get credit profile by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const profile = await CreditProfile.findById(id).select("-__v");
    
    if (!profile) {
      return res.status(404).json({ error: "Credit profile not found" });
    }

    res.json(profile);

  } catch (error) {
    console.error("Error fetching credit profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get credit profiles by PAN
router.get("/pan/:pan", async (req, res) => {
  try {
    const { pan } = req.params;
    
    const profiles = await CreditProfile
      .find({ pan: pan.toUpperCase() })
      .sort({ createdAt: -1 })
      .select("-__v");

    if (!profiles.length) {
      return res.status(404).json({ error: "No credit profiles found for this PAN" });
    }

    res.json(profiles);

  } catch (error) {
    console.error("Error fetching credit profiles by PAN:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get credit score statistics
router.get("/stats/credit-score", async (req, res) => {
  try {
    const stats = await CreditProfile.aggregate([
      {
        $match: {
          creditScore: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$creditScore" },
          minScore: { $min: "$creditScore" },
          maxScore: { $max: "$creditScore" },
          totalProfiles: { $sum: 1 },
          scoreDistribution: {
            $push: "$creditScore"
          }
        }
      },
      {
        $project: {
          _id: 0,
          averageScore: { $round: ["$averageScore", 2] },
          minScore: 1,
          maxScore: 1,
          totalProfiles: 1
        }
      }
    ]);

    res.json(stats[0] || {
      averageScore: 0,
      minScore: 0,
      maxScore: 0,
      totalProfiles: 0
    });

  } catch (error) {
    console.error("Error fetching credit score statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;