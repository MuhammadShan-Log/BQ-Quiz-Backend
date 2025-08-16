const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const debug = require("debug")("Development:Server");
const authRoutes = require("./routes/userRoute");
const courseRoutes = require("./routes/courseRoute");
const quizRoutes = require("./routes/quizRoutes");
const db = require("./config/db_connection");

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/course", courseRoutes);
app.use("/quizzes", quizRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => debug(`Server running on port ${PORT}`));
