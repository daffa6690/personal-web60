const { Sequelize, QueryTypes } = require("sequelize");
const config = require("../config/config.js");
require("dotenv").config();

const sequelize = new Sequelize(config[process.env.NODE_ENV]);

let blogs = [
  {
    title: "Pasar Coding di Indonesia",
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam nostrum assumenda, voluptates maiores sequi quisquam pariatur voluptatem non consequuntur dolor architecto, unde magni enim itaque. Nostrum quod veniam quaerat modi ducimus accusamus dolorem, repellat iusto, autem, ex in nesciunt eos mollitia quo numquam deserunt pariatur aut fugiat id maiores enim.",
    image: "/img/blog-img.png",
    author: "Erwin Setya",
    postedAt: new Date(
      "Fri July 21 2024 10:15:00 GMT+0700 (Western Indonesia Time)"
    ),
  },
  {
    title: "Blog Judul ke 2",
    content:
      "Nostrum quod veniam quaerat modi ducimus accusamus dolorem, repellat iusto, autem, ex in nesciunt eos mollitia quo numquam deserunt pariatur aut fugiat id maiores enim. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam nostrum assumenda, voluptates maiores sequi quisquam pariatur voluptatem non consequuntur dolor architecto, unde magni enim itaque.",
    image: "/img/coding.jpg",
    author: "Erwin Setya",
    postedAt: new Date(
      "Fri July 28 2024 20:35:00 GMT+0700 (Western Indonesia Time)"
    ),
  },
];

async function renderBlog(req, res) {
  const blogs = await sequelize.query(
    // melakukan proses pengolahan data secara manual
    `SELECT * FROM "Blogs" ORDER BY "createdAt" DESC`, // raw query
    {
      type: QueryTypes.SELECT,
    }
  );
  // console.log(blogs);
  res.render("blog-list", { blogs: blogs });
}

async function renderBlogDetail(req, res) {
  const id = req.params.id;

  const query = `SELECT * FROM "Blogs" WHERE id = ${id}`;

  const blogYangDipilih = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  console.log("hasil query", blogYangDipilih[0]);

  res.render("blog-detail", { blog: blogYangDipilih[0] });
}

async function createBlog(req, res) {
  const { title, content } = req.body; // title dan content adalah properti milik req.body
  console.log("judulnya adalah", title);
  console.log("contentnya :", content);

  let image = "https://picsum.photos/200/150";

  let query = `INSERT INTO "Blogs" (title, content, image)
              VALUES ('${title}', '${content}', '${image}')`;

  const newBlog = await sequelize.query(query, {
    type: QueryTypes.INSERT,
  });

  // blogs.push(newBlog);

  res.redirect("/blog");
}

async function renderBlogEdit(req, res) {
  const id = req.params.id;

  const query = `SELECT * FROM "Blogs" WHERE id = ${id}`;

  const blogYangDipilih = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  console.log("hasil query", blogYangDipilih[0]);

  res.render("blog-edit", { blog: blogYangDipilih[0] });
}

async function updateBlog(req, res) {
  const id = req.params.id;
  const { title, content } = req.body; // title dan content adalah properti milik req.body
  console.log("judul baru :", title);
  console.log("content baru :", content);

  const query = `UPDATE "Blogs"
                SET title = '${title}', content = '${content}'
                WHERE id = ${id}`;

  const updateResult = await sequelize.query(query, {
    type: QueryTypes.UPDATE,
  });

  console.log("result update :", updateResult);

  // let image = "https://picsum.photos/200/150";

  // let updatedBlog = {
  //   title: title,
  //   content: content,
  //   image: image,
  //   author: "Erwin Setya",
  //   postedAt: new Date(),
  // };

  // blogs[id] = updatedBlog;

  res.redirect("/blog");
}

async function deleteBlog(req, res) {
  const id = req.params.id;

  const query = `DELETE FROM "Blogs" WHERE id = ${id}`;

  const deleteResult = await sequelize.query(query, {
    type: QueryTypes.DELETE,
  });

  console.log("result query delete :", deleteResult);

  // blogs.splice(id, 1); // array manipulation => perubahan data pada array

  res.redirect("/blog");
}

module.exports = {
  renderBlog,
  renderBlogDetail,
  renderBlogEdit,
  createBlog,
  updateBlog,
  deleteBlog,
};
