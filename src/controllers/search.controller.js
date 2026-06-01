const prisma = require("../config/database");

// GET /api/search?q=texto
const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) {
      return res.status(400).json({ error: "Parámetro de búsqueda requerido" });
    }

    const query = q.trim();

    const [lists, tasks] = await Promise.all([
      prisma.list.findMany({
        where: {
          userId: req.user.id,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { _count: { select: { tasks: true } } },
        take: 10,
      }),
      prisma.task.findMany({
        where: {
          userId: req.user.id,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { list: { select: { id: true, title: true, color: true } } },
        take: 20,
      }),
    ]);

    res.json({ query, results: { lists, tasks, total: lists.length + tasks.length } });
  } catch (error) {
    next(error);
  }
};

module.exports = { search };
