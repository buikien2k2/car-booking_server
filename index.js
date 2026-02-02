import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-booking", async (req, res) => {
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

    const message = `
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

    await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: message,
        }),
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
