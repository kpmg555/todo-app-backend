const router = require("express").Router();
const auth = require("../middleware/auth");
const { firebaseLogin, me } = require("../controllers/auth.controller");

router.post("/firebase-login", firebaseLogin);
router.get("/me", auth, me);

module.exports = router;
