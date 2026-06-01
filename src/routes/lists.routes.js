const router = require("express").Router();
const auth = require("../middleware/auth");
const { getLists, getList, createList, updateList, deleteList } = require("../controllers/lists.controller");
const tasksRouter = require("./tasks.routes");

router.use(auth);

router.get("/", getLists);
router.post("/", createList);
router.get("/:id", getList);
router.put("/:id", updateList);
router.delete("/:id", deleteList);

// tareas anidadas bajo lista: /api/lists/:listId/tasks
router.use("/:listId/tasks", tasksRouter);

module.exports = router;
