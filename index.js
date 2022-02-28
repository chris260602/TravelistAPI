const express = require("express");

require("dotenv").config({ path: __dirname + "/config.env" });
const app = express();
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const cors = require("cors");
app.use(express.json({ limit: "16mb" }));
app.use(cors());
app.get("/", (req, res) => {
  res.send("Travelist API 1.0 Created by Christoper Lim, Martin & Reihan");
});
app.use("/user", userRouter);
app.use("/products", productRouter);
module.exports = app;
