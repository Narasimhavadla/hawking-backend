const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const generateInvoice = require("../utils/generateInvoice");

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
      receipt: `receipt_${Date.now()}`,
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
      teacherId,
      examId,
      discountApplied = 0,
    } = req.body;

    // Check required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !teacherId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Trim values to avoid whitespace issues
    const orderId = razorpay_order_id.trim();
    const paymentId = razorpay_payment_id.trim();
    const signature = razorpay_signature.trim();

    // 🔐 Razorpay signature verification
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.log("Signature mismatch:", { expectedSignature, received: signature });
      return res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
    }

    // ✅ Validate teacher
    const teacher = await req.teacherModel.findByPk(parseInt(teacherId));
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const invoiceNo = `INV-${Date.now()}`;

    // ✅ Save payment
    const payment = await req.Payment.create({
      teacherId,
      examId,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      invoiceNo,
      amount,
      discountApplied,
      status: "SUCCESS",
    });

    // ✅ Generate invoice PDF
    await generateInvoice({
      invoiceNo,
      teacherName: teacher.name,
      teacherEmail: teacher.email,
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      amount,
      discountApplied,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified & invoice generated",
      invoiceNo,
      paymentId: payment.id,
    });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: err.message,
    });
  }
};
