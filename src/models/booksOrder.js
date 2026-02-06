// models/order.model.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const BooksOrders = sequelize.define(
    "BooksOrders",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: DataTypes.STRING,

      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      city: DataTypes.STRING,
      state: DataTypes.STRING,
      pincode: DataTypes.STRING,

      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      /* 🔥 Razorpay Fields */
      razorpayOrderId: DataTypes.STRING,
      razorpayPaymentId: DataTypes.STRING,
      razorpaySignature: DataTypes.STRING,

      paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },

      orderStatus: {
        type: DataTypes.STRING,
        defaultValue: "ordered",
      },
    },
    {
      tableName: "BooksOrders",
      timestamps: true,
    }
  );

  return BooksOrders;
};
