const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth.middleware");
const {allowRoles} = require("../../middleware/roleMiddleware")
const activityCtrl = require("../controllers/activityController");

router.post("/logout", verifyToken, activityCtrl.logout);

router.get(
  "/user-activities",
  verifyToken,
  allowRoles("admin", "superadmin"),
  activityCtrl.getUserActivities
);

module.exports = router;
