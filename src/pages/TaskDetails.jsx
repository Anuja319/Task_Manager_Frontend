
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          throw new Error(data.detail || "Unable to fetch task");
        }

        setTask(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <p>Loading task...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>

        <button onClick={() => navigate("/")}>Back to Tasks</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Task Details</h1>

      <div className="task-card">
        <h2>{task.title}</h2>

        <p>
          <strong>Description:</strong>
        </p>

        <p>{task.description || "No description"}</p>

        <p>
          <strong>Status:</strong> {task.status}
        </p>

        <p>
          <strong>Priority:</strong> {task.priority}
        </p>

        <p>
          <strong>Created:</strong>{" "}
          {new Date(task.created_at).toLocaleString()}
        </p>

        <div className="task-actions">
          <Link to="/">← Back to Tasks</Link>

          <Link to={`/edit/${task.id}`}>Edit Task</Link>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;

