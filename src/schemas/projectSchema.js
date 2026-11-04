import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Project title is required.")
    .max(100, "Project title must be 100 characters or less."),

  members: z.string(),

  completedAt: z.string(),
});