const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Firebase Admin setup
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🚨 ALERT API
app.post("/send-alert", async (req, res) => {
  try {
    const { groupCode, title, body } = req.body || {};

    if (!groupCode) {
      return res.status(400).json({ error: "groupCode is required" });
    }

    const message = {
      topic: `group_${groupCode}`,
      data: {
        title: title || "ALERT 🚨",
        body: body || "Someone triggered alert",
      },
    };

    await admin.messaging().send(message);

    res.json({ ok: true, sentTo: `group_${groupCode}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Failed to send alert" });
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});
