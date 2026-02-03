const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentPaymentController");

router.post("/student/create-order", controller.createStudentOrder);
router.post("/student/verify-payment", controller.verifyStudentPayment);

module.exports = router;
