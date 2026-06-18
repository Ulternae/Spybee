import { z } from "zod";
import { IncidentPriority } from "@/generated/prisma/enums";

const incidentPriorityValues = [
  IncidentPriority.LOW,
  IncidentPriority.MEDIUM,
  IncidentPriority.HIGH,
] as const;

const incidentFormSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  categoryId: z.string().trim().min(1),
  priority: z.enum(incidentPriorityValues),
  tagIds: z.array(z.string().trim().min(1)).default([]),
  assigneeIds: z.array(z.string().trim().min(1)).default([]),
  observerIds: z.array(z.string().trim().min(1)).default([]),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  locationDescription: z.string().trim().optional(),
  dueDate: z.coerce.date(),
});

type IncidentFormInput = z.infer<typeof incidentFormSchema>;

export { incidentFormSchema };
export type { IncidentFormInput };
