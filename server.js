const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const upload = require("./middlewares/upload-file");
const Comment = require("./models/comment");
// const exphbs = require("express-handlebars");
const hbs = require("hbs");

// const hbs = exphbs.create({
//   helpers: {
//     eq: (a, b) => a === b,
//   },
//   defaultLayout: "layout",
//   layoutsDir: path.join(__dirname, "views/partials"),
//   partialsDir: path.join(__dirname, "views/partials"),
// });

// app.engine("handlebars", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

const {
  renderHome,
  renderLogin,
  renderRegister,
  renderContact,
  renderTestimonials,
  authLogin,
  authRegister,
  authLogout,
  renderBlog,
  renderBlogDetail,
  deleteBlog,
  renderBlogCreate,
  createBlog,
  renderBlogEdit,
  updateBlog,
  renderError,
  renderCreateProject,
  renderProjects,
  deleteProject,
  renderProjectEdit,
  updateProject,
  createProject,
  getProjectById,
} = require("./controllers/controller-v2");

const { formatDateToWIB, getRelativeTime } = require("./utils/time");
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

hbs.registerPartials(__dirname + "/views/partials", function (err) {});
hbs.registerHelper("eq", function (a, b) {
  return a === b;
});

// ROUTES
app.get("/", renderHome);
app.get("/login", renderLogin);
app.get("/register", renderRegister);
app.get("/logout", authLogout);
app.post("/login", authLogin);
// app.post("/auth-login", authLogin);
app.post("/register", authRegister);

app.get("/contact", renderContact);
app.get("/blog", renderBlog);
app.get("/blog-create", checkUser, renderBlogCreate);
app.post("/blog-create", checkUser, upload.single("image"), createBlog);
app.get("/blog-edit/:id", renderBlogEdit);
app.patch("/blog-update/:id", updateBlog);
app.delete("/blog/:id", deleteBlog);
app.get("/blog/:id", renderBlogDetail);

app.get("/testimonials", (req, res) => {
  res.render("testimonials", { ratings: [5, 4, 3, 2, 1] });
});

// PROJECT ROUTES
app.get("/addproject", (req, res) => {
  res.render("project-add", { title: "Add My Project" });
});
app.get("/projects", renderProjects);
app.post("/project-add", checkUser, upload.single("image"), createProject);
app.get("/projects/:id", getProjectById);
app.delete("/projects/:id", deleteProject);
app.get("/editproject/:id", checkUser, renderProjectEdit);
app.patch("/project-update/:id", checkUser, updateProject);

// CONTACT ME
app.get("/contact", renderContact);

// Rute wildcard untuk 404
app.get("*", (req, res) => {
  res.render("page-404");
});

// Start Server
app.listen(port, () => {
  console.log(`My personal web app listening on port ${port}`);
});
