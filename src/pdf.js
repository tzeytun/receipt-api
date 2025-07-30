import PDFDocument from "pdfkit";
import dayjs from "dayjs";

export function usdCurrency(v) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(v);
}

export function streamReceiptPdf({ res, order, company, fontPath = "DejaVuSans.ttf" }) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="receipt_${order.id}.pdf"`);
  doc.pipe(res);

  doc.registerFont("Regular", fontPath);

  // Header
  doc.font("Regular").fontSize(20).text(company.name);
  doc.moveDown(0.3);
  doc.fontSize(10).text(company.address);
  doc.text(`TAX No: ${company.taxNo}`);
  doc.text(`Email: ${company.email}`);
  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

  // Order info
  doc.moveDown(0.8);
  doc.fontSize(14).text("Receipt");
  doc.moveDown(0.5);
  doc.fontSize(10)
    .text(`Order No: ${order.id}`)
    .text(`Date: ${dayjs(order.date).format("YYYY-MM-DD HH:mm")}`)
    .text(`Customer: ${order.customer.name}`)
    .text(`Email: ${order.customer.email}`);
  doc.moveDown(0.6);

  // Table header positions
  const col = { name: 50, qty: 320, unit: 400, total: 480 };
  const width = { name: 250, qty: 60, unit: 70, total: 65 };

  // Header row
  doc.moveDown(0.5);
  doc.fontSize(11).text("Product", col.name, doc.y, { width: width.name });
  doc.text("Quantity", col.qty, doc.y, { width: width.qty, align: "right" });
  doc.text("Unit Price", col.unit, doc.y, { width: width.unit, align: "right" });
  doc.text("Total", col.total, doc.y, { width: width.total, align: "right" });
  doc.moveDown(0.2);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

  // Items
  let y = doc.y + 5;
  doc.fontSize(10);
  order.items.forEach((it) => {
    const lineTotal = it.qty * it.unitPrice;

    doc.text(it.name, col.name, y, { width: width.name });
    doc.text(`${it.qty}`, col.qty, y, { width: width.qty, align: "right" });
    doc.text(usdCurrency(it.unitPrice), col.unit, y, { width: width.unit, align: "right" });
    doc.text(usdCurrency(lineTotal), col.total, y, { width: width.total, align: "right" });

    y += 18;
    if (y > 720) {
      doc.addPage();
      y = 50;
    }
  });

  // Bottom line
  doc.moveTo(50, y + 2).lineTo(545, y + 2).stroke();

  // Totals
  y += 20;
  const totalsX = 360;
  doc.text("Subtotal:", totalsX, y, { width: 100, align: "right" });
  doc.text(usdCurrency(order.subtotal), totalsX + 110, y, { width: 80, align: "right" });
  y += 16;
  doc.text(`VAT (${Math.round(order.vatRate * 100)}%):`, totalsX, y, { width: 100, align: "right" });
  doc.text(usdCurrency(order.vat), totalsX + 110, y, { width: 80, align: "right" });
  y += 16;
  doc.fontSize(12).text("Total:", totalsX, y, { width: 100, align: "right" });
  doc.fontSize(12).text(usdCurrency(order.total), totalsX + 110, y, { width: 80, align: "right" });

  // Footer
  doc.moveDown(2);
  doc.fontSize(9).text("This receipt has been generated electronically.", {
    align: "center",
  });

  doc.end();
}
