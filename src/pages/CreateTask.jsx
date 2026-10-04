import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTask } from "../services/api";

function CreateTask() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Client-side validation
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (title.length > 200) {
      setError("Task title cannot exceed 200 characters.");
      return;
    }

    setLoading(true);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });

      alert("Task created successfully!");

      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Create Task</h1>

      <form onSubmit={handleSubmit}>
        <label>Task Title</label>

        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label>Description</label>

        <textarea
          placeholder="Enter task description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label>Status</label>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="Pending">Pending</option>

          <option value="In Progress">In Progress</option>

          <option value="Completed">Completed</option>
        </select>

        <label>Priority</label>

        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="Low">Low</option>

          <option value="Medium">Medium</option>

          <option value="High">High</option>
        </select>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>

      <p>
        <Link to="/">← Back to Tasks</Link>
      </p>
    </div>
  );
}

export default CreateTask;
