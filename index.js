require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./src/models");
const postRoutes = require("./src/routes/posts");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users"); // Nouvelle route

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes); // Nouvelle route

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log("Database connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});