import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjects,
  saveProject,
  deleteProject,
} from "../services/projectsApi";

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const saveMutation = useMutation({
    mutationFn: saveProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projectsQuery,
    saveMutation,
    deleteMutation,
  };
}