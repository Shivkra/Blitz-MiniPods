import express from "express";
import cors from "cors";
import crypto from "crypto";
import Razorpay from "razorpay";
import db, { getCities, getStoresByCityName, saveApplication, updateApplicationPayment, recalculateStoreShelves, allocateShelves } from "./db.js";
import documentVerificationRouter from "./routes/documentVerification.js";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_T1tdYBm2zgboHi";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "C9b4ssZbsUzQ910Opy4rmeav";


export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use("/api/documents", documentVerificationRouter);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/cities", (_req, res) => {
    res.json(getCities());
  });

  app.get("/api/stores", (req, res) => {
    const { city } = req.query;
    if (!city || typeof city !== "string") {
      return res.status(400).json({ error: "city query parameter is required" });
    }

    const stores = getStoresByCityName(city);
    if (stores.length === 0) {
      return res.status(404).json({ error: `No stores found for city: ${city}` });
    }

    res.json(stores);
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const data = req.body;
      const { cart = [], brandName } = data;

      // Pricing structure: 1600 per shelf
      const totalRacks = cart.reduce((sum, item) => sum + (item.racks || 0), 0);
      const ratePerShelf = 1600;
      const totalAmount = totalRacks * ratePerShelf;

      // Save application with status 'pending'
      const appResult = saveApplication(data);
      const appId = appResult.id;

      if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
        // Real Razorpay integration
        const razorpay = new Razorpay({
          key_id: RAZORPAY_KEY_ID,
          key_secret: RAZORPAY_KEY_SECRET,
        });

        const order = await razorpay.orders.create({
          amount: totalAmount * 100, // in paise
          currency: "INR",
          receipt: `receipt_app_${appId}`,
        });

        // Update database with payment details
        updateApplicationPayment(appId, order.id, "pending", totalAmount);

        res.status(201).json({
          applicationId: appId,
          orderId: order.id,
          amount: order.amount,
          keyId: RAZORPAY_KEY_ID,
          isMock: false,
        });
      } else {
        // Mock payment mode if keys are not provided
        const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;

        // Update database with payment details
        updateApplicationPayment(appId, mockOrderId, "pending", totalAmount);

        res.status(201).json({
          applicationId: appId,
          orderId: mockOrderId,
          amount: totalAmount * 100, // in paise
          keyId: "rzp_test_mockkey123",
          isMock: true,
        });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/payments/verify", (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        applicationId,
        isMock,
      } = req.body;

      // Guard against double payment verification
      const appRecord = db.prepare("SELECT payment_status FROM applications WHERE id = ?").get(applicationId);
      if (appRecord && appRecord.payment_status === "paid") {
        return res.json({ success: true, message: "Payment already verified and shelves deducted" });
      }

      if (isMock) {
        // Simple verification for mock checkout
        updateApplicationPayment(applicationId, razorpay_payment_id, "paid", undefined);
        recalculateStoreShelves();
        allocateShelves(applicationId);
        return res.json({ success: true, message: "Mock payment verified successfully" });
      }

      if (!RAZORPAY_KEY_SECRET) {
        return res.status(400).json({ error: "Razorpay Key Secret is missing on the server" });
      }

      const generatedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generatedSignature === razorpay_signature) {
        updateApplicationPayment(applicationId, razorpay_payment_id, "paid", undefined);
        recalculateStoreShelves();
        allocateShelves(applicationId);
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ error: "Signature verification failed" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/applications/:id", (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      db.prepare("UPDATE applications SET payload = ? WHERE id = ?").run(JSON.stringify(data), id);

      // Simulate sending email notification to the team
      const docsCount = Object.keys(data.uploads || {}).length;
      console.log(`
=========================================
[MAIL SIMULATION] Sending notification...
To: team@blitzminipods.com
From: system@blitzminipods.com
Subject: New Partner Application Submitted - ${data.brandName || "Unknown Brand"}

A partner brand has submitted their onboarding details and verification documents!

Brand Info:
- Brand Name: ${data.brandName || "—"}
- Point of Contact: ${data.poc || "—"}
- Mobile Number: ${data.phone || "—"}
- Email Address: ${data.email || "—"}

Documents Uploaded (${docsCount}):
${Object.entries(data.uploads || {}).map(([key, file]) => `* ${key.toUpperCase()}: ${file.name} (${parseFloat((file.size / 1024).toFixed(1))} KB)`).join("\n")}

Review application & download documents here:
http://localhost:3001/api/admin/applications
=========================================
      `);

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/admin/applications", (_req, res) => {
    try {
      const apps = db.prepare("SELECT * FROM applications ORDER BY created_at DESC").all();
      const formattedApps = apps.map(app => {
        try {
          return {
            id: app.id,
            brand_name: app.brand_name,
            poc: app.poc,
            phone: app.phone,
            email: app.email,
            created_at: app.created_at,
            payment_status: app.payment_status,
            payment_id: app.payment_id,
            amount: app.amount,
            payload: JSON.parse(app.payload)
          };
        } catch (e) {
          return app;
        }
      });
      res.json(formattedApps);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/applications/:id/document/:docId", (req, res) => {
    try {
      const { id, docId } = req.params;
      const app = db.prepare("SELECT payload FROM applications WHERE id = ?").get(id);
      if (!app) {
        return res.status(404).json({ error: "Application not found" });
      }

      const payload = JSON.parse(app.payload);
      const fileObj = payload.uploads && payload.uploads[docId];
      if (!fileObj || !fileObj.data) {
        return res.status(404).json({ error: "Document not found" });
      }

      const matches = fileObj.data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ error: "Invalid document data format" });
      }

      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${fileObj.name}"`);
      res.send(buffer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/applications/:id/shelves", (req, res) => {
    try {
      const { id } = req.params;
      const shelves = db.prepare(`
        SELECT a.shelf_code, s.name as store_name, s.area, s.address, c.name as city_name
        FROM allocated_shelves a
        JOIN stores s ON s.id = a.store_id
        JOIN cities c ON c.id = s.city_id
        WHERE a.application_id = ?
      `).all(id);
      res.json(shelves);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}
