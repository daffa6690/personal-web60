require("dotenv").config();
const pg = require("pg");

module.exports = {
  development: {
    username: "postgres",
    password: "daffa6690",
    database: "personal_web60",
    host: "127.0.0.1",
    port: "5432",
    dialect: "postgres",
    dialectModule: pg,
  },
  production: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
