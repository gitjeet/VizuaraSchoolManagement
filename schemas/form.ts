import { z } from "zod";

export const formSchema = z.object({
  school: z.string(),
  dateVisit: z.date(),
  name:z.string().optional(),
  weeksPortionsCovered: z.string(),
  feedback: z.string(),
  images: z.array(z.instanceof(File)).optional(),
  videos: z.array(z.instanceof(File)).optional(),
  
});

export type formSchemaType = z.infer<typeof formSchema>;
