
import { useMemo, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUserId,
  getCurrentUsername,
} from "../utils/user";
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

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [memberFilter, setMemberFilter] = useState("All");
  const [completionFilter, setCompletionFilter] = useState("All");

  const debouncedSearch = useDebounce(searchTerm, 500);

  // React Query
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

  // Get all unique owners
  const owners = useMemo(
    () => [
      ...new Set(
        projects.map(
          (project) =>
            project.ownerUsername || project.owner || "Unassigned"
        )
      ),
    ],
    [projects]
  );

  // Get all unique team members
  const membersList = useMemo(
    () => [
      ...new Set(
        projects.flatMap((project) =>
          Array.isArray(project.members)
            ? project.members
            : project.members
              ? [project.members]
              : []
        )
      ),
    ],
    [projects]
  );

  // Search and filter projects
  const filteredProjects = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase();

    return projects.filter((project) => {
      const projectMembers = Array.isArray(project.members)
        ? project.members
        : project.members
          ? [project.members]
          : [];

      const searchableFields = [
        project.id,
        project.title,
        project.owner,
        project.ownerUsername,
        ...projectMembers,
        project.createdAt,
        project.updatedAt,
        project.completedAt,
      ];

      const matchesSearch =
        !search ||
        searchableFields.some((field) =>
          String(field ?? "").toLowerCase().includes(search)
        );

      const owner =
        project.ownerUsername || project.owner || "Unassigned";

      const matchesOwner =
        ownerFilter === "All" || owner === ownerFilter;

      const matchesMember =
        memberFilter === "All" ||
        projectMembers.includes(memberFilter);

      const isCompleted = Boolean(project.completedAt);

      const matchesCompletion =
        completionFilter === "All" ||
        (completionFilter === "Completed" && isCompleted) ||
        (completionFilter === "Active" && !isCompleted);

      return (
        matchesSearch &&
        matchesOwner &&
        matchesMember &&
        matchesCompletion
      );
    });
  }, [
    projects,
    debouncedSearch,
    ownerFilter,
    memberFilter,
    completionFilter,
  ]);

  // Clear all filters
  function clearFilters() {
    setSearchTerm("");
    setOwnerFilter("All");
    setMemberFilter("All");
    setCompletionFilter("All");
  }

  // Open create modal
  function openCreateModal() {
    setEditingProject(null);
    setForm(emptyForm);
    setFormError("");
    saveMutation.reset();
    setIsModalOpen(true);
  }

  // Open edit modal
  function openEditModal(project) {
    setEditingProject(project);

    setForm({
      title: project.title || "",
      members: Array.isArray(project.members)
        ? project.members.join(", ")
        : project.members || "",
      completedAt: project.completedAt || "",
    });

    setFormError("");
    saveMutation.reset();
    setIsModalOpen(true);
  }

  // Close modal
  function closeModal() {
    setIsModalOpen(false);
    setEditingProject(null);
    setForm(emptyForm);
    setFormError("");
  }

  // Create or update project
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

  // Open project details
  function openProject(project) {
    navigate(`/dashboard/project/${project.id}`);
  }

  return (
    <div className="page-container projects-page">
      {/* Page heading */}
      <div className="projects-heading">
        <div>
          <h1>Projects</h1>
          <p>Create and manage your workspace projects.</p>
        </div>

        <button type="button" onClick={openCreateModal}>
          + New Project
        </button>
      </div>

      {/* Search and filters */}
      <div className="search-filter-container projects-filters">
        <input
          type="search"
          placeholder="Search title, owner, members, dates..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Search projects"
        />

        <select
          value={ownerFilter}
          onChange={(event) => setOwnerFilter(event.target.value)}
          aria-label="Filter by owner"
        >
          <option value="All">All Owners</option>

          {owners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </select>

        <select
          value={memberFilter}
          onChange={(event) => setMemberFilter(event.target.value)}
          aria-label="Filter by team member"
        >
          <option value="All">All Members</option>

          {membersList.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>

        <select
          value={completionFilter}
          onChange={(event) =>
            setCompletionFilter(event.target.value)
          }
          aria-label="Filter by completion status"
        >
          <option value="All">All Projects</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="button" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Loading and errors */}
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

      {/* Projects table */}
      {!isLoading && !isError && (
        <div className="panel projects-table-wrapper">
          <div className="projects-results-count">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>

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
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    {projects.length === 0
                      ? "No projects yet. Create your first project."
                      : "No projects match your search or filters."}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => openProject(project)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
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
                      {project.ownerUsername ||
                        project.owner ||
                        "—"}
                    </td>

                    <td>
                      {Array.isArray(project.members)
                        ? project.members.join(", ") || "—"
                        : project.members || "—"}
                    </td>

                    <td>
                      {project.createdAt
                        ? new Date(
                            project.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      {project.updatedAt
                        ? new Date(
                            project.updatedAt
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      {project.completedAt
                        ? new Date(
                            project.completedAt
                          ).toLocaleDateString()
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
                        disabled={deleteMutation.isPending}
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

      {/* Create/Edit Project Modal */}
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
