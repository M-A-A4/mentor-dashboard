
import { useState } from "react";
import {
  getCurrentUserId,
  getCurrentUsername,
} from "../utils/user";
import { useTasks } from "../hooks/useTasks";
import { taskSchema } from "../schemas/taskSchema";
import TaskForm from "../components/TaskForm";

const emptyForm = {
  title: "",
  priority: "Medium",
  status: "To Do",
  assignee: "",
  projectId: "",
  parentId: "",
  dueDate: "",
};

function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const {
    tasksQuery,
    projectsQuery,
    saveMutation,
    deleteMutation,
  } = useTasks();

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = tasksQuery;

  const {
    data: projects = [],
    isLoading: projectsLoading,
  } = projectsQuery;

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
      dueDate: task.dueDate || "",
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
    setFormError("");

    const validation = taskSchema.safeParse(form);

    if (!validation.success) {
      setFormError(validation.error.issues[0].message);
      return;
    }

    const selectedProject = projects.find(
      (project) => String(project.id) === validation.data.projectId
    );

    if (!selectedProject) {
      setFormError("Please select a valid project.");
      return;
    }

    const now = new Date().toISOString();
    const isCompleted = validation.data.status === "Completed";

    const task = {
      ...(editingTask || {}),
      title: validation.data.title,
      priority: validation.data.priority,
      status: validation.data.status,
      assignee: validation.data.assignee.trim(),
      projectId: validation.data.projectId,
      parentId: validation.data.parentId.trim() || null,
      dueDate: validation.data.dueDate || null,

      createdBy: editingTask?.createdBy || getCurrentUserId(),
      createdByUsername:
        editingTask?.createdByUsername || getCurrentUsername(),

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

      {isError && (
        <p role="alert">{error?.message}</p>
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
                <th>Priority</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Project</th>
                <th>Parent ID</th>
                <th>Created By</th>
                <th>Due Date</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="12">
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
                    <td>
                      {task.createdByUsername || task.createdBy || "—"}
                    </td>
                    <td>{formatDate(task.dueDate)}</td>
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
                          if (window.confirm(`Delete "${task.title}"?`)) {
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
        <TaskForm
          form={form}
          setForm={setForm}
          formError={formError}
          isSaving={saveMutation.isPending}
          editingTask={editingTask}
          projects={projects}
          projectsLoading={projectsLoading}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
     
    </div>
  );
}

export default Tasks;
