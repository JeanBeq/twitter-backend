const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("./index");
class User extends Model {
  toJSON() {
    return {
      username: this.username,
    };
  }
}

User.init(
  {
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

module.exports = User;