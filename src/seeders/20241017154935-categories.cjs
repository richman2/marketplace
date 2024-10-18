"use strict";
const { generateCategory } = require("../faker/randomCategory.cjs");

/** @type {import('sequelize-cli').Migration} */

const electronicDevices = ["computer", "headPhone", "televisions", "camera", "mobile"];
const books = ["programming", "math", "engineering", "psychology", "medicine"];
const personalAppliance = ["beauty", "personalCare"];
const vehicles = ["powerTools", "noneElectricalTools"];
const apparel = ["mens", "womens"];
const brand = ["apple", "dell", "hp", "lenovo", "asus"];
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
    await queryInterface.bulkInsert("Categories", generateCategory(apparel, 5, "/apparel/"));
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Categories", null, {});
  },
};

// electronicDevices, 1, '/electronicDevices/'
// brand, 6, '/electronicDevices/computer/'
