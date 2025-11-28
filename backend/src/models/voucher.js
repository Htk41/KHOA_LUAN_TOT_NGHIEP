'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Voucher.init({
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    discountType: {
      type: DataTypes.ENUM,
      values: ['percent', 'fixed_amount'],
      allowNull: false
    },
    discountValue: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0 // Số lượng không thể âm
      }
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};