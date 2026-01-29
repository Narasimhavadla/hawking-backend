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

  /* =========================
     HEADER
  ========================= */
  doc
    .fontSize(22)
    .text("HAWKINGS EDUCATION", { align: "center" })
    .moveDown(0.3);

  doc
    .fontSize(12)
    .fillColor("gray")
    .text("Payment Invoice", { align: "center" });

  doc.moveDown(2);
  doc.fillColor("black");

  /* =========================
     INVOICE META
  ========================= */
  const invoiceTop = doc.y;

  doc
    .fontSize(11)
    .text(`Invoice No: ${data.invoiceNo}`, 50, invoiceTop)
    .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 50, invoiceTop + 15);

  doc
    .text(`Teacher Name: ${data.teacherName}`, 350, invoiceTop)
    .text(`Email: ${data.teacherEmail}`, 350, invoiceTop + 15);

  doc.moveDown(3);

  /* =========================
     TABLE HEADER
  ========================= */
  const tableTop = doc.y;

  drawLine(doc, tableTop);

  doc
    .fontSize(11)
    .text("Description", 50, tableTop + 10)
    .text("Payment ID", 250, tableTop + 10)
    .text("Amount ", 430, tableTop + 10, { align: "right" });

  drawLine(doc, tableTop + 25);

  /* =========================
     TABLE ROW
  ========================= */
  const rowY = tableTop + 35;

  doc
    .fontSize(10)
    .text("Teacher Exam Registration Fee", 50, rowY)
    .text(data.razorpay_payment_id, 250, rowY)
    .text(`${data.amount}`, 430, rowY, { align: "right" });

  drawLine(doc, rowY + 25);

  /* =========================
     GRAND TOTAL
  ========================= */
  doc.moveDown(2);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    // .text("Grand Total", 300, doc.y, { align: "left" })
    .text(` ${data.amount}`, 430, doc.y - 15, { align: "right" });

  doc.font("Helvetica");

  /* =========================
     PAYMENT DETAILS
  ========================= */
  doc.moveDown(3);

  doc.fontSize(11).text("Payment Details", { underline: true });
  doc.moveDown(0.5);

  doc
    .fontSize(10)
    .text(`Order ID: ${data.razorpay_order_id}`)
    .text(`Payment ID: ${data.razorpay_payment_id}`)
    .text(`Payment Status: SUCCESS`);

  /* =========================
     FOOTER
  ========================= */
  doc.moveDown(4);

  drawLine(doc, doc.y);

  doc
    .fontSize(9)
    .fillColor("gray")
    .text(
      "This is a system-generated invoice. No signature is required.",
      { align: "center" }
    );

  doc.end();

  return filePath;
};

/* =========================
   HELPER FUNCTION
========================= */
function drawLine(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}
