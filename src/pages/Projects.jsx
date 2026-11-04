
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId, getCurrentUsername } from "../utils/user";
import { useProjects } from "../hooks/useProjects";
import { projectSchema } from "../schemas/projectSchema";
import ProjectForm from "../components/ProjectForm";

const emptyForm = {
  title: "",
  members: "",
  completedAt: "",
};

function Projects() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const {
    projectsQuery,
    saveMutation,
    deleteMutation,
  } = useProjects();

  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = projectsQuery;

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
    setFormError("");

    const validation = projectSchema.safeParse(form);

    if (!validation.success) {
      setFormError(validation.error.issues[0].message);
      return;
    }

    const now = new Date().toISOString();

    const project = {
      ...(editingProject || {}),
      title: validation.data.title,
      owner: editingProject?.owner || getCurrentUserId(),
      ownerUsername:
        editingProject?.ownerUsername || getCurrentUsername(),
      members: validation.data.members
        .split(",")
        .map((member) => member.trim())
        .filter(Boolean),
      createdAt: editingProject?.createdAt || now,
      updatedAt: now,
      completedAt: validation.data.completedAt || null,
    };

    saveMutation.mutate(project, {
      onSuccess: closeModal,
    });
  }

  function openProject(project) {
    navigate(`/project/${project.id}`);
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

      {isError && (
        <p role="alert">
          {error?.message || "Failed to load projects."}
        </p>
      )}

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
                <th>Owner</th>
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
                  <td colSpan="7">
                    No projects yet. Create your first project.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => openProject(project)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openProject(project);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                    title={`Open ${project.title}`}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{project.title}</td>

                    <td>
                      {project.ownerUsername || project.owner || "—"}
                    </td>

                    <td>
                      {project.members?.join(", ") || "—"}
                    </td>

                    <td>
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      {project.updatedAt
                        ? new Date(project.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      {project.completedAt
                        ? new Date(project.completedAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditModal(project);
                        }}
                      >
                        Edit
                      </button>{" "}

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          if (
                            window.confirm(
                              `Delete "${project.title}"?`
                            )
                          ) {
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
        <ProjectForm
          form={form}
          setForm={setForm}
          formError={formError}
          isSaving={saveMutation.isPending}
          editingProject={editingProject}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Projects;
