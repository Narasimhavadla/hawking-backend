const razorpay = require("../config/razorpay");
const crypto = require("crypto");
// const generateInvoice = require("../utils/generateInvoice");

// ===============================
// CREATE ORDER (STUDENT)
// ===============================
exports.createStudentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `student_receipt_${Date.now()}`,
    });

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("STUDENT ORDER ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// VERIFY PAYMENT + REGISTER STUDENT
// ===============================
exports.verifyStudentPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      studentData,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const student = await req.studentModel.create({
      ...studentData,
      Status: "active",
      teacherId: null,
      examId: null,
    });

    await req.Payment.create({
      studentId: student.id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceNo: `STU-${Date.now()}`, // reference only
      amount,
      status: "SUCCESS",
      paymentFor: "STUDENT",
    });

    res.status(200).json({
      success: true,
      message: "Student registered & payment verified",
      studentId: student.id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Student payment verification failed",
      error: err.message,
    });
  }
};


