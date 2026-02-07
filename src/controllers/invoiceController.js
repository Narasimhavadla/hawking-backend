// const path = require("path");

// exports.downloadInvoice = async (req, res) => {
//   const { invoiceNo } = req.params;

//   const filePath = path.join(
//     __dirname,
//     "../invoices",
//     `${invoiceNo}.pdf`
//   );

//   res.download(filePath);
// };



exports.getTeacherPayments = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const payments = await req.Payment.findAll({
      where: { teacherId, status: "SUCCESS" },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
