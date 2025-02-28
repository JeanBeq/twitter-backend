const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost", // Hôte de la base de données
    port: process.env.DB_PORT || 3306, // Port de la base de données
    dialect: "mysql", // Type de base de données
  }
);

module.exports = { sequelize };
