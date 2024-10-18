"use strict";
const userGenerator = require("../faker/generateRandomUser.cjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //  * Add seed commands here.
    //  *
    //  * Example:
    await queryInterface.bulkInsert("Users", userGenerator.generateUser(50));
  },

  async down(queryInterface, Sequelize) {
    //  * Add commands to revert seed here.
    //  *
    //  * Example:
    await queryInterface.bulkDelete("Users", null, {});
  },
};
