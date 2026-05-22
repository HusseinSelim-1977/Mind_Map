import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  assignee: z.string().optional(),
  deadline: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
