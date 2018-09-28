'use strict';
const faker = require("faker");

let users = [];

for (let i = 1; i <= 10; i++) {
  let roles = ["standard", "premium", "admin"];
  let randomNumber = Math.floor(Math.random() * roles.length);

  users.push({
    username: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: roles[randomNumber],
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
