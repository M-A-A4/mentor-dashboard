
import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getCurrentUserId } from "../utils/user";

const TASKS_URL = "http://localhost:3001/tasks";
const PROJECTS_URL = "http://localhost:3001/projects";

const emptyForm = {
  title: "",
  priority: "Medium",
  status: "To Do",
  assignee: "",
  projectId: "",
  parentId: "",
};

async function fetchTasks() {
  const response = await fetch(TASKS_URL);
  if (!response.ok) throw new Error("Failed to load tasks");
  return response.json();
}

async function fetchProjects() {
  const response = await fetch(PROJECTS_URL);
  if (!response.ok) throw new Error("Failed to load projects");
  return response.json();
}

async function saveTask(task) {
  const isEditing = Boolean(task.id);

  const response = await fetch(
    isEditing ? `${TASKS_URL}/${task.id}` : TASKS_URL,
    {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    }
  );

  if (!response.ok) throw new Error("Failed to save task");
  return response.json();
}

async function deleteTask(id) {
  const response = await fetch(`${TASKS_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete task");
}

function Tasks() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const {
    data: projects = [],
    isLoading: projectsLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const saveMutation = useMutation({
    mutationFn: saveTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  function openCreateModal() {
    setEditingTask(null);
    setForm(emptyForm);
    setFormError("");
    saveMutation.reset();
    setIsModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setForm({
      title: task.title || "",
      priority: task.priority || "Medium",
      status: task.status || "To Do",
      assignee: task.assignee || "",
      projectId: task.projectId == null ? "" : String(task.projectId),
      parentId: task.parentId == null ? "" : String(task.parentId),
    });
    setFormError("");
    saveMutation.reset();
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTask(null);
    setForm(emptyForm);
    setFormError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setFormError("Task title is required.");
      return;
    }

    if (!form.projectId) {
      setFormError("Please select a project.");
      return;
    }

    const now = new Date().toISOString();
    const isCompleted = form.status === "Completed";

    const task = {
      ...(editingTask || {}),
      title,
      priority: form.priority,
      status: form.status,
      assignee: form.assignee.trim(),
      projectId: form.projectId,
      parentId: form.parentId.trim() || null,
      createdBy: editingTask?.createdBy || getCurrentUserId(),
      createdAt: editingTask?.createdAt || now,
      updatedAt: now,
      completedAt: isCompleted
        ? editingTask?.completedAt || now
        : null,
    };

    saveMutation.mutate(task);
  }

  function getProjectTitle(projectId) {
    const project = projects.find(
      (item) => String(item.id) === String(projectId)
    );

    return project?.title || `Project ${projectId}`;
  }

  function formatDate(value) {
    return value ? new Date(value).toLocaleDateString() : "—";
  }

  return (
    <div className="page-container">
      <div className="projects-heading">
        <div>
          <h1>Tasks</h1>
          <p>Create and manage tasks for your projects.</p>
        </div>

        <button type="button" onClick={openCreateModal}>
          + New Task
        </button>
      </div>

      {isLoading && <p>Loading tasks...</p>}

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
                <th>Priority</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Project</th>
                <th>Parent ID</th>
                <th>Created By</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="11">
                    No tasks yet. Create your first task.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.priority}</td>
                    <td>{task.status}</td>
                    <td>{task.assignee || "—"}</td>
                    <td>{getProjectTitle(task.projectId)}</td>
                    <td>{task.parentId ?? "—"}</td>
                    <td>{task.createdBy}</td>
                    <td>{formatDate(task.createdAt)}</td>
                    <td>{formatDate(task.updatedAt)}</td>
                    <td>{formatDate(task.completedAt)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => openEditModal(task)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete "${task.title}"?`
                            )
                          ) {
                            deleteMutation.mutate(task.id);
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

      {isModalOpen && (
        <div
          className="project-modal-backdrop"
          onClick={closeModal}
        >
          <section
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="task-modal-title">
              {editingTask ? "Edit Task" : "Create Task"}
            </h2>

            <form onSubmit={handleSubmit}>
              <label>
                Task title
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
                Priority
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm({ ...form, priority: event.target.value })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>

              <label>
                Assignee
                <input
                  value={form.assignee}
                  onChange={(event) =>
                    setForm({ ...form, assignee: event.target.value })
                  }
                  placeholder="Name or user ID"
                />
              </label>

              <label>
                Project
                <select
                  value={form.projectId}
                  onChange={(event) =>
                    setForm({ ...form, projectId: event.target.value })
                  }
                  required
                  disabled={projectsLoading || projects.length === 0}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Parent task ID (optional)
                <input
                  value={form.parentId}
                  onChange={(event) =>
                    setForm({ ...form, parentId: event.target.value })
                  }
                  placeholder="For example, 1"
                />
              </label>

              {projects.length === 0 && !projectsLoading && (
                <p role="alert">
                  Create a project first before adding a task.
                </p>
              )}

              {formError && <p role="alert">{formError}</p>}

              {saveMutation.isError && (
                <p role="alert">{saveMutation.error.message}</p>
              )}

              <div className="project-modal-actions">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saveMutation.isPending ||
                    projects.length === 0 ||
                    projectsLoading
                  }
                >
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingTask
                      ? "Save Changes"
                      : "Create Task"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Tasks;
