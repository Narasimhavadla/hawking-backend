// const express = require("express");
// const router = express.Router();
// const paymentController = require("../controllers/paymentController");

// router.post("/create-order", paymentController.createOrder);
// router.post("/verify-payment", paymentController.verifyPayment);

// invoices
// router.get("/invoices/:invoiceNo", invoiceController.downloadInvoice);

// module.exports = router;

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const invoiceController = require("../controllers/invoiceController");

const { verifyToken } = require("../../middleware/auth.middleware");
const { allowRoles } = require("../../middleware/roleMiddleware");

router.post("/create-order", verifyToken, allowRoles("teacher"), paymentController.createOrder);
router.get("/teacher-payments/:teacherId", invoiceController.getTeacherPayments);


router.post(
  "/verify-payment",
  verifyToken,
  allowRoles("teacher"),
  paymentController.verifyPayment
);

module.exports = router;

