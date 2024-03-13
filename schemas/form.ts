import { z } from "zod";

export const formSchema = z.object({
  school: z.string(),
  dateVisit: z.date(),
  
  weeksPortionsCovered: z.string(),
  feedback: z.string(),
  images: z.array(z.instanceof(File)).optional(),
  videos: z.array(z.instanceof(File)).optional(),
});

export type formSchemaType = z.infer<typeof formSchema>;
