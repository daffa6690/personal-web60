const express = require("express");
const app = express();
const port = 3000;
const hbs = require("hbs");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static("assets"));

hbs.registerPartials(__dirname + "/views/partials", function (err) {});

// app.get("/", (req, res) => {
//   // res.send("Hello Bre, halaman utama nih!");
//   res.send("index");
// });

// app.get("/about/:id", (req, res) => {
//   const id = req.params.id;
//   res.send("Halo, bagaimana harimu ? " + id);
// });
// app.listen(port, () => {
//   console.log(`Personal web app listening on port ${port}`);
// });

// // REQUEST QUERY
// app.get("/blog", (req, res) => {
//   const { title, author, year } = req.query;
//   res.send(`Ini Halaman Blog ${title} dengan author ${author} tahun ${year}`);
// });

app.listen(port, () => {
  console.log(`Personal web app listening on port ${port}`);
});
