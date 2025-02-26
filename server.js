const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const upload = require("./middlewares/upload-file");

// const { renderBlogEdit, updateBlog } = require("./controllers/controller-v1");

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

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views")); // C://My Computer/Users/Documents/../../personal-web/views

// modul apa saja yang kita gunakan di dalam express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static("assets"));
app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use(methodOverride("_method"));
app.use(flash());

// const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    name: "my-session",
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true, sameSite: "none", maxAge: oneDay },
  })
);

hbs.registerPartials(__dirname + "/views/partials", function (err) {});
hbs.registerHelper("equal", function (a, b) {
  return a === b;
});
hbs.registerHelper("formatDateToWIB", formatDateToWIB);
hbs.registerHelper("getRelativeTime", getRelativeTime);

// HOME
app.get("/", renderHome);
app.get("/login", renderLogin);
app.get("/register", renderRegister);
app.get("/logout", authLogout);
app.post("/login", authLogin);
app.post("/register", authRegister);

// CONTACT ME
app.get("/contact", renderContact);

// BLOG LIST
app.get("/blog", renderBlog);

// RENDER CREATE BLOG
app.get("/blog-create", checkUser, renderBlogCreate);

// SUBMIT CREATE NEW BLOG
app.post("/blog-create", checkUser, upload.single("image"), createBlog);

// RENDER EDIT BLOG
app.get("/blog-edit/:id", renderBlogEdit);

// SUBMIT/SAVE EDITED BLOG
app.patch("/blog-update/:id", updateBlog);

// DELETE EXISTING BLOG
app.delete("/blog/:id", deleteBlog);

// BLOG DETAIL
app.get("/blog/:id", renderBlogDetail);

// TESTIMONIALS
app.get("/testimonials", renderTestimonials);

//MYPROJECT
app.get("/addproject", checkUser, renderCreateProject);
app.get("/projects", renderProjects);
app.post("/project-add", checkUser, upload.single("image"), createProject);
app.get("/projects/:id", getProjectById);
app.delete("/projects/:id", deleteProject);
app.get("/editproject/:id", checkUser, renderProjectEdit);
app.patch("/project-update/:id", checkUser, updateProject);

app.get("*", renderError);

app.get("*", (req, res) => {
  res.render("page-404");
});

app.listen(port, () => {
  console.log(`My personal web app listening on port ${port}`);
});
