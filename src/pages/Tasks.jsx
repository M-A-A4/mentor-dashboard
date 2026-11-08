
import { useMemo, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
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

  const [searchTerm, setSearchTerm] = useState("");
const [projectFilter, setProjectFilter] = useState("all");
const [priorityFilter, setPriorityFilter] = useState("all");
const [statusFilter, setStatusFilter] = useState("all");
const [assigneeFilter, setAssigneeFilter] = useState("all");
const [createdByFilter, setCreatedByFilter] = useState("all");

const debouncedSearch = useDebounce(searchTerm, 500);

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

  // Validate the selected parent task
  if (validation.data.parentId) {
    const selectedParent = tasks.find(
      (task) => String(task.id) === validation.data.parentId
    );

    if (
      !selectedParent ||
      String(selectedParent.projectId) !== validation.data.projectId ||
      String(selectedParent.id) === String(editingTask?.id)
    ) {
      setFormError(
        "Please select a valid parent task from the same project."
      );
      return;
    }
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

  function formatDate(value) {
    return value ? new Date(value).toLocaleDateString() : "—";
  }


const filteredTasks = useMemo(() => {
  const search = debouncedSearch.trim().toLowerCase();

  return tasks.filter((task) => {
    const project = projects.find(
      (item) => String(item.id) === String(task.projectId)
    );

    const searchableFields = [
      task.id,
      task.title,
      task.priority,
      task.status,
      task.assignee,
      task.projectId,
      project?.title,
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
      searchableFields.some((field) =>
        String(field ?? "").toLowerCase().includes(search)
      );

    const matchesProject =
      projectFilter === "all" ||
      String(task.projectId) === projectFilter;

    const matchesPriority =
      priorityFilter === "all" ||
      task.priority === priorityFilter;

    const matchesStatus =
      statusFilter === "all" ||
      task.status === statusFilter;

    const matchesAssignee =
      assigneeFilter === "all" ||
      (task.assignee || "") === assigneeFilter;

    const matchesCreatedBy =
      createdByFilter === "all" ||
      (task.createdByUsername || task.createdBy || "") === createdByFilter;

    return (
      matchesSearch &&
      matchesProject &&
      matchesPriority &&
      matchesStatus &&
      matchesAssignee &&
      matchesCreatedBy
    );
  });
}, [
  tasks,
  projects,
  debouncedSearch,
  projectFilter,
  priorityFilter,
  statusFilter,
  assigneeFilter,
  createdByFilter,
]);

const assignees = [
  ...new Set(tasks.map((task) => task.assignee).filter(Boolean)),
];

const creators = [
  ...new Set(
    tasks
      .map((task) => task.createdByUsername || task.createdBy)
      .filter(Boolean)
  ),
];

const tasksByProject = projects.map((project) => ({
  ...project,
  tasks: filteredTasks.filter(
    (task) => String(task.projectId) === String(project.id)
  ),
}));

const unassignedTasks = filteredTasks.filter(
  (task) =>
    !projects.some(
      (project) => String(project.id) === String(task.projectId)
    )
);

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

      
<div className="task-filters">
  <input
    type="search"
    placeholder="Search all task fields..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
    aria-label="Search tasks"
  />

  <select
    value={projectFilter}
    onChange={(event) => setProjectFilter(event.target.value)}
  >
    <option value="all">All Projects</option>
    {projects.map((project) => (
      <option key={project.id} value={String(project.id)}>
        {project.title}
      </option>
    ))}
  </select>

  <select
    value={priorityFilter}
    onChange={(event) => setPriorityFilter(event.target.value)}
  >
    <option value="all">All Priorities</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>

  <select
    value={statusFilter}
    onChange={(event) => setStatusFilter(event.target.value)}
  >
    <option value="all">All Statuses</option>
    <option value="To Do">To Do</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>

  <select
    value={assigneeFilter}
    onChange={(event) => setAssigneeFilter(event.target.value)}
  >
    <option value="all">All Assignees</option>
    {assignees.map((assignee) => (
      <option key={assignee} value={assignee}>
        {assignee}
      </option>
    ))}
  </select>

  <select
    value={createdByFilter}
    onChange={(event) => setCreatedByFilter(event.target.value)}
  >
    <option value="all">All Creators</option>
    {creators.map((creator) => (
      <option key={creator} value={creator}>
        {creator}
      </option>
    ))}
  </select>

  <button
    type="button"
    onClick={() => {
      setSearchTerm("");
      setProjectFilter("all");
      setPriorityFilter("all");
      setStatusFilter("all");
      setAssigneeFilter("all");
      setCreatedByFilter("all");
    }}
  >
    Clear Filters
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

      
{!isLoading && !isError && !projectsLoading && (
  <div className="task-project-groups">
    {tasksByProject.map((project) => (
      <section className="panel projects-table-wrapper" key={project.id}>
        <div className="projects-heading">
          <div>
            <h2>{project.title}</h2>
            <p>{project.tasks.length} tasks in this project</p>
          </div>
        </div>

        {project.tasks.length === 0 ? (
          <p>No tasks in this project yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assignee</th>
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
                {project.tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.priority}</td>
                    <td>{task.status}</td>
                    <td>{task.assignee || "—"}</td>
                    <td>{task.parentId ?? "—"}</td>
                    <td>{task.createdByUsername || task.createdBy || "—"}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    ))}

    {unassignedTasks.length > 0 && (
      <section className="panel projects-table-wrapper">
        <h2>Unassigned / Unknown Project</h2>
        <p>{unassignedTasks.length} tasks</p>

        {unassignedTasks.map((task) => (
          <p key={task.id}>
            {task.title} — {task.status}
          </p>
        ))}
      </section>
    )}

    {projects.length === 0 && (
      <p>Create a project before organizing tasks.</p>
    )}
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
           tasks={tasks}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
     
    </div>
  );
}

export default Tasks;
