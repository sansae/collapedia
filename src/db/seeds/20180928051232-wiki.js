'use strict';
const faker = require("faker");

let wikis = [];

for (let i = 1; i <= 20; i++) {
  let booleanValues = [true, false];
  let randomNumber = Math.floor(Math.random() * booleanValues.length);

  wikis.push({
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: booleanValues[randomNumber],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: Math.ceil(Math.random() * 10)
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Wikis", null, {});
  }
};
