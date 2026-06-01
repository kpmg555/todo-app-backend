const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);

  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") return res.status(409).json({ error: "Recurso ya existe" });
    if (err.code === "P2025") return res.status(404).json({ error: "Recurso no encontrado" });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Error interno del servidor" });
};

module.exports = errorHandler;
