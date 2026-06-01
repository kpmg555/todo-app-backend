const router = require("express").Router({ mergeParams: true });
const auth = require("../middleware/auth");
const { getTasks, getTask, createTask, updateTask, toggleTask, deleteTask } = require("../controllers/tasks.controller");

router.use(auth);

// rutas bajo /api/lists/:listId/tasks
router.get("/", getTasks);
router.post("/", createTask);

// rutas directas /api/tasks/:id
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.patch("/:id/toggle", toggleTask);
router.delete("/:id", deleteTask);

module.exports = router;
