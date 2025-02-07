const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello Bre!");
});

app.get("/about", (req, res) => {
  res.send("Hello Nodemon!");
});
app.listen(port, () => {
  console.log(`Personal web app listening on port ${port}`);
});
