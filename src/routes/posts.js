const express = require("express");
const Post = require("../models/post");
const User = require("../models/User");
const requireAuthentication = require("../middlewares/require-auth");
const router = express.Router();

// Récupérer tous les posts (ordre anté-chronologique)
router.get("/", async (req, res) => {
  const posts = await Post.findAll({
    order: [["created_at", "DESC"]],
    include: {
      model: User,
      as: "user",
      attributes: ["username"],
    },
  });
  res.json(posts.map(post => ({
    id: post.id,
    content: post.content,
    created_at: post.created_at,
    user: {
      username: post.user.username,
    },
  })));
});

// Ajouter un post (authentification requise)
router.post("/", requireAuthentication, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Champs manquants" });

  const newPost = await Post.create({ userId: req.user.id, content });
  res.status(201).json({
    id: newPost.id,
    content: newPost.content,
    created_at: newPost.created_at,
    user: {
      username: req.user.username,
    },
  });
});

module.exports = router;