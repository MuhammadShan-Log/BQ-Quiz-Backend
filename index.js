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
app.use(cors());

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
