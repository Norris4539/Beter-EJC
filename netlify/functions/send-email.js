const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://norris4539.github.io",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: "Method not allowed" }) };
  }

  try {
    const { to, subject, senderName, pdfBase64, filename } = JSON.parse(event.body);

    if (!to || !pdfBase64) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Missing required fields" }) };
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const base64Data = pdfBase64.includes(",") ? pdfBase64.split(",")[1] : pdfBase64;

    await transporter.sendMail({
      from: `"${senderName || "JobFlow"}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text: "Please find the completion report attached.",
      html: `<p>Please find the jobcard completion report attached.</p><p style="color:#7a6e5e;font-size:12px">Sent via JobFlow</p>`,
      attachments: [
        {
          filename,
          content: base64Data,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("send-email error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
