const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const upload = require("./middlewares/upload-file");
const hbs = require("hbs");

// Set Handlebars as view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));
hbs.registerHelper("eq", (a, b) => a === b);

hbs.registerHelper("formatDate", function (dateString) {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
});

hbs.registerHelper("containsSkill", (skills, skill, options) => {
  if (!skills) return ""; // Jika skills kosong/null, jangan tampilkan checked

  const skillArray = skills.split(","); // Pisahkan string skill menjadi array
  return skillArray.includes(skill) ? "checked" : ""; // Beri checked jika skill ditemukan
});

const {
  renderHome,
  renderLogin,
  renderRegister,
  renderContact,
  renderTestimonials,
  authLogin,
  authRegister,
  authLogout,
  renderProjects,
  deleteProject,
  updateProject,
  createProject,
  renderProjectEdit,
  searchProjects,
} = require("./controllers/controller-v2");

const checkUser = require("./middlewares/auth");
const port = process.env.SERVER_PORT || 5050;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use(methodOverride("_method"));
app.use(flash());

app.use(
  session({
    name: "my-session",
    secret: "lalalaala",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.get("/", renderHome);
app.get("/login", renderLogin);
app.get("/register", renderRegister);
app.get("/logout", authLogout);
app.post("/login", authLogin);
app.post("/register", authRegister);
app.get("/contact", renderContact);

app.get("/testimonials", renderTestimonials);
app.get("/project-search/:keyword", searchProjects);
app.get("/addproject", (req, res) => {
  res.render("project-add", { title: "Add My Project" });
});
app.get("/projects", renderProjects);
app.post("/project-add", checkUser, upload.single("image"), createProject);
app.delete("/projects/:id", deleteProject);
app.get("/project-update/:id", checkUser, renderProjectEdit); // Menampilkan form edit proyek
app.patch(
  "/project-update/:id",
  checkUser,
  upload.single("image"),
  updateProject
); // Mengupdate proyek

// 404 Page
app.get("*", (req, res) => {
  res.render("page-404");
});

// Start Server
app.listen(port, () => {
  console.log(`My personal web app listening on port ${port}`);
});
