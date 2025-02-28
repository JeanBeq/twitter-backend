const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = function requireAuthentication(req, res, next) {
  // Récupérer l'en-tête d'autorisation
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Si aucun en-tête d'autorisation, renvoyer une réponse 401
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }

  // Extraire le token de l'en-tête
  const token = authHeader.split(" ")[1];
  if (!token) {
    // Si le token est mal formé, renvoyer une réponse 401
    return res.status(401).send({ message: "Unauthorized: Malformed token" });
  }

  // Vérifier le token JWT
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err instanceof jwt.TokenExpiredError) {
      // Si le token a expiré, renvoyer une réponse 401
      return res.status(401).send({ type: "TOKEN_EXPIRED" });
    } else if (err) {
      // Si une autre erreur JWT se produit, renvoyer une réponse 401
      console.log("JWT Error:", err);
      return res.status(401).send({ message: "Unauthorized: Invalid token" });
    }

    // Si le token est valide, rechercher l'utilisateur par ID
    if (data?.id) {
      req.user = await User.findOne({
        where: {
          id: data.id,
        },
      });
    }

    // Si l'utilisateur n'est pas trouvé, renvoyer une réponse 401
    if (!req.user) {
      return res.status(401).send({ message: "Unauthorized: User not found" });
    }
    // Passer au middleware suivant
    next();
  });
};