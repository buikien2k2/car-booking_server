import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import nodemailer from "nodemailer";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

/* ======================
   MAIL SETUP
====================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
console.log("MAIL USER:", process.env.MAIL_USER);
console.log("MAIL PASS:", process.env.MAIL_PASS);
/* ======================
   API BOOKING
====================== */
app.post("/booking", async (req, res) => {
  try {
    const {
      fullname,
      phone,
      email,
      pickup_location,
      dropoff_location,
      pickup_date,
      pickup_time,
      car_type,
    } = req.body;

    /* ===== TELEGRAM ===== */
    const telegramMessage = `
🚗 ĐƠN ĐẶT XE MỚI
👤 Tên: ${fullname}
📞 SĐT: ${phone}
📧 Email: ${email}

📍 Đón: ${pickup_location}
📍 Trả: ${dropoff_location}

🗓 Ngày: ${pickup_date}
⏰ Giờ: ${pickup_time}
🚘 Xe: ${car_type || "Không chọn"}
    `;

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: telegramMessage,
      }),
    });

    /* ===== MAIL KHÁCH ===== */
    await transporter.sendMail({
      from: `"Nhà xe ABC" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "✅ Xác nhận đặt xe thành công",
      html: `
        <h3>Xin chào ${fullname}</h3>
        <p>Đơn đặt xe của bạn đã được ghi nhận:</p>
        <ul>
          <li>📍 Đón: ${pickup_location}</li>
          <li>📍 Trả: ${dropoff_location}</li>
          <li>🗓 Ngày: ${pickup_date}</li>
          <li>⏰ Giờ: ${pickup_time}</li>
          <li>🚘 Xe: ${car_type || "Không chọn"}</li>
        </ul>
        <p>Nhà xe sẽ liên hệ sớm ❤️</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
