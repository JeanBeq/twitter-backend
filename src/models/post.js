const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");
const User = require("./User");

const Post = sequelize.define("Post", {
  content: { type: DataTypes.TEXT, allowNull: false }, // Le contenu est obligatoire
  photoUrl: { type: DataTypes.STRING, allowNull: true }, // Nouveau champ pour les photos
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Date de création par défaut à maintenant
});

// Définir les relations entre les modèles
Post.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Post, { foreignKey: "userId", as: "posts" });

module.exports = Post;