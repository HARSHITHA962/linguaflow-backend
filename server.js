const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const authRoutes = require("./routes/auth");
const translateRoutes = require("./routes/translate");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/translate", translateRoutes);

app.get("/", (req, res) => {
    res.send("LinguaFlow Backend Running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server Running on Port ${process.env.PORT}`);
});