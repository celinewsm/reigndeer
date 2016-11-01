'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clientId: {
        type: Sequelize.INTEGER
      },
      courierId: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      itemType: {
        type: Sequelize.INTEGER
      },
      itemDescription: {
        type: Sequelize.TEXT
      },
      pickupLatitude: {
        type: Sequelize.DECIMAL(12,9)
      },
      pickupLongitude: {
        type: Sequelize.DECIMAL(12,9)
      },
      pickupTimeDate: {
        type: Sequelize.DATE
      },
      pickupAddress: {
        type: Sequelize.TEXT
      },
      pickupPostalCode: {
        type: Sequelize.INTEGER
      },
      pickupCountryId: {
        type: Sequelize.INTEGER
      },
      pickupContactName: {
        type: Sequelize.STRING
      },
      pickupContactNumber: {
        type: Sequelize.INTEGER
      },
      dropoffLatitude: {
        type: Sequelize.DECIMAL(12,9)
      },
      dropoffLongitude: {
        type: Sequelize.DECIMAL(12,9)
      },
      dropoffTimeDate: {
        type: Sequelize.DATE
      },
      dropoffAddress: {
        type: Sequelize.TEXT
      },
      dropoffPostalCode: {
        type: Sequelize.INTEGER
      },
      dropoffCountryId: {
        type: Sequelize.INTEGER
      },
      dropoffContactName: {
        type: Sequelize.STRING
      },
      dropoffContactNumber: {
        type: Sequelize.INTEGER
      },
      courierCurrentLatitude: {
        type: Sequelize.DECIMAL(12,9)
      },
      courierCurrentLongitude: {
        type: Sequelize.DECIMAL(12,9)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('jobs');
  }
};
