
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchTasks,
  fetchProjects,
  saveTask,
  deleteTask,
} from "../services/tasksApi";

export function useTasks() {
  const queryClient = useQueryClient();

  // Get all tasks
  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Get all projects
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // Create or update a task
  const saveMutation = useMutation({
    mutationFn: saveTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  // Delete a task
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  return {
    tasksQuery,
    projectsQuery,
    saveMutation,
    deleteMutation,
  };
}
