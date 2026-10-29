
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserId } from "../utils/user";

const API_URL = "http://localhost:3001/projects";

async function fetchProjects() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to load projects");
  return response.json();
}

async function saveProject(project) {
  const isEditing = Boolean(project.id);
  const url = isEditing ? `${API_URL}/${project.id}` : API_URL;

  const response = await fetch(url, {
    method: isEditing ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });

  if (!response.ok) throw new Error("Failed to save project");
  return response.json();
}

async function deleteProject(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete project");
}

const emptyForm = {
  title: "",
  members: "",
  completedAt: "",
};

function Projects() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const saveMutation = useMutation({
    mutationFn: saveProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  function openCreateModal() {
    setEditingProject(null);
    setForm(emptyForm);
    setFormError("");
    saveMutation.reset();
    setIsModalOpen(true);
  }

  function openEditModal(project) {
    setEditingProject(project);
    setForm({
      title: project.title || "",
      members: Array.isArray(project.members)
        ? project.members.join(", ")
        : "",
      completedAt: project.completedAt || "",
    });
    setFormError("");
    saveMutation.reset();
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingProject(null);
    setForm(emptyForm);
    setFormError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    if (!title) {
      setFormError("Project title is required.");
      return;
    }

    const now = new Date().toISOString();
    const project = {
      ...(editingProject || {}),
      title,
      owner: editingProject?.owner || getCurrentUserId(),
      members: form.members
        .split(",")
        .map((member) => member.trim())
        .filter(Boolean),
      createdAt: editingProject?.createdAt || now,
      updatedAt: now,
      completedAt: form.completedAt || null,
    };

    saveMutation.mutate(project);
  }

  return (
    <div className="page-container">
      <div className="projects-heading">
        <div>
          <h1>Projects</h1>
          <p>Create and manage your workspace projects.</p>
        </div>
        <button type="button" onClick={openCreateModal}>
          + New Project
        </button>
      </div>

      {isLoading && <p>Loading projects...</p>}
      {isError && <p role="alert">{error.message}</p>}
      {saveMutation.isError && (
        <p role="alert">{saveMutation.error.message}</p>
      )}
      {deleteMutation.isError && (
        <p role="alert">{deleteMutation.error.message}</p>
      )}

      {!isLoading && !isError && (
        <div className="panel projects-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner ID</th>
                <th>Members</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Completed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="7">No projects yet. Create your first project.</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{project.owner}</td>
                    <td>{project.members?.join(", ") || "—"}</td>
                    <td>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "—"}</td>
                    <td>{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "—"}</td>
                    <td>{project.completedAt ? new Date(project.completedAt).toLocaleDateString() : "—"}</td>
                    <td>
                      <button type="button" onClick={() => openEditModal(project)}>
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${project.title}"?`)) {
                            deleteMutation.mutate(project.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="project-modal-backdrop" onClick={closeModal}>
          <section
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="project-modal-title">
              {editingProject ? "Edit Project" : "Create Project"}
            </h2>

            <form onSubmit={handleSubmit}>
              <label>
                Project title
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  required
                  autoFocus
                />
              </label>

              <label>
                Members (comma-separated user IDs or names)
                <input
                  value={form.members}
                  onChange={(event) =>
                    setForm({ ...form, members: event.target.value })
                  }
                  placeholder="user-123, user-456"
                />
              </label>

              <label>
                Completed date (optional)
                <input
                  type="date"
                  value={form.completedAt}
                  onChange={(event) =>
                    setForm({ ...form, completedAt: event.target.value })
                  }
                />
              </label>

              {formError && <p role="alert">{formError}</p>}

              {saveMutation.isError && (
                <p role="alert">{saveMutation.error.message}</p>
              )}

              <div className="project-modal-actions">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingProject
                      ? "Save Changes"
                      : "Create Project"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Projects;
