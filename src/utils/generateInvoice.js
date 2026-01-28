const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = async function generateInvoice(data) {
  const invoiceDir = path.join(__dirname, "../invoices");

  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir);
  }

  const filePath = path.join(invoiceDir, `${data.invoiceNo}.pdf`);
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Payment Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Invoice No: ${data.invoiceNo}`);
  doc.text(`Teacher Name: ${data.teacherName}`);
  doc.text(`Email: ${data.teacherEmail}`);
  doc.text(`Payment ID: ${data.razorpay_payment_id}`);
  doc.text(`Order ID: ${data.razorpay_order_id}`);
  doc.text(`Amount Paid: ₹ ${data.amount}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();
  doc.text("This is a system generated invoice.");

  doc.end();

  return filePath;
};
