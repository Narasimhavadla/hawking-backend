const express = require('express');
const router = express.Router();
const upload = require('../utils/pdfUpload');
const pdfController = require('../controllers/pdfController');

router.post(
  '/invoice/upload',
  upload.single('pdf'),
  pdfController.uploadAndConvert
);

module.exports = router;
