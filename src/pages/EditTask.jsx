
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateTask } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL;

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load existing task
  useEffect(() => {
    const loadTask = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/tasks/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Unable to load task");
        }

        setTitle(data.title);
        setDescription(data.description || "");
        setStatus(data.status);
        setPriority(data.priority);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  // Save updated task
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setSaving(true);

    try {
      await updateTask(id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });

      alert("Task updated successfully!");

      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading task...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>Edit Task</h1>

      <form onSubmit={handleSubmit}>
        <label>Task Title</label>

        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label>Description</label>

        <textarea
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

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <button onClick={() => navigate("/")} style={{ marginTop: "10px" }}>
        Cancel
      </button>
    </div>
  );
}

export default EditTask;
