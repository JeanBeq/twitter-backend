require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./src/models");
const postRoutes = require("./src/routes/posts");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");
const subscriptionRoutes = require("./src/routes/subscriptions");
const webpush = require("web-push");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/subscriptions", subscriptionRoutes);

const PORT = process.env.PORT || 5000;

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VITE_PUBLIC_PUSH_KEY,
  process.env.VITE_PRIVATE_PUSH_KEY
);

// Synchroniser les modèles avec la base de données et démarrer le serveur
sequelize.sync({ alter: true }).then(() => {
  console.log("Database connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});