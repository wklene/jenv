import { z } from 'zod';

// Definitie van een Zod schema, hiermee kunnen we data uit de backend valideren, zodat je geen onverwachte gegevens krijgt
const TodoSchema = z.object({
    id: z.number().int(),
    userId: z.number().int().optional(),
    title: z.string(),
    description: z.string().optional(),
    deadline: z.string().optional(),
    completed: z.boolean().optional()
});

// Type definieren adhv het schema
export type Todo = z.infer<typeof TodoSchema>;

// uitgebreide type van de todo item, met support voor een x aantal highlighted eigenschappen
export type HighlightedTodo = Todo & {
    highlights?: { [key in keyof Todo]?: string };
};

// Schema voor een array van Todo's
export const TodoArraySchema = z.array(TodoSchema);
