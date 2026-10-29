
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}));
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Email server is running." });
});

app.post("/api/send-test-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      return res.status(503).json({
        message: "Email service is not configured yet.",
      });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [email],
      subject: "Mentor Dashboard test notification",
      html: `
        <h2>Mentor Dashboard</h2>
        <p>Your test email notification is working.</p>
        <p>You received this because a test email was requested from your dashboard.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({
        message: "The email service could not send the message.",
      });
    }

    return res.json({
      message: "Email accepted by the email service.",
      id: data?.id,
    });
  } catch (error) {
    console.error("Email server error:", error);
    return res.status(500).json({
      message: "An unexpected server error occurred.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Email server running on http://localhost:${PORT}`);
});
