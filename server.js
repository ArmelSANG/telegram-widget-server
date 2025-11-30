
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post("/api/send", async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: "missing phone or message" });
  }

  const text = `📱 Message client
Numéro: ${phone}
Message: ${message}

WhatsApp direct: https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
      }
    );

    if (!response.ok) throw new Error("Telegram error");

    return res.json({ success: true });

  } catch (err) {
    console.error("Erreur Telegram :", err);
    return res.status(500).json({ error: "Impossible d'envoyer le message" });
  }
});

app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "Server working" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
