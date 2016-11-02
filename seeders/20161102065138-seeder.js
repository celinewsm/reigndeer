'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */


    return queryInterface.bulkInsert('itemCategories', [{
      name: 'Document',
      height: 297,
      width: 420,
      depth: 10,
      weight: 200,
    },{
      name: 'Small',
      height: 300,
      width: 300,
      depth: 100,
      weight: 500,
    },{
      name: 'Medium',
      height: 450,
      width: 450,
      depth: 200,
      weight: 1500,
    },{
      name: 'Large',
      height: 750,
      width: 750,
      depth: 500,
      weight: 3000,
    },{
      name: 'Odd Sized',
      height: 1000,
      width: 1000,
      depth: 1000,
      weight: 15000,
    }
  ]);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('itemCategories', null, {});


  }
};
