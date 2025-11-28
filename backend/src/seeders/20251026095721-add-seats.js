'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Seats', [
    {
      airplaneId: 1,
      row: 1,
      col: 'A',
      createdAT: new Date(),
      updatedAt: new Date()
    },
    {
      airplaneId: 1,
      row: 1,
      col: 'B',
      createdAT: new Date(),
      updatedAt: new Date()
    },
    {
      airplaneId: 1,
      row: 1,
      col: 'C',
      createdAT: new Date(),
      updatedAt: new Date()
    },
    {
      airplaneId: 1,
      row: 1,
      col: 'D',
      createdAT: new Date(),
      updatedAt: new Date()
    },
    {
      airplaneId: 1,
      row: 1,
      col: 'E',
      createdAT: new Date(),
      updatedAt: new Date()
    },
    {
      airplaneId: 1,
      row: 1,
      col: 'F',
      createdAT: new Date(),
      updatedAt: new Date()
    },
//ro2
    {
      airplaneId: 1,
      row: 2,
      col: 'A',
      createdAT: new Date(),
      updatedAt: new Date()
    },
    {
      airplaneId: 1,
      row: 2,
      col: 'B',
      createdAT: new Date(),
      updatedAt: new Date()
    },
    {
      airplaneId: 1,
      row: 2,
      col: 'C',
      createdAT: new Date(),
      updatedAt: new Date()
    },
    {
      airplaneId: 1,
      row: 2,
      col: 'D',
      createdAT: new Date(),
      updatedAt: new Date()
    },
    {
      airplaneId: 1,
      row: 2,
      col: 'E',
      createdAT: new Date(),
      updatedAt: new Date()
    },
    {
      airplaneId: 1,
      row: 2,
      col: 'F',
      createdAT: new Date(),
      updatedAt: new Date()
    },
   ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
