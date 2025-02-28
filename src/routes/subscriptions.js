const express = require("express");
const Subscription = require("../models/subscription");
const router = express.Router();

// Route pour s'abonner aux notifications
router.post("/subscribe", async (req, res) => {
  const { endpoint, keys } = req.body;
  if (!endpoint || !keys) {
    // Si les données de l'abonnement sont invalides, renvoyer une réponse 400
    return res.status(400).json({ error: "Invalid subscription data" });
  }

  // Créer un nouvel abonnement
  const subscription = await Subscription.create({ endpoint, keys });
  res.status(201).json(subscription);
});

module.exports = router;