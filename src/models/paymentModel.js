const { DataTypes } = require("sequelize");

const Payment = (sequelize) => {
  return sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      razorpay_order_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      razorpay_payment_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      razorpay_signature: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "payments",
      timestamps: true,
    }
  );
};

module.exports = Payment;
