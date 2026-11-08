
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../services/projectsApi";
import { fetchTasks } from "../services/tasksApi";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  if (projectsQuery.isLoading || tasksQuery.isLoading) {
    return <div className="page-container">Loading project details...</div>;
  }

  if (projectsQuery.isError || tasksQuery.isError) {
    return <div className="page-container">Failed to load project details.</div>;
  }

  const projects = projectsQuery.data || [];
  const tasks = tasksQuery.data || [];

  const project = projects.find(
    (item) => String(item.id) === String(id)
  );

  if (!project) {
    return (
      <div className="page-container">
        <h2>Project not found</h2>
        <button onClick={() => navigate("/dashboard/projects")}>
          Back to Projects
        </button>
      </div>
    );
  }

  const projectTasks = tasks.filter(
    (task) => String(task.projectId) === String(id)
  );

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
    ? Math.round((completed / projectTasks.length) * 100)
    : 0;

  const members = Array.isArray(project.members)
    ? project.members.join(", ")
    : project.members || "No members added";

  return (
    <div className="page-container project-details-page">
      <button
        className="project-details-back"
        onClick={() => navigate("/dashboard/projects")}
      >
        ← Back to Projects
      </button>

      <section className="project-details-hero">
        <div>
          <span className="project-details-label">PROJECT OVERVIEW</span>
          <h1>{project.title}</h1>
          <p>Manage and track all tasks associated with this project.</p>
        </div>

        <button
          className="project-details-manage"
          onClick={() => navigate("/dashboard/tasks")}
        >
          Manage Tasks →
        </button>
      </section>

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
            <strong>{project.ownerUsername || project.owner || "Not assigned"}</strong>
          </div>

          <div>
            <span>Team Members</span>
            <strong>{members}</strong>
          </div>

          <div>
            <span>Created</span>
            <strong>
              {project.createdAt
                ? new Date(project.createdAt).toLocaleDateString()
                : "Not available"}
            </strong>
          </div>

          <div>
            <span>Last Updated</span>
            <strong>
              {project.updatedAt
                ? new Date(project.updatedAt).toLocaleDateString()
                : "Not available"}
            </strong>
          </div>
        </div>
      </section>

      <section className="project-details-card">
        <div className="project-details-card-heading">
          <h2>Project Tasks</h2>
          <span>{projectTasks.length} tasks</span>
        </div>

        {projectTasks.length === 0 ? (
          <p className="project-details-empty">
            No tasks have been created for this project yet.
          </p>
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
                </tr>
              </thead>

              <tbody>
                {projectTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>
                      <span className={`task-priority-badge ${task.priority?.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`task-status-badge ${task.status?.toLowerCase().replaceAll(" ", "-")}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>{task.assignee || "Unassigned"}</td>
                    <td>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "Not set"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectDetails;
