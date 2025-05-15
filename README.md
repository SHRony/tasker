# 🧠 Tasker

**Tasker** is a platform for running structured, interactive, AI-powered tasks.

Each task is defined using a simple JSON format that describes a series of steps. Users go through these steps one by one, interacting with AI, uploading files, providing input, and receiving results — all within a guided experience.

---

## ✨ What Tasker Does

- Takes a **JSON-defined task** as input
- Allows users to run the task step by step
- Each step contains interactive components
- Users provide input, view outputs, and continue through the task
- AI, API, and file-based processing can be built into the flow

---

## 🔧 How It Works (At a High Level)

1. A task is created using a predefined JSON format
2. The user runs the task inside Tasker
3. The task guides them through multiple steps
4. Each step may include:
   - Showing text or output
   - Asking for input
   - Making AI or API calls
5. The task completes when all steps are finished

---

## 🛠 Task Structure

- Tasks are made of **steps**
- Steps are made of **components**
- Components handle display, input, or actions
- Each task is interactive — the user drives it by engaging with each step

---

## 📁 For Developers

If you're looking for implementation details or want to understand how Tasker is built under the hood, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

*This README will grow as the project evolves.*
