import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import z, { ZodError } from 'zod';
import { Todo } from '../todo.model';
import { TodoService } from '../todo.service';

// Deze store beheert mijn gegevens, hij is niet provided in root, maar op pagina niveau en deelt data met onderliggende componenten
@Injectable()
export class TodoStore {
    private readonly todoService = inject(TodoService);

    // private variabelen die de waarden vasthouden, met gebruik van signals
    private readonly _todos = signal<Todo[]>([]);
    private readonly _isLoading = signal(false);
    private readonly _error = signal('');

    // variabelen naar buiten 'exposed', maar readonly dus niet mutable van buitenaf
    readonly todos = this._todos.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();

    // computed signal met afgeleide waarde met een completed count
    readonly activeTodosCount = computed(() => {
        return this._todos().filter((todo) => !todo.completed).length;
    });

    // methode om alle todo items op te halen
    loadTodos(): void {
        // zet 'loading' op true
        this._isLoading.set(true);

        this.todoService.getTodoItems().subscribe({
            // het is gelukt, we zetten de waarde van de signal en zetten loader uit
            next: (todosFromApi) => {
                this._todos.set(todosFromApi);
                this._isLoading.set(false);
            },
            /* 
                error, we zetten het loaden uit en handelen de error af. dit gebeurd nu lokaal, normaal gesproken wil je 
                errors soms juist in een http interceptor afvangen en application wide tonen (of niet)
            */
            error: (error) => {
                this._isLoading.set(false);

                // afvangen van de zod validation
                if (error instanceof ZodError) {
                    const pretty = z.prettifyError(error);
                    this._error.set(pretty);
                }
                // afvangen van http errors 
                else if (error instanceof HttpErrorResponse) {
                    this._error.set(error.message);
                }
                // overige errors 
                else {
                    this._error.set('Unknown error');
                }
                console.warn('Failed to load todos:', error);
            }
        });
    }

    // draft versie van todo toevoegen op basis van alleen een titel
    addTodo(title: string): void {
        const newTodo = {
            id: this.generateId(),
            title
        };

        this._todos.update((currentTodos) => [...currentTodos, newTodo]);
    }

    // kleine hulp functie voor een unieke id, normaal gesproken iets wat in de backed zit
    private readonly generateId = (): number => {
        const storedTodoItems = this._todos();
        const maxId = Math.max(0, ...storedTodoItems.map((todo) => todo.id));
        return maxId + 1;
    };
}
