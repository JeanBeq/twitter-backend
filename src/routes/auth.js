const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Inscription
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    // Si des champs sont manquants, renvoyer une réponse 400
    return res.status(400).json({ error: "Champs manquants" });
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);
  // Créer un nouvel utilisateur
  const newUser = await User.create({ email, username, password: hashedPassword });

  // Générer un token JWT
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log(newUser);
  res.status(201).json({
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    },
    token
  });
});

// Connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // Si des champs sont manquants, renvoyer une réponse 400
    return res.status(400).json({ error: "Champs manquants" });
  }

  // Rechercher l'utilisateur par email
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    // Si l'utilisateur n'est pas trouvé ou le mot de passe est incorrect, renvoyer une réponse 401
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });
  }

  // Générer un token JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    token
  });
});

module.exports = router;