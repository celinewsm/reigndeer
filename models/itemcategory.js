'use strict';
module.exports = function(sequelize, DataTypes) {
  var itemCategory = sequelize.define('itemCategory', {
    name: DataTypes.STRING,
    height: DataTypes.FLOAT,
    width: DataTypes.FLOAT,
    depth: DataTypes.FLOAT,
    weight: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.itemCategory.hasMany(models.job, { foreignKey: 'itemType'});

      }
    }
  });
  return itemCategory;
};
