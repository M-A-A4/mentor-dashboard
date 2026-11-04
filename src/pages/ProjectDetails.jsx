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
    return <p>Loading project details...</p>;
  }

  if (projectsQuery.isError || tasksQuery.isError) {
    return <p>Failed to load project details.</p>;
  }

  const project = projectsQuery.data.find(
    (item) => String(item.id) === id
  );

  if (!project) {
    return (
      <div>
        <h2>Project not found</h2>
        <button onClick={() => navigate("/dashboard/projects")}>
          Back to Projects
        </button>
      </div>
    );
  }

  const projectTasks = tasksQuery.data.filter(
    (task) => String(task.projectId) === id
  );

  return (
    <div className="page-container">
      <button onClick={() => navigate("/dashboard/projects")}>
        ← Back to Projects
      </button>

      <h1>{project.title}</h1>
      <p>Owner: {project.ownerUsername || project.owner}</p>
      <p>Members: {project.members || "None"}</p>

      <h2>Project Tasks ({projectTasks.length})</h2>

      {projectTasks.length === 0 ? (
        <p>No tasks have been created for this project yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
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
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td>{task.assignee || "Unassigned"}</td>
                  <td>{task.dueDate || "Not set"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;