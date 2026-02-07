const razorpay = require("../config/razorpay");
const crypto = require("crypto");
// const generateInvoice = require("../utils/generateInvoice");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      // receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      examId,
      examName,
      discountApplied = 0,
    } = req.body;

    // ✅ teacherId ALWAYS from token
    const teacherId = req.user.teacherId;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const teacher = await req.teacherModel.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const payment = await req.Payment.create({
      teacherId,
      examId,
      examName,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceNo: `PAY-${Date.now()}`,
      amount,
      discountApplied: Number(discountApplied), // ✅ FIXED
      status: "SUCCESS",
      paymentFor: "TEACHER",
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId: payment.id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: err.message,
    });
  }
};


