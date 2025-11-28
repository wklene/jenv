import { z } from 'zod';

// Definitie van een Zod schema, hiermee kunnen we data uit de backend valideren, zodat je geen onverwachte gegevens krijgt
const TodoSchema = z.object({
    id: z.number().int(),
    title: z.string(),
    description: z.string().optional(),
    deadline: z.coerce.date().optional(),
    completed: z.boolean().optional()
});

// Type definieren adhv het schema
export type Todo = z.infer<typeof TodoSchema>;

// Schema voor een array van Todo's
export const TodoArraySchema = z.array(TodoSchema);
