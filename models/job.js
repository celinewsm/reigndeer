'use strict';
module.exports = function(sequelize, DataTypes) {
  var job = sequelize.define('job', {
    clientId: DataTypes.INTEGER,
    courierId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    itemType: DataTypes.INTEGER,
    itemDescription: DataTypes.TEXT,
    pickupLatitude: DataTypes.DECIMAL(12,9),
    pickupLongitude: DataTypes.DECIMAL(12,9),
    pickupTimeDate: DataTypes.DATE,
    pickupAddress: DataTypes.TEXT,
    pickupPostalCode: DataTypes.INTEGER,
    pickupCountryId: DataTypes.INTEGER,
    pickupContactName: DataTypes.STRING,
    pickupContactNumber: DataTypes.INTEGER,
    dropoffLatitude: DataTypes.DECIMAL(12,9),
    dropoffLongitude: DataTypes.DECIMAL(12,9),
    dropoffTimeDate: DataTypes.DATE,
    dropoffAddress: DataTypes.TEXT,
    dropoffPostalCode: DataTypes.INTEGER,
    dropoffCountryId: DataTypes.INTEGER,
    dropoffContactName: DataTypes.STRING,
    dropoffContactNumber: DataTypes.INTEGER,
    courierCurrentLatitude: DataTypes.DECIMAL(12,9),
    courierCurrentLongitude: DataTypes.DECIMAL(12,9),
    price: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.job.belongsTo(models.user, {as: 'courierDetails', foreignKey: 'courierId' })
        models.job.belongsTo(models.user, {as: 'clientDetails', foreignKey: 'clientId' })
        models.job.belongsTo(models.itemCategory, {as: 'itemCategory', foreignKey: 'itemType' })
      }
    }
  });
  return job;
};
