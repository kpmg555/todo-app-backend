const prisma = require("../config/database");

const ownsList = async (listId, userId) => {
  const list = await prisma.list.findFirst({ where: { id: listId, userId } });
  return !!list;
};

// GET /api/lists/:listId/tasks
const getTasks = async (req, res, next) => {
  try {
    if (!(await ownsList(req.params.listId, req.user.id))) {
      return res.status(404).json({ error: "Lista no encontrada" });
    }
    const { completed, priority } = req.query;
    const tasks = await prisma.task.findMany({
      where: {
        listId: req.params.listId,
        userId: req.user.id,
        ...(completed !== undefined && { completed: completed === "true" }),
        ...(priority && { priority }),
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// POST /api/lists/:listId/tasks
const createTask = async (req, res, next) => {
  try {
    if (!(await ownsList(req.params.listId, req.user.id))) {
      return res.status(404).json({ error: "Lista no encontrada" });
    }
    const { title, description, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ error: "El título es requerido" });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        listId: req.params.listId,
        userId: req.user.id,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const existing = await prisma.task.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: "Tarea no encontrada" });

    const { title, description, completed, priority, dueDate } = req.body;
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/toggle
const toggleTask = async (req, res, next) => {
  try {
    const existing = await prisma.task.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: "Tarea no encontrada" });

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { completed: !existing.completed },
    });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const existing = await prisma.task.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: "Tarea no encontrada" });

    await prisma.task.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, toggleTask, deleteTask };
