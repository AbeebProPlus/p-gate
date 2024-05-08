require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./routes");
const path = require("path");

const port = process.env.PORT || 3001;

app.use("/", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "checkout.html"));
});
app.use(router);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
