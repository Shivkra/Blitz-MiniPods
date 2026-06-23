/* global process */
import nodemailer from "nodemailer";

// Configured from environment variables
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === "true" || SMTP_PORT === 465;
const SMTP_FROM = process.env.SMTP_FROM || `"Blitz Onboarding" <${SMTP_USER || "no-reply@blitzminipods.com"}>`;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "siva.k@blitznow.in";

let transporter = null;

// Initialize the transporter only if we have SMTP details configured
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

/**
 * Sends a notification email when a client submits details.
 * If SMTP credentials are not configured, it prints the simulated email to the console.
 *
 * @param {string} type - The type of submission ('specialist_call', 'application_started', 'documents_uploaded', 'payment_verified')
 * @param {object} data - The data payload submitted by the client
 */
export async function sendSubmissionEmail(type, data) {
  let subject;
  let htmlContent;

  // Set default values in case payload has missing properties
  const brandName = data.brandName || "Unknown Brand";
  const poc = data.poc || "—";
  const phone = data.phone || "—";
  const email = data.email || "—";

  switch (type) {
    case "specialist_call": {
      subject = `[Specialist Call Requested] ${brandName}`;
      const interestedCities = Array.isArray(data.city) ? data.city.join(", ") : (data.city || "—");
      htmlContent = `
        <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 0;">Specialist Call Request</h2>
          <p>A new lead has requested to speak to a specialist!</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; width: 40%;">Brand Name</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${brandName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Point of Contact</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${poc}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Mobile Number</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Email Address</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Interested Cities</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${interestedCities}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Expected Daily Orders</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${data.orders || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Average Product Weight</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${data.weight || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Website</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${data.website ? `<a href="${data.website}" target="_blank">${data.website}</a>` : "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Instagram</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${data.instagram || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">LinkedIn</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${data.linkedin || "—"}</td>
            </tr>
          </table>
        </div>
      `;
      break;
    }
    case "application_started": {
      subject = `[Application Started] ${brandName} - Checkout Initialized`;
      const cart = data.cart || [];
      const totalRacks = cart.reduce((sum, item) => sum + (item.racks || 0), 0);
      const totalAmount = totalRacks * 1600;

      htmlContent = `
        <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 0;">Onboarding Application Initialized</h2>
          <p>A client has initialized their onboarding details and proceeded to checkout!</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; width: 40%;">Brand Name</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${brandName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Point of Contact</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${poc}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Mobile Number</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Email Address</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>

          <h3 style="color: #1e293b; margin-top: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">Selected Stores & Capacity (${totalRacks} Racks total)</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="padding: 8px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Store/Area</th>
                <th style="padding: 8px; text-align: right; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Racks</th>
                <th style="padding: 8px; text-align: right; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Rate/Shelf</th>
                <th style="padding: 8px; text-align: right; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => `
                <tr>
                  <td style="padding: 8px; font-size: 14px; border-bottom: 1px solid #f1f5f9;">${item.storeName || "Store"} (${item.cityName || "—"})</td>
                  <td style="padding: 8px; font-size: 14px; text-align: right; border-bottom: 1px solid #f1f5f9;">${item.racks || 0}</td>
                  <td style="padding: 8px; font-size: 14px; text-align: right; border-bottom: 1px solid #f1f5f9;">₹1,600</td>
                  <td style="padding: 8px; font-size: 14px; text-align: right; border-bottom: 1px solid #f1f5f9;">₹${((item.racks || 0) * 1600).toLocaleString("en-IN")}</td>
                </tr>
              `).join("")}
              <tr style="font-weight: bold; background-color: #f8fafc;">
                <td style="padding: 10px 8px; font-size: 14px;">Total Billing Amount</td>
                <td style="padding: 10px 8px; font-size: 14px; text-align: right;">${totalRacks}</td>
                <td style="padding: 10px 8px; font-size: 14px; text-align: right;">—</td>
                <td style="padding: 10px 8px; font-size: 14px; text-align: right; color: #4f46e5;">₹${totalAmount.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
      break;
    }
    case "documents_uploaded": {
      subject = `[KYC Documents Submitted] ${brandName}`;
      const uploads = data.uploads || {};
      const docsCount = Object.keys(uploads).length;

      htmlContent = `
        <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 0;">KYC Documents Uploaded</h2>
          <p>A client has successfully uploaded their onboarding files and finalized registration details!</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; width: 40%;">Brand Name</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${brandName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Point of Contact</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${poc}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Mobile Number</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Email Address</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>

          <h3 style="color: #1e293b; margin-top: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">Uploaded Verification Documents (${docsCount})</h3>
          <ul style="padding-left: 20px; margin-top: 10px;">
            ${Object.entries(uploads).map(([key, file]) => `
              <li style="margin-bottom: 8px;">
                <strong>${key.toUpperCase()}</strong>: ${file.name} 
                <span style="color: #64748b; font-size: 13px;">(${parseFloat((file.size / 1024).toFixed(1))} KB)</span>
              </li>
            `).join("")}
          </ul>
          
          <p style="margin-top: 30px; font-size: 14px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 15px;">
            You can review the full application payload in the Partner Portal Admin Dashboard.
          </p>
        </div>
      `;
      break;
    }
    case "payment_verified": {
      subject = `[Payment Completed & Verified] ${brandName}`;
      const amount = data.amount || 0;
      const paymentId = data.paymentId || "—";
      const isMock = data.isMock ? "(Mock Payment)" : "";

      htmlContent = `
        <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #10b981; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 0;">Payment Verified Successfully</h2>
          <p>Great news! A client application payment was verified and shelves have been allocated dynamically.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; width: 40%;">Brand Name</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${brandName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Point of Contact</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${poc}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Payment ID</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><code>${paymentId}</code> ${isMock}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Amount Received</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #10b981;">₹${amount.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Email Address</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>
        </div>
      `;
      break;
    }
    default: {
      subject = `[Notification] Client Submission - ${brandName}`;
      htmlContent = `
        <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 0;">Submission Received</h2>
          <pre style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; overflow-x: auto;">
${JSON.stringify(data, null, 2)}
          </pre>
        </div>
      `;
    }
  }

  // Send the email if transporter is available
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: SMTP_FROM,
        to: NOTIFICATION_EMAIL,
        subject: subject,
        html: htmlContent,
      });
      console.log(`[MAIL SERVICE] Email sent successfully to ${NOTIFICATION_EMAIL}: MessageID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`[MAIL SERVICE] Error sending email via SMTP to ${NOTIFICATION_EMAIL}:`, error);
      // Fallback log
      logSimulatedMail(subject, htmlContent);
      return { success: false, error: error.message };
    }
  } else {
    // If not configured, print simulated mail
    logSimulatedMail(subject, htmlContent);
    return { success: true, simulated: true };
  }
}

function logSimulatedMail(subject, htmlContent) {
  console.log(`
========================================================================
[MAIL SERVICE SIMULATION - SMTP NOT CONFIGURED]
To: ${NOTIFICATION_EMAIL}
From: ${SMTP_FROM}
Subject: ${subject}

HTML BODY PREVIEW:
------------------------------------------------------------------------
${htmlContent.replace(/<[^>]*>/g, "").replace(/\n\s*\n/g, "\n").trim()}
------------------------------------------------------------------------
========================================================================
  `);
}
