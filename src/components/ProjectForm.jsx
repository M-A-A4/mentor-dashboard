
function ProjectForm({
  form,
  setForm,
  formError,
  isSaving,
  editingProject,
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
        aria-labelledby="project-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="project-modal-title">
          {editingProject ? "Edit Project" : "Create Project"}
        </h2>

        <form onSubmit={onSubmit} noValidate>
          <label>
            Project title
            <input
              value={form.title}
              onChange={(event) =>
                setForm({
                  ...form,
                  title: event.target.value,
                })
              }
              autoFocus
            />
          </label>

          <label>
            Members (comma-separated user IDs or names)
            <input
              value={form.members}
              onChange={(event) =>
                setForm({
                  ...form,
                  members: event.target.value,
                })
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
                setForm({
                  ...form,
                  completedAt: event.target.value,
                })
              }
            />
          </label>

          {formError && (
            <p role="alert">{formError}</p>
          )}

          <div className="project-modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : editingProject
                  ? "Save Changes"
                  : "Create Project"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProjectForm;
