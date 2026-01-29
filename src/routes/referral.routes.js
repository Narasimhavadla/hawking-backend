const express = require("express");
const router = express.Router();
const referralController = require("../controllers/referral.controller");

// Admin
router.get("/admin", referralController.getAllReferrals);

// Teacher
router.get("/teacher/:teacherId", referralController.getTeacherReferralSummary);

// Use referral (after payment)
router.post("/use", referralController.useReferralCode);

module.exports = router;
