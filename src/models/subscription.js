const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Subscription = sequelize.define("Subscription", {
  endpoint: { type: DataTypes.STRING, allowNull: false },
  keys: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

module.exports = Subscription;