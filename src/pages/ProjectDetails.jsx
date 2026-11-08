
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useTasks } from "../hooks/useTasks";
import { useDebounce } from "../hooks/useDebounce";
import { taskSchema } from "../schemas/taskSchema";
import TaskForm from "../components/TaskForm";

import {
  getCurrentUserId,
  getCurrentUsername,
} from "../utils/user";

const emptyForm = {
  title: "",
  priority: "Medium",
  status: "To Do",
  assignee: "",
  projectId: "",
  parentId: "",
  dueDate: "",
};

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 500);

  // React Query data and mutations
  const {
    tasksQuery,
    projectsQuery,
    saveMutation,
    deleteMutation,
  } = useTasks();

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
  } = tasksQuery;

  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
  } = projectsQuery;

  // Current project
  const project = projects.find(
    (item) => String(item.id) === String(id)
  );

  // All tasks belonging to this project
  const projectTasks = useMemo(
    () =>
      tasks.filter(
        (task) => String(task.projectId) === String(id)
      ),
    [tasks, id]
  );

  // Available assignees for the filter
  const assignees = useMemo(
    () => [
      ...new Set(
        projectTasks.map(
          (task) => task.assignee || "Unassigned"
        )
      ),
    ],
    [projectTasks]
  );

  // Filter tasks using search and selected filters
  const filteredProjectTasks = useMemo(() => {
    const search = debouncedSearch.toLowerCase().trim();

    return projectTasks.filter((task) => {
      const searchableFields = [
        task.id,
        task.title,
        task.priority,
        task.status,
        task.assignee,
        task.projectId,
        task.parentId,
        task.createdBy,
        task.createdByUsername,
        task.dueDate,
        task.createdAt,
        task.updatedAt,
        task.completedAt,
      ];

      const matchesSearch =
        !search ||
        searchableFields
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search)
          );

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesAssignee =
        assigneeFilter === "All" ||
        (task.assignee || "Unassigned") === assigneeFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus &&
        matchesAssignee
      );
    });
  }, [
    projectTasks,
    debouncedSearch,
    priorityFilter,
    statusFilter,
    assigneeFilter,
  ]);

  // Reset filters
  function clearFilters() {
    setSearchTerm("");
    setPriorityFilter("All");
    setStatusFilter("All");
    setAssigneeFilter("All");
  }

  // Open create task modal
  function openCreateModal() {
    setEditingTask(null);

    setForm({
      ...emptyForm,
      projectId: String(id),
    });

    setFormError("");
    saveMutation.reset();
    setIsModalOpen(true);
  }

  // Open edit task modal
  function openEditModal(task) {
    setEditingTask(task);

    setForm({
      title: task.title || "",
      priority: task.priority || "Medium",
      status: task.status || "To Do",
      assignee: task.assignee || "",
      projectId: String(task.projectId),
      parentId: task.parentId
        ? String(task.parentId)
        : "",
      dueDate: task.dueDate || "",
    });

    setFormError("");
    saveMutation.reset();
    setIsModalOpen(true);
  }

  // Close modal
  function closeModal() {
    setIsModalOpen(false);
    setEditingTask(null);
    setForm(emptyForm);
    setFormError("");
  }

  // Create or update task
  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const validation = taskSchema.safeParse(form);

    if (!validation.success) {
      setFormError(validation.error.issues[0].message);
      return;
    }

    if (validation.data.projectId !== String(id)) {
      setFormError(
        "This task must belong to the current project."
      );
      return;
    }

    if (
      validation.data.parentId &&
      !projectTasks.some(
        (task) =>
          String(task.id) === validation.data.parentId &&
          String(task.id) !== String(editingTask?.id)
      )
    ) {
      setFormError(
        "Please select a valid parent task from this project."
      );
      return;
    }

    const now = new Date().toISOString();
    const isCompleted =
      validation.data.status === "Completed";

    const task = {
      ...(editingTask || {}),
      title: validation.data.title,
      priority: validation.data.priority,
      status: validation.data.status,
      assignee: validation.data.assignee.trim(),
      projectId: String(id),
      parentId: validation.data.parentId.trim() || null,
      dueDate: validation.data.dueDate || null,
      createdBy:
        editingTask?.createdBy || getCurrentUserId(),
      createdByUsername:
        editingTask?.createdByUsername ||
        getCurrentUsername(),
      createdAt: editingTask?.createdAt || now,
      updatedAt: now,
      completedAt: isCompleted
        ? editingTask?.completedAt || now
        : null,
    };

    saveMutation.mutate(task, {
      onSuccess: closeModal,
    });
  }

  // Delete task
  function handleDelete(task) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (confirmed) {
      deleteMutation.mutate(task.id);
    }
  }

  // Project statistics
  const completed = projectTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgress = projectTasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const todo = projectTasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const completionRate = projectTasks.length
    ? Math.round(
        (completed / projectTasks.length) * 100
      )
    : 0;

  const members = Array.isArray(project?.members)
    ? project.members.join(", ")
    : project?.members || "No members added";

  // Loading state
  if (tasksLoading || projectsLoading) {
    return (
      <div className="page-container">
        Loading project details...
      </div>
    );
  }

  // Error state
  if (tasksError || projectsError) {
    return (
      <div className="page-container">
        <p role="alert">
          Failed to load project details.
        </p>
      </div>
    );
  }

  // Project not found
  if (!project) {
    return (
      <div className="page-container">
        <h2>Project not found</h2>
        <button
          onClick={() =>
            navigate("/dashboard/projects")
          }
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="page-container project-details-page">
      <button
        className="project-details-back"
        onClick={() =>
          navigate("/dashboard/projects")
        }
      >
        ← Back to Projects
      </button>

      {/* Project overview */}
      <section className="project-details-hero">
        <div>
          <span className="project-details-label">
            PROJECT OVERVIEW
          </span>

          <h1>{project.title}</h1>

          <p>
            Manage and track all tasks associated with
            this project.
          </p>
        </div>

        <button
          className="project-details-manage"
          onClick={openCreateModal}
        >
          + Add Task
        </button>
      </section>

      {/* Project statistics */}
      <section className="project-details-stats">
        <div className="project-details-stat">
          <span>Total Tasks</span>
          <strong>{projectTasks.length}</strong>
        </div>

        <div className="project-details-stat">
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>

        <div className="project-details-stat">
          <span>In Progress</span>
          <strong>{inProgress}</strong>
        </div>

        <div className="project-details-stat">
          <span>To Do</span>
          <strong>{todo}</strong>
        </div>
      </section>

      {/* Project information */}
      <section className="project-details-card">
        <div className="project-details-card-heading">
          <h2>Project Information</h2>
          <span>{completionRate}% Complete</span>
        </div>

        <div className="project-progress-track">
          <div
            className="project-progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <div className="project-details-info">
          <div>
            <span>Project Owner</span>
            <strong>
              {project.ownerUsername ||
                project.owner ||
                "Not assigned"}
            </strong>
          </div>

          <div>
            <span>Team Members</span>
            <strong>{members}</strong>
          </div>

          <div>
            <span>Created</span>
            <strong>
              {project.createdAt
                ? new Date(
                    project.createdAt
                  ).toLocaleDateString()
                : "Not available"}
            </strong>
          </div>

          <div>
            <span>Last Updated</span>
            <strong>
              {project.updatedAt
                ? new Date(
                    project.updatedAt
                  ).toLocaleDateString()
                : "Not available"}
            </strong>
          </div>
        </div>
      </section>

      {/* Project tasks */}
      <section className="project-details-card">
        <div className="project-details-card-heading">
          <h2>Project Tasks</h2>

          <span>
            {filteredProjectTasks.length} of{" "}
            {projectTasks.length} tasks
          </span>
        </div>

        {/* Search and filters */}
        <div className="project-task-filters">
          <input
            type="search"
            placeholder="Search tasks, dates, assignees..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            aria-label="Search project tasks"
          />

          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value)
            }
            aria-label="Filter by priority"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            aria-label="Filter by status"
          >
            <option value="All">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(event) =>
              setAssigneeFilter(event.target.value)
            }
            aria-label="Filter by assignee"
          >
            <option value="All">All Assignees</option>

            {assignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        {/* Mutation errors */}
        {saveMutation.isError && (
          <p role="alert">
            {saveMutation.error.message}
          </p>
        )}

        {deleteMutation.isError && (
          <p role="alert">
            {deleteMutation.error.message}
          </p>
        )}

        {/* Tasks table */}
        {filteredProjectTasks.length === 0 ? (
          <div className="project-details-empty">
            <p>
              {projectTasks.length === 0
                ? "No tasks have been created for this project yet."
                : "No matching tasks found. Try changing your search or filters."}
            </p>

            {projectTasks.length === 0 && (
              <button onClick={openCreateModal}>
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="project-task-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjectTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.priority}</td>
                    <td>{task.status}</td>
                    <td>
                      {task.assignee || "Unassigned"}
                    </td>
                    <td>
                      {task.dueDate
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        : "Not set"}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(task)
                        }
                      >
                        Edit
                      </button>{" "}

                      <button
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={() =>
                          handleDelete(task)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create/Edit Task Modal */}
      {isModalOpen && (
        <TaskForm
          form={form}
          setForm={setForm}
          formError={formError}
          isSaving={saveMutation.isPending}
          editingTask={editingTask}
          projects={projects}
          projectsLoading={projectsLoading}
          tasks={projectTasks}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default ProjectDetails;
