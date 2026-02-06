// controllers/booksOrderController.js

const razorpay = require("../config/razorpay");
const crypto = require("crypto");

exports.createOrder = async (req, res) => {
  try {
    const { BooksOrders } = req;

    const {
      bookId,
      fullName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      quantity,
      totalPrice,
    } = req.body;

    if (!fullName || !phone || !address) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    /* ---------------- SAVE ORDER ---------------- */
    const order = await req.booksOrderModel.create({
      bookId,
      fullName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      quantity,
      totalPrice,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100, 
      currency: "INR",
      receipt: `receipt_${order.id}`,
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      message: "Order created",
      order,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// controllers/booksOrderController.js

exports.verifyPayment = async (req, res) => {
  try {
    const { booksOrderModel } = req;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      /* Update Order */
      await booksOrderModel.update(
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: "Paid",
        },
        {
          where: { razorpayOrderId: razorpay_order_id },
        }
      );

      res.json({
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getAllBookOrders = async (req, res) => {
  try {
    const { booksOrderModel, booksModel } = req;

    const orders = await req.booksOrderModel.findAll({
      include: [
        {
          model: booksModel,
          attributes: ["id", "bookName", "price", "image"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};


exports.getBookOrderById = async (req, res) => {
  try {
    const { booksOrderModel, booksModel } = req;
    const { id } = req.params;

    const order = await booksOrderModel.findByPk(id, {
      include: [
        {
          model: booksModel,
          attributes: ["id", "bookName", "price", "image"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Get Order By ID Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.updateBookOrder = async (req, res) => {
  try {
    const { booksOrderModel } = req;
    const { id } = req.params;

    const order = await booksOrderModel.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.update(req.body);

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (err) {
    console.error("Update Order Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.deleteBookOrder = async (req, res) => {
  try {
    const { booksOrderModel } = req;
    const { id } = req.params;

    const order = await booksOrderModel.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.destroy();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteAllBookOrders = async (req, res) => {
  try {
    const { booksOrderModel } = req;

    await booksOrderModel.destroy({
      where: {},
      truncate: true,
    });

    res.status(200).json({
      success: true,
      message: "All orders deleted successfully",
    });
  } catch (err) {
    console.error("Delete All Orders Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



