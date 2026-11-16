
import { useEffect, useState } from "react";

function ProjectForm({
  form,
  setForm,
  formError,
  isSaving,
  editingProject,
  onSubmit,
  onClose,
}) {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("http://localhost:3001/users");

        if (!response.ok) {
          throw new Error("Could not load registered users.");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setUsersError(error.message);
      } finally {
        setUsersLoading(false);
      }
    }

    loadUsers();
  }, []);

  const selectedMembers = form.members
    ? String(form.members).split(",").filter(Boolean)
    : [];

  function handleMembersChange(event) {
    const selectedIds = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    setForm({
      ...form,
      members: selectedIds.join(","),
    });
  }

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
            Select project members
            <select
              multiple
              value={selectedMembers}
              onChange={handleMembersChange}
              disabled={usersLoading || usersError !== ""}
              size={Math.min(Math.max(users.length, 3), 6)}
            >
              {users.map((user) => (
                <option key={user.id} value={String(user.id)}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </label>

          <small>
            Hold Ctrl (Windows) while clicking to select multiple members.
          </small>

          {usersLoading && <p>Loading registered users...</p>}

          {usersError && (
            <p role="alert">{usersError}</p>
          )}

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

            <button
              type="submit"
              disabled={isSaving || usersLoading || Boolean(usersError)}
            >
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
