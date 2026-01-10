const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// תחליף לכתובת של האתר שלך ב-Vercel אחרי שתעלה
app.use(cors({ origin: "*" }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express backend" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server listening on", port));
