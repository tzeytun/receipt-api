# Receipt API (Backend)

This is the backend service for the **Receipt Generator** project.  
It is built with **Node.js**, **Express**, and **PDFKit**, and provides API endpoints for product listing, checkout, order management, and dynamic PDF receipt generation.

---

## Features
- RESTful API built with **Express**
- In-memory **order tracking** (can be extended with a database)
- **PDF receipt generation** using `pdfkit`
- CORS-enabled API for connecting with a separate frontend
- Environment variable-based configuration (VITE_API_BASE)
- Clear project structure for scalability

---

## Project Structure
```

receipt-api/
├── src/
│   ├── index.js         # Main server file (Express)
│   ├── data.js          # Product and company data
│   ├── pdf.js           # PDF generation logic
│   └── ...
├── DejaVuSans.ttf       # Font for international characters
├── package.json
└── README.md

````

---

## Tech Stack
- **Node.js** + **Express** for backend API
- **pdfkit** for PDF generation
- **nanoid** for unique order IDs
- **dayjs** for date formatting

---

## Installation
1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd receipt-api


2. Install dependencies:

   ```bash
   npm install
   ```
3. Create an `.env` file:

   ```
   PORT=4000
   ```
4. Run in development mode:

   ```bash
   npm run dev
   ```

---

## API Endpoints

* `GET /api/products` → Get all products
* `POST /api/checkout` → Create a new order
* `GET /api/orders/:orderId` → Fetch order details
* `GET /api/orders/:orderId/receipt` → Generate and return a PDF receipt

---

## What I Learned


- Using **PDFKit** to dynamically generate PDF files in Node.js  
- How to create **headers, tables, and footers** in a PDF document 
- Positioning text and drawing **lines/columns** precisely using coordinates  
- Adding **totals and VAT calculations** programmatically into the PDF  
- How to stream a PDF response directly to the browser with proper headers (`Content-Type`, `Content-Disposition`)  
- Handling **multi-page PDFs** when the content exceeds one page  


---

## Live URL

**Digital Store (Live):** `https://receipt-web-zeta.vercel.app/`
