import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { PRODUCTS, COMPANY, VAT_RATE } from "./data.js";
import { streamReceiptPdf } from "./pdf.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const orders = new Map();


app.get("/api/products", (req, res) => {
  res.json({ products: PRODUCTS });
});


app.post("/api/checkout", (req, res) => {
  const { customer, items } = req.body || {};

  if (!customer?.name || !customer?.email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing or invalid fields." });
  }


  const resolved = items.map(it => {
    const p = PRODUCTS.find(x => x.id === it.productId);
    if (!p) throw new Error(`Product not found: ${it.productId}`);
    const qty = Number(it.qty || 1);
    if (qty <= 0) throw new Error(`Invalid quantity: ${qty}`);
    return { id: p.id, name: p.name, unitPrice: p.price, qty };
  });

  const subtotal = resolved.reduce((s, r) => s + r.unitPrice * r.qty, 0);
  const vat = +(subtotal * VAT_RATE).toFixed(2);
  const total = +(subtotal + vat).toFixed(2);

  const order = {
    id: `ORD-${nanoid(8)}`,
    date: dayjs().toISOString(),
    customer,
    items: resolved,
    subtotal,
    vatRate: VAT_RATE,
    vat,
    total,
    status: "confirmed"
  };

  orders.set(order.id, order);
  return res.json({ orderId: order.id });
});


app.get("/api/orders/:orderId", (req, res) => {
  const order = orders.get(req.params.orderId);
  if (!order) return res.status(404).json({ error: "Order not found." });
  res.json({ order, company: COMPANY });
});


app.get("/api/orders/:orderId/receipt", (req, res) => {
  const order = orders.get(req.params.orderId);
  if (!order) return res.status(404).json({ error: "Order not found." });
  streamReceiptPdf({ res, order, company: COMPANY, fontPath: "DejaVuSans.ttf" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`API READY: http://localhost:${PORT}`));
