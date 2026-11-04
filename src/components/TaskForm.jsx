
function TaskForm({
  form,
  setForm,
  formError,
  isSaving,
  editingTask,
  projects,
  projectsLoading,
  onSubmit,
  onClose,
}) {
  return (
    <div
      className="project-modal-backdrop"
      onClick={onClose}
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

        <form onSubmit={onSubmit} noValidate>
          <label>
            Task title
            <input
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
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
            Due Date
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) =>
                setForm({ ...form, dueDate: event.target.value })
              }
            />
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

          <div className="project-modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSaving || projects.length === 0 || projectsLoading
              }
            >
              {isSaving
                ? "Saving..."
                : editingTask
                  ? "Save Changes"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default TaskForm;
