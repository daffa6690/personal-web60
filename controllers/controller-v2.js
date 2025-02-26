const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const config = require("../config/config.js");
const { Blog, User, Project } = require("../models/index.js");
require("dotenv").config();

const sequelize = new Sequelize(config[process.env.NODE_ENV]);

const saltRounds = 10;

async function renderHome(req, res) {
  const user = req.session.user;
  console.log("usernya adalah :", user);
  res.render("index", { user: user });
}

async function renderContact(req, res) {
  const user = req.session.user;
  console.log("usernya adalah :", user);

  res.render("contact", { user: user });
}

async function renderTestimonials(req, res) {
  const user = req.session.user;
  console.log("usernya adalah :", user);

  res.render("testimonials", { user: user });
}

async function renderLogin(req, res) {
  const user = req.session.user;
  console.log("usernya adalah :", user);

  if (user) {
    req.flash("warning", "User already login.");
    res.redirect("/");
  } else {
    res.render("auth-login", { user: user });
  }
}

async function renderRegister(req, res) {
  const user = req.session.user;
  console.log("usernya adalah :", user);

  if (user) {
    res.redirect("/");
  } else {
    res.render("auth-register", { user: user });
  }
}

async function authLogin(req, res) {
  const { email, password } = req.body;
  // check kalau usernya ada atau tidak
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    req.flash("error", "User tidak ditemukan.");
    return res.redirect("/login");
  }

  // check kalau passwordnya salah
  const isValidated = await bcrypt.compare(password, user.password); // return sebuah boolean, apakah true atau false

  if (!isValidated) {
    req.flash("error", "Password mismatch.");
    return res.redirect("/login");
  }

  let loggedInUser = user.toJSON(); // convert dari object sequelize ke object biasa

  delete loggedInUser.password; // menghapus properti password pada object new user

  console.log("user setelah passwordnya di delete :", loggedInUser);
  req.session.user = loggedInUser;

  req.flash("success", `Selamat datang, ${loggedInUser.name}!`);
  res.redirect("/");
}

async function authRegister(req, res) {
  const { name, email, password, confirmPassword } = req.body; // object destructuring

  if (password != confirmPassword) {
    req.flash("error", "Password dan confirm password tidak sesuai.");
    return res.redirect("/register");
  }

  // check apakah email sudah terpakai
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (user) {
    console.log("usernya udah ada");
    req.flash("error", "Email sudah terpakai.");
    return res.redirect("/register");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = {
    name: name,
    email: email,
    password: hashedPassword,
  };

  console.log("user baru :", newUser);

  const userInsert = await User.create(newUser);

  req.flash("success", "Berhasil mendaftar. Silahkan login.");
  res.redirect("/login");
}

async function authLogout(req, res) {
  // hapus user dari session
  req.session.user = null;

  res.redirect("/login");
}

async function renderBlog(req, res) {
  const user = req.session.user;
  console.log("usernya adalah :", user);

  // kalau usernya ada atau kalau ada yang sedang login
  const blogs = await Blog.findAll({
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["password"] },
    },
    order: [["createdAt", "DESC"]],
  });

  console.log("hasil fetch data dari controller v2", blogs);

  // console.log("pemilik blog paling atas :", blogs[0].user);

  if (user) {
    res.render("blog-list", { blogs: blogs, user: user });
  } else {
    res.render("blog-list", { blogs: blogs });
  }
}

async function renderBlogDetail(req, res) {
  const user = req.session.user;
  console.log("usernya adalah :", user);

  const id = req.params.id;

  // type data nya adalah object bukan array
  const blogYangDipilih = await Blog.findOne({
    where: {
      id: id,
    },
  });

  if (blogYangDipilih === null) {
    res.render("page-404");
  } else {
    console.log("v2 blog detail :", blogYangDipilih);

    res.render("blog-detail", { blog: blogYangDipilih, user: user }); // tidak perlu index
  }
}

async function renderBlogCreate(req, res) {
  // memunculkan halaman create blog
  res.render("blog-create");
}

async function createBlog(req, res) {
  const user = req.session.user;

  if (!user) {
    req.flash("error", "Please login.");
    return res.redirect("/login");
  }
  // create blog submission
  const { title, content } = req.body; // title dan content adalah properti milik req.body

  let dummyImage = "https://picsum.photos/200/150";

  const image = req.file.path;
  console.log("image yg di upload :", image);

  const newBlog = {
    title, // ini sama saja dengan menuliskan title: title
    content,
    authorId: user.id,
    image: image,
  };

  const resultSubmit = await Blog.create(newBlog); // apa result nya ketika disubmit, gagal atau berhasil?

  res.redirect("/blog"); // URL, bukan nama file
}

async function deleteBlog(req, res) {
  const { id } = req.params;

  const deleteResult = await Blog.destroy({
    where: {
      id: id,
    },
  });

  console.log("result delete :", deleteResult);

  res.redirect("/blog");
}

async function renderBlogEdit(req, res) {
  const user = req.session.user;
  console.log("usernya adalah :", user);

  // render halaman edit blog
  const id = req.params.id;

  const blogYangDipilih = await Blog.findOne({
    where: {
      id: id,
    },
  });

  if (!user) {
    return res.redirect("/login");
  }

  if (blogYangDipilih === null) {
    res.render("page-404");
  } else {
    console.log("v2 blog detail :", blogYangDipilih);

    res.render("blog-edit", { blog: blogYangDipilih, user: user });
  }
}

async function updateBlog(req, res) {
  // update blog submission
  const id = req.params.id;
  const { title, content } = req.body;
  console.log("judulnya adalah", title);
  console.log("contentnya :", content);

  const updateResult = await Blog.update(
    {
      // form edit
      title,
      content,
      updatedAt: sequelize.fn("NOW"),
    },
    {
      // where clause atau filter yang mana yg mau di edit
      where: {
        id,
      },
    }
  );

  console.log("result update", updateResult);

  res.redirect("/blog");
}

async function renderError(req, res) {
  const user = req.session.user;
  console.log("usernya adalah :", user);

  res.render("page-404", { user: user });
}

async function renderProjects(req, res) {
  const user = req.session.user; // Tidak perlu 'await' karena session bukan async
  const projects1 = await Project.findAll({ raw: true });

  projects1.forEach((project) => {
    project.skillSet = project.skill ? project.skill.split(",") : [];
  });

  res.render("projects", {
    projects: projects1,
    user: user,
  });
}

async function renderCreateProject(req, res) {
  const user = await req.session.user;
  res.render("project-add");
}
async function createProject(req, res) {
  const user = await req.session.user;
  const { name, start, end, description, technologies } = req.body;
  const newProject = {
    title: name,
    authorId: user.id,
    image: "test",
    startDate: start,
    endDate: end,
    content: description,
    skills: technologies ? [].concat(technologies).join() : "",
  };
  const resultSubmit = await Project.create(newProject);
  res.redirect("/projects");
  // console.log(newProject.technologies.split(','));
}

async function getProjectById(req, res) {
  const { id } = req.params;
  const project = await Project.findOne({
    where: {
      id: id,
    },
  });
  res.render("project-detail", { project: project });
}

async function deleteProject(req, res) {
  const { id } = req.params;
  const delteResult = await Project.destroy({
    where: {
      id: id,
    },
  });
  res.send("Project deleted");
}
async function updateProject(req, res) {
  const id = req.params.id;
  const { title, content, technologies, start, end } = req.body;

  const updateResult = await Project.update(
    {
      title: title,
      content: content,
      skills: technologies ? [].concat(technologies).join() : "", //[].concat artinya tecnologies yang dichecked, dimasukin ke array kosong. lalu di join() dijadiin string
      startDate: start,
      endDate: end,
      updatedAt: sequelize.fn("NOW"),
    },
    {
      where: {
        id,
      },
    }
  );
  res.redirect("/projects");
}

async function renderProjectEdit(req, res) {
  const id = req.params.id;
  const user = await req.session.user;
  const chosenProject = await Project.findOne({
    where: {
      id: id,
    },
  });
  if (chosenProject === null) {
    return res.render("page-404");
  }

  const start = format(chosenProject.startDate, "yyyy-MM-dd");
  const end = format(chosenProject.endDate, "yyyy-MM-dd");
  const skillsArray = chosenProject.skills
    ? chosenProject.skills.split(",")
    : [];
  await res.render("project-edit", {
    //UPDATE:  TIPE DATA TIDAK PERLU PAKE INDEX KAYA PAKE V1, KARENA TIPE DATANYA SUDAH OBJECT, BUKAN ARRAY
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    project: {
      ...chosenProject.get({ plain: true }),
      startDate: start,
      endDate: end,
      skills: skillsArray,
    }, //nampilin blog
    title: "Project Edit",
    currentPage: "project",
    ...icon,
  });
}

module.exports = {
  renderHome,
  renderContact,
  renderTestimonials,
  renderLogin,
  renderRegister,
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
  renderCreateProject,
  renderProjects,
  renderProjectEdit,
  createProject,
  deleteProject,
  updateProject,
  renderError,
  getProjectById,
};
