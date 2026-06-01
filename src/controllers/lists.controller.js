const prisma = require("../config/database");

// GET /api/lists
const getLists = async (req, res, next) => {
  try {
    const lists = await prisma.list.findMany({
      where: { userId: req.user.id },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(lists);
  } catch (error) {
    next(error);
  }
};

// GET /api/lists/:id
const getList = async (req, res, next) => {
  try {
    const list = await prisma.list.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { tasks: { orderBy: { createdAt: "desc" } }, _count: { select: { tasks: true } } },
    });
    if (!list) return res.status(404).json({ error: "Lista no encontrada" });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

// POST /api/lists
const createList = async (req, res, next) => {
  try {
    const { title, description, color } = req.body;
    if (!title) return res.status(400).json({ error: "El título es requerido" });
    const list = await prisma.list.create({
      data: { title, description, color, userId: req.user.id },
    });
    res.status(201).json(list);
  } catch (error) {
    next(error);
  }
};

// PUT /api/lists/:id
const updateList = async (req, res, next) => {
  try {
    const existing = await prisma.list.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: "Lista no encontrada" });

    const { title, description, color } = req.body;
    const list = await prisma.list.update({
      where: { id: req.params.id },
      data: { title, description, color },
    });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/lists/:id
const deleteList = async (req, res, next) => {
  try {
    const existing = await prisma.list.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: "Lista no encontrada" });

    await prisma.list.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getLists, getList, createList, updateList, deleteList };
