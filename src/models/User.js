const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("./index");

class User extends Model {
  toJSON() {
    // Retourner uniquement le nom d'utilisateur dans la réponse JSON
    return {
      username: this.username,
    };
  }
}

User.init(
  {
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Le mot de passe est obligatoire
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // L'email est obligatoire
      unique: true, // L'email doit être unique
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false, // Le nom d'utilisateur est obligatoire
      unique: true, // Le nom d'utilisateur doit être unique
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users", // Nom de la table dans la base de données
  }
);

module.exports = User;