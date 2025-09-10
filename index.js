const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const debug = require("debug")("Development:Server");
const authRoutes = require("./routes/userRoute");
const courseRoutes = require("./routes/courseRoute");
const quizRoutes = require("./routes/quizRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

require("./config/db_connection");

app.use(express.json());
app.use(cors({
  origin: ["https://bq-quiz-frontend.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
}));

app.use("/auth", authRoutes);
app.use("/course", courseRoutes);
app.use("/quizzes", quizRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(), 
    timestamp: new Date().toISOString(),
    service: "BQ Quiz Backend"
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
