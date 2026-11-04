
const TASKS_URL = "http://localhost:3001/tasks";
const PROJECTS_URL = "http://localhost:3001/projects";

// Fetch all tasks
export async function fetchTasks() {
  const response = await fetch(TASKS_URL);

  if (!response.ok) {
    throw new Error("Failed to load tasks");
  }

  return response.json();
}

// Fetch all projects
export async function fetchProjects() {
  const response = await fetch(PROJECTS_URL);

  if (!response.ok) {
    throw new Error("Failed to load projects");
  }

  return response.json();
}

// Create or update a task
export async function saveTask(task) {
  const isEditing = Boolean(task.id);

  const response = await fetch(
    isEditing ? `${TASKS_URL}/${task.id}` : TASKS_URL,
    {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save task");
  }

  return response.json();
}

// Delete a task
export async function deleteTask(id) {
  const response = await fetch(`${TASKS_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}
