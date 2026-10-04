import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTasks, deleteTask } from "../services/api";

function Home() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username");

  // Fetch tasks from Django
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();

      setTasks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Run when Home page opens
  useEffect(() => {
    loadTasks();
  }, []);

  // Delete task
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(id);

      // Remove deleted task from screen
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    navigate("/login");
  };

  // Loading
  if (loading) {
    return (
      <div className="container">
        <h1>Task Manager</h1>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div>
          <h1>Task Manager</h1>

          <p>
            Welcome, <strong>{username}</strong>
          </p>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Create task */}
      <Link to="/create" className="add-button">
        + Create Task
      </Link>

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* No tasks */}
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h2>{task.title}</h2>

              <p>{task.description}</p>

              <p>
                <strong>Status:</strong> {task.status}
              </p>

              <p>
                <strong>Priority:</strong> {task.priority}
              </p>

              <div className="task-actions">
                <Link to={`/tasks/${task.id}`}>View</Link>

                <Link to={`/edit/${task.id}`}>Edit</Link>

                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
