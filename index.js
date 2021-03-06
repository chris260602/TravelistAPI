const express = require("express");
const https = require("https");
const fs = require("fs");
const { errorCatching } = require("./errorHandling");
require("dotenv").config();
const app = express();
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const categoriesRouter = require("./routes/categoryRoutes");
const cartRouter = require("./routes/cartRoutes");
const favouriteRouter = require("./routes/favouriteRoutes");
const topUpRouter = require("./routes/topUpRoutes");
const emailRouter = require("./routes/emailRoutes");
const transactionRouter = require("./routes/transactionRoutes");
const notificationRouter = require("./routes/notificationRoutes");

require("./connection");
const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  credentials: true,
};
const cors = require("cors");
app.use(express.json({ limit: "16mb" }));
app.use(cors(corsOptions));

app.use("/public", express.static(`public`));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Travelist API 1.0 Created by Christoper Lim, Martin & Reihan");
});

app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/categories", categoriesRouter);
app.use("/cart", cartRouter);
app.use("/transaction", transactionRouter);
app.use("/favourite", favouriteRouter);
app.use("/topup", topUpRouter);
app.use("/email", emailRouter);
app.use("/notification", notificationRouter);
app.use(errorCatching);

if (process.env.ISSECURE === "false") {
  app.listen(process.env.PORT, () => {
    console.log("Listening");
  });
} else {
  https
    .createServer(
      {
        key: fs.readFileSync("server.key"),
        cert: fs.readFileSync("server.cert"),
      },
      app
    )
    .listen(process.env.PORT, function () {
      console.log("Listening");
    });
}
