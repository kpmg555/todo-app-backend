const router = require("express").Router();
const auth = require("../middleware/auth");
const { search } = require("../controllers/search.controller");

router.get("/", auth, search);

module.exports = router;
