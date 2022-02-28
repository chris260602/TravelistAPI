const express = require("express");
require("dotenv").config({ path: __dirname + "/config.env" });
const app = express();
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

const corsOptions = {
  origin: "http://localhost:3000", //frontend url
  credentials: true,
};
// console.log(`${__dirname}/public/img`);
const cors = require("cors");
app.use(express.json({ limit: "16mb" }));
app.use(cors(corsOptions));
app.use("/public", express.static(`public`));
app.get("/", (req, res) => {
  res.send("Travelist API 1.0 Created by Christoper Lim, Martin & Reihan");
});
app.use("/user", userRouter);
// app.use("/products", productRouter);
module.exports = app;
