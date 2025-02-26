"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    return queryInterface.bulkInsert("Blogs", [
      {
        authorId: 1,
        title: "Postgres Is Cool",
        image: "assets/img/coding.jpg",
        content:
          " Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        authorId: 2,
        title: "Javascript Is Cool",
        image: "assets/img/blog.jpg",
        content:
          " It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        authorId: 3,
        title: "Dumbways Is Cool",
        image: "assets/img/dumb.jpg",
        content:
          " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", null, {});
  },
};
