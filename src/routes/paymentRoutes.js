const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const invoiceController = require("../controllers/invoiceController");

router.post("/create-order", paymentController.createOrder);
router.post("/verify-payment", paymentController.verifyPayment);

// invoices
router.get("/invoices/:invoiceNo", invoiceController.downloadInvoice);
router.get("/teacher-payments/:teacherId", invoiceController.getTeacherPayments);

module.exports = router;
