const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const generateInvoice = require("../utils/generateInvoice");

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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const orderId = razorpay_order_id.trim();
    const paymentId = razorpay_payment_id.trim();
    const signature = razorpay_signature.trim();

    // 🔐 Signature verification
    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("SIGNATURE MISMATCH", {
        expectedSignature,
        signature,
      });
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Create student (ONLY HERE)
    const student = await req.studentModel.create({
      ...studentData,
      Status: "active",
      teacherId: null,
      examId: null,
    });

    const invoiceNo = `STU-INV-${Date.now()}`;

    // ✅ Save payment
    await req.Payment.create({
      studentId: student.id,
      teacherId: null,
      examId: null,
      examName: "Student Registration",
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      invoiceNo,
      amount,
      status: "SUCCESS",
      paymentFor: "STUDENT",
    });

    // ✅ Invoice (optional)
    await generateInvoice({
      invoiceNo,
      studentName: student.name,
      studentEmail: student.email,
      purpose: "Student Registration",
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      amount,
    });

    return res.status(200).json({
      success: true,
      message: "Student registered & payment verified",
      studentId: student.id,
      invoiceNo,
    });
  } catch (err) {
    console.error("STUDENT VERIFY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Student payment verification failed",
      error: err.message,
    });
  }
};

