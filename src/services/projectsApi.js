
const API_URL = "http://localhost:3001/projects";

// Get all projects
export async function fetchProjects() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load projects");
  }

  return response.json();
}

// Create or update a project
export async function saveProject(project) {
  const isEditing = Boolean(project.id);

  const url = isEditing
    ? `${API_URL}/${project.id}`
    : API_URL;

  const response = await fetch(url, {
    method: isEditing ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error("Failed to save project");
  }

  return response.json();
}

// Delete a project
export async function deleteProject(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
}
