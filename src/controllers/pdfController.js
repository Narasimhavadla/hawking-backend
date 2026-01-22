const fs = require('fs');
const pdf = require('pdf-parse');
const parseInvoiceText = require('../utils/invoiceParser');

const PdfController = {

  uploadAndConvert: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({
          status: false,
          message: 'PDF file is required',
        });
      }

      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(dataBuffer);

      const invoiceJson = parseInvoiceText(pdfData.text);

      res.status(200).send({
        status: true,
        message: 'PDF converted to JSON successfully',
        pages: pdfData.numpages,
        data: invoiceJson,
      });

    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: false,
        message: 'PDF conversion failed',
        error : error.message
      });
    }
  },
};

module.exports = PdfController;
