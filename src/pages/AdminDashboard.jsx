
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjects,
  fetchTasks,
  fetchUsers,
  deleteTask,
} from "../services/tasksApi";
import { deleteProject } from "../services/projectsApi";

function AdminDashboard() {
  const queryClient = useQueryClient();

  // Load all projects
  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // Load all tasks
  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Load registered users
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Delete project and its tasks
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Delete task and all its descendants
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const isLoading = projectsLoading || tasksLoading || usersLoading;

  const handleDeleteProject = (project) => {
    const confirmed = window.confirm(
      `Delete "${project.title}" and all its tasks?`
    );

    if (confirmed) {
      deleteProjectMutation.mutate(project.id);
    }
  };

  const handleDeleteTask = (task) => {
    const confirmed = window.confirm(
      `Delete "${task.title}" and all its child tasks?`
    );

    if (confirmed) {
      deleteTaskMutation.mutate(task.id);
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(
      (item) => String(item.id) === String(projectId)
    );

    return project ? project.title : "Unknown project";
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <h1>Admin Dashboard</h1>
        <p>Loading workspace information...</p>
      </div>
    );
  }

  if (projectsError || tasksError || usersError) {
    return (
      <div className="page-container">
        <h1>Admin Dashboard</h1>
        <p role="alert">
          Failed to load workspace information. Please check that JSON Server
          is running.
        </p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="projects-heading">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage and monitor the entire workspace.</p>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="dashboard-stats">
        <div className="panel">
          <h3>Total Users</h3>
          <h2>{users.length}</h2>
        </div>

        <div className="panel">
          <h3>Total Projects</h3>
          <h2>{projects.length}</h2>
        </div>

        <div className="panel">
          <h3>Total Tasks</h3>
          <h2>{tasks.length}</h2>
        </div>
      </div>

      {/* All Projects */}
      <div className="panel">
        <h2>All Workspace Projects</h2>

        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="projects-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Owner</th>
                  <th>Members</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.title}</td>

                    <td>
                      {project.ownerUsername || project.owner || "—"}
                    </td>

                    <td>
                      {Array.isArray(project.members)
                        ? project.members.join(", ") || "—"
                        : project.members || "—"}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project)}
                        disabled={deleteProjectMutation.isPending}
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

        {deleteProjectMutation.isError && (
          <p role="alert">
            {deleteProjectMutation.error.message}
          </p>
        )}
      </div>

      {/* All Tasks */}
      <div className="panel">
        <h2>All Workspace Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="projects-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Parent Task</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>

                    <td>{getProjectName(task.projectId)}</td>

                    <td>{task.assignee || "Unassigned"}</td>

                    <td>{task.priority || "—"}</td>

                    <td>{task.status || "—"}</td>

                    <td>
                      {task.parentId
                        ? tasks.find(
                            (item) =>
                              String(item.id) === String(task.parentId)
                          )?.title || "Parent not found"
                        : "Main task"}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task)}
                        disabled={deleteTaskMutation.isPending}
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

        {deleteTaskMutation.isError && (
          <p role="alert">
            {deleteTaskMutation.error.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
