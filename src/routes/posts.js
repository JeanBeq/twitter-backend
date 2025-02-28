const express = require("express");
const multer = require("multer");
const path = require("path");
const webpush = require("web-push");
const Post = require("../models/post");
const User = require("../models/User");
const Subscription = require("../models/subscription");
const requireAuthentication = require("../middlewares/require-auth");
const router = express.Router();

// Configuration de multer pour le téléchargement des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

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
    photoUrl: post.photoUrl, // Inclure l'URL de la photo
    created_at: post.created_at,
    user: {
      username: post.user.username,
    },
  })));
});

// Ajouter un post (authentification requise)
router.post("/", requireAuthentication, upload.single("photo"), async (req, res) => {
  const { content } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null; // URL de la photo

  if (!content) return res.status(400).json({ error: "Champs manquants" });

  const newPost = await Post.create({ userId: req.user.id, content, photoUrl });
  res.status(201).json({
    id: newPost.id,
    content: newPost.content,
    photoUrl: newPost.photoUrl, // Inclure l'URL de la photo
    created_at: newPost.created_at,
    user: {
      username: req.user.username,
    },
  });

  // Envoyer une notification à tous les abonnés
  const subscriptions = await Subscription.findAll();
  const notificationPayload = JSON.stringify({
    title: "Nouveau post",
    body: `${req.user.username} a créé un nouveau post`,
    type: "POST_CREATED",
    url: `/posts/${newPost.id}`
  });

  subscriptions.forEach(subscription => {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    };

    webpush.sendNotification(pushSubscription, notificationPayload).catch(err => {
      console.error("Error sending notification", err);
    });
  });
});

module.exports = router;