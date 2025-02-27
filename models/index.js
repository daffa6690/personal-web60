"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith(".js"))
  .forEach((file) => {
    const modelFile = require(path.join(__dirname, file));

    if (typeof modelFile === "function") {
      const model = modelFile(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
