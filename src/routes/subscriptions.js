const express = require("express");
const Subscription = require("../models/subscription");
const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { endpoint, keys } = req.body;
  if (!endpoint || !keys) {
    return res.status(400).json({ error: "Invalid subscription data" });
  }

  const subscription = await Subscription.create({ endpoint, keys });
  res.status(201).json(subscription);
});

module.exports = router;