
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

// Fetch all registered users
export async function fetchUsers() {
  const response = await fetch("http://localhost:3001/users");

  if (!response.ok) {
    throw new Error("Failed to load users");
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

// Delete a task and all its children and descendants
export async function deleteTask(id) {
  const tasks = await fetchTasks();

  // Store the selected task and all descendants
  const idsToDelete = new Set([String(id)]);

  let foundNewChild = true;

  while (foundNewChild) {
    foundNewChild = false;

    tasks.forEach((task) => {
      const parentId = task.parentId;

      if (
        parentId !== null &&
        parentId !== undefined &&
        idsToDelete.has(String(parentId)) &&
        !idsToDelete.has(String(task.id))
      ) {
        idsToDelete.add(String(task.id));
        foundNewChild = true;
      }
    });
  }

  // Delete descendants before their parent
  const deleteOrder = [...idsToDelete].reverse();

  for (const taskId of deleteOrder) {
    const response = await fetch(`${TASKS_URL}/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete task ${taskId}`);
    }
  }

  return true;
}
