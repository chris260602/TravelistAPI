const app = require("./index");

// app.use(cors())
const port = 3000;
app.listen(port, () => {
  console.log("Listening");
});
