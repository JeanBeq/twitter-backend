const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");
const User = require("./User");

const Post = sequelize.define("Post", {
  content: { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Post.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Post, { foreignKey: "userId", as: "posts" });

module.exports = Post;