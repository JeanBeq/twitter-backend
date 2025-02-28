const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Subscription = sequelize.define("Subscription", {
  endpoint: { type: DataTypes.STRING, allowNull: false }, // L'endpoint est obligatoire
  keys: {
    type: DataTypes.JSON,
    allowNull: false, // Les clés sont obligatoires
  },
});

module.exports = Subscription;