require("dotenv").config();
const cors = require("cors");

const express = require("express");
const app = express();

const authRoutes = require("./routes/userRoute");
const quizRoutes = require("./routes/quizRoute");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
