const bcrypt = require("bcrypt");
const { Blog, User, Project, sequelize } = require("../models");
const { Op } = require("sequelize");
require("dotenv").config();

const saltRounds = 10;

async function renderPage(req, res, page, data = {}) {
  res.render(page, { user: req.session.user, ...data });
}

async function renderHome(req, res) {
  renderPage(req, res, "index");
}

async function renderContact(req, res) {
  renderPage(req, res, "contact");
}

async function renderTestimonials(req, res) {
  renderPage(req, res, "testimonials", { ratings: [5, 4, 3, 2, 1] });
}

async function renderLogin(req, res) {
  if (req.session.user) {
    req.flash("warning", "User already logged in.");
    return res.redirect("/");
  }
  renderPage(req, res, "auth-login");
}

async function renderRegister(req, res) {
  if (req.session.user) {
    return res.redirect("/");
  }
  renderPage(req, res, "auth-register");
}

async function authLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    req.flash("error", "Email atau password salah.");
    return res.redirect("/login");
  }
  req.session.user = user.toJSON();
  delete req.session.user.password;
  req.flash("success", `Selamat datang, ${user.name}!`);
  res.redirect("/");
}

async function authRegister(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    req.flash("error", "Password tidak sesuai.");
    return res.redirect("/register");
  }
  if (await User.findOne({ where: { email } })) {
    req.flash("error", "Email sudah terpakai.");
    return res.redirect("/register");
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await User.create({ name, email, password: hashedPassword });
  req.flash("success", "Berhasil mendaftar. Silakan login.");
  res.redirect("/login");
}

async function authLogout(req, res) {
  req.session.destroy(() => res.redirect("/login"));
}

// async function renderBlog(req, res) {
//   const blogs = await Blog.findAll({
//     include: { model: User, as: "user", attributes: { exclude: ["password"] } },
//     order: [["createdAt", "DESC"]],
//   });
//   renderPage(req, res, "blog-list", { blogs });
// }

const searchProjects = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${keyword}%` } }, // Cari berdasarkan title
          { content: { [Op.iLike]: `%${keyword}%` } }, // Bisa juga mencari berdasarkan content
        ],
      },
    });

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    return res.json(projects);
  } catch (error) {
    console.error("Error searching projects:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

async function renderProjects(req, res) {
  const projects = await Project.findAll({ raw: true });
  projects.forEach((project) => {
    project.skill = project.skill ? project.skill.split(",") : [];
  });
  renderPage(req, res, "projects", { projects });
}

async function renderCreateProject(req, res) {
  renderPage(req, res, "project-add");
}

async function createProject(req, res) {
  const { name, start, end, description, technologies } = req.body;
  const techString = Array.isArray(technologies)
    ? technologies.join(",")
    : technologies;
  await Project.create({
    title: name,
    authorId: req.session.user.id,
    image: req.file.filename,
    startDate: start,
    endDate: end,
    content: description,
    skill: techString,
  });
  res.redirect("/projects");
}

// async function updateProject(req, res) {
//   const { id } = req.params;
//   const { title, start, end, content, technologies } = req.body;
//   await Project.update(
//     { title, startDate: start, endDate: end, content, skill: technologies },
//     { where: { id } }
//   );
//   req.flash("success", "Project updated successfully!");
//   res.redirect("/projects");
// }

async function updateProject(req, res) {
  const { id } = req.params;
  const { name, start, end, description, technologies } = req.body;
  const techString = Array.isArray(technologies)
    ? technologies.join(",")
    : technologies ?? "";

  try {
    const project = await Project.findOne(id);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await project.update({
      title: name,
      startDate: start,
      endDate: end,
      content: description,
      skill: techString,
      image: req.file?.filename || project.image, // Tetap gunakan gambar lama jika tidak diupload
    });

    res.redirect("/projects");
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).send("Error updating project");
  }
}

async function renderProjectEdit(req, res) {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).send("Project not found");
    }
    project.startDate = new Date(project.startDate).toISOString().split("T")[0];
    project.endDate = new Date(project.endDate).toISOString().split("T")[0];

    res.render("project-edit", { project });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading project edit page");
  }
}

async function deleteProject(req, res) {
  await Project.destroy({ where: { id: req.params.id } });
  res.send("Project deleted");
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
  renderProjects,
  renderCreateProject,
  createProject,
  updateProject,
  searchProjects,
  deleteProject,
  renderProjectEdit,
};
