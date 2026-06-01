require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const listsRoutes = require("./routes/lists.routes");
const tasksRoutes = require("./routes/tasks.routes");
const searchRoutes = require("./routes/search.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Todo List API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      lists: "/api/lists",
      tasks: "/api/tasks",
      search: "/api/search",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/lists", listsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/search", searchRoutes);

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT} [${process.env.NODE_ENV || "development"}]`);
});

module.exports = app;
