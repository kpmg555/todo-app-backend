const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");
const prisma = require("../config/database");

const generateJWT = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/firebase-login
const firebaseLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "idToken requerido" });

    const decoded = await admin.auth().verifyIdToken(idToken);

    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email: decoded.email,
        name: decoded.name || decoded.displayName || null,
        photoURL: decoded.picture || null,
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.displayName || null,
        photoURL: decoded.picture || null,
      },
    });

    const token = generateJWT({ id: user.id, email: user.email, firebaseUid: user.firebaseUid });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, photoURL: user.photoURL },
    });
  } catch (error) {
    if (error.code?.startsWith("auth/")) {
      return res.status(401).json({ error: "Token de Firebase inválido o expirado" });
    }
    next(error);
  }
};

// GET /api/auth/me
const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ id: user.id, email: user.email, name: user.name, photoURL: user.photoURL, createdAt: user.createdAt });
  } catch (error) {
    next(error);
  }
};

module.exports = { firebaseLogin, me };
