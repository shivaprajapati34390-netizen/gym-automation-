const express = require("express");
const axios = require("axios");
const Member = require("../models/Member");

const router = express.Router();

// =======================
// Create a Member
// =======================
router.post("/", async (req, res) => {
  try {
    // Save member in MongoDB
    const member = new Member(req.body);
    await member.save();

    console.log("✅ Member saved:", member.name);

    // Send member data to n8n Webhook
    try {
      await axios.post(
        "http://localhost:5678/webhook-test/new-member",
        {
          _id: member._id,
          name: member.name,
          contact: member.contact,
          membershipType: member.membershipType,
          expiryDate: member.expiryDate,
          dob: member.dob,
        }
      );

      console.log("✅ Data sent to n8n");
    } catch (error) {
      console.log("❌ Webhook Error:", error.message);
    }

    res.status(201).json(member);
  } catch (err) {
    console.error("❌ Create member error:", err);

    res.status(400).json({
      error: err.message,
    });
  }
});


// =======================
// Get All Members
// =======================
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();

    res.json(members);
  } catch (err) {
    console.error("❌ Get members error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// =======================
// Get Single Member
// =======================
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json(member);
  } catch (err) {
    console.error("❌ Get member error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// =======================
// Update Member
// =======================
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      contact,
      membershipType,
      joinDate,
      expiryOverride,
      dob,
      registrationFee,
      membershipFee,
    } = req.body;

    const updatedData = {
      name,
      age,
      gender,
      contact,
      membershipType,
      joinDate,
      expiryOverride: expiryOverride || null,
      dob: dob || null,
      registrationFee: registrationFee || 0,
      membershipFee: membershipFee || 0,
    };

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    console.log("✅ Member updated:", member.name);

    res.status(200).json(member);

  } catch (err) {
    console.error("❌ Update member error:", err);

    res.status(400).json({
      error: err.message,
    });
  }
});


// =======================
// Delete Member
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    console.log("✅ Member deleted:", member.name);

    res.json({
      message: "Member deleted successfully",
    });

  } catch (err) {
    console.error("❌ Delete member error:", err);

    res.status(400).json({
      error: err.message,
    });
  }
});


module.exports = router;