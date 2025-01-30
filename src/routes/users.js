const express = require("express");
const User = require("../models/User");
const Post = require("../models/post");
const requireAuthentication = require("../middlewares/require-auth");
const router = express.Router();

router.get("/:username", requireAuthentication, async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({
    where: { username },
    attributes: ["id", "username", "email", "createdAt", "updatedAt"],
    include: {
      model: Post,
      as: "posts",
      attributes: ["id", "content", "created_at"],
      order: [["created_at", "DESC"]],
    },
  });

  if (!user) {
    return res.status(404).json({ error: "Utilisateur non trouvé" });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    posts: user.posts,
  });
});

module.exports = router;