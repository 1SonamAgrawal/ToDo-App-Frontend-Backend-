
import express from "express";
import cors from "cors";
import db from "./db.js";

const PORT = 5000;
const app = express();

app.use(cors());   
app.use(express.json());  


// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await db("tasks").select("*").orderBy("id", "asc");
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const [newTask] = await db("tasks").insert({ title, completed: false }).returning("*");
    res.json(newTask);
  } catch (err) {
    console.error("Error adding task:", err.message);
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Update task (title or completed status)
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const [updatedTask] = await db("tasks")
      .where({ id })
      .update({ title, completed })
      .returning("*");

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("tasks").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// ---------------------- START SERVER ----------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
