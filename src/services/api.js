const API_URL = import.meta.env.VITE_API_URL;
// Register new user
export async function registerUser(username, password) {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const text = await response.text();

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server returned an invalid response.");
    }
  }

  if (!response.ok) {
    throw new Error(data.username?.[0] || data.detail || "Registration failed");
  }

  return data;
}

// Login user
export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const text = await response.text();

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server returned an invalid response.");
    }
  }

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

// Get all tasks
export async function getTasks() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/tasks/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unable to fetch tasks");
  }

  return data;
}

// Create task
export async function createTask(task) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unable to create task");
  }

  return data;
}

// Update task
export async function updateTask(id, task) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/tasks/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unable to update task");
  }

  return data;
}

// Delete task
export async function deleteTask(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/tasks/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.detail || "Unable to delete task");
  }
}
