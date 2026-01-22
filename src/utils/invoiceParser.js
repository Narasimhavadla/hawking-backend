const parseInvoiceText = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const invoice = {
    invoiceNumber: null,
    invoiceDate: null,
    vendor: null,
    totalAmount: null,
    items: [],
  };

  // Example rules (customize per invoice format)
  lines.forEach(line => {
    if (line.toLowerCase().includes('invoice no')) {
      invoice.invoiceNumber = line.split(':').pop().trim();
    }

    if (line.toLowerCase().includes('date')) {
      invoice.invoiceDate = line.split(':').pop().trim();
    }

    if (line.toLowerCase().includes('total')) {
      invoice.totalAmount = line.match(/[\d,.]+/)?.[0];
    }
  });

  // Simple table detection (custom logic)
  lines.forEach(line => {
    if (/^\d+\s+/.test(line)) {
      const parts = line.split(/\s{2,}/);

      invoice.items.push({
        description: parts[1] || '',
        quantity: parts[2] || '',
        price: parts[3] || '',
        total: parts[4] || '',
      });
    }
  });

  return invoice;
};

module.exports = parseInvoiceText;
