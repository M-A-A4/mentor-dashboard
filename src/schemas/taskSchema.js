
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required.").max(100),

  priority: z.enum(["Low", "Medium", "High"]),

  status: z.enum(["To Do", "In Progress", "Completed"]),

  assignee: z.string(),

  projectId: z.string().min(1, "Please select a project."),

  parentId: z.string(),

  dueDate: z.string(),
});
