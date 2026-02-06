const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentDashboardController");

const {verifyToken} = require("../../middleware/auth.middleware")
const {allowRoles} = require("../../middleware/roleMiddleware")

router.get("/payments/dashboard",
    verifyToken,
    allowRoles("admin","superadmin"),
    controller.getPaymentsDashboard);

module.exports = router;
