import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import z, { ZodError } from 'zod';
import { HighlightedTodo, Todo } from '../todo.model';
import { TodoService } from '../todo.service';

// Deze store beheert mijn gegevens, hij is niet provided in root, maar op pagina niveau en deelt data met onderliggende componenten
@Injectable()
export class TodoStore {
    private readonly todoService = inject(TodoService);

    // private variabelen die de waarden vasthouden, met gebruik van signals
    private readonly _todos = signal<Todo[]>([]);
    private readonly _isLoading = signal(false);
    private readonly _error = signal('');
    private readonly _searchValue = signal('');

    // variabelen naar buiten 'exposed', maar readonly dus niet mutable van buitenaf
    readonly todos = this._todos.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();

    // filtering op de todo lijst adhv een searchValue, inclusief highlighting
    // gekozen om alleen te zoeken/highlighten op title. Kan ook op meerdere properties
    readonly filteredTodos = computed<HighlightedTodo[]>(() => {
        const todos = this._todos();
        const searchValue = this._searchValue();

        // geen zoek value, alles tonen
        if (searchValue === '') return todos;

        return (
            todos
                // eerst filteren
                .filter((todo) => todo.title.toLowerCase().includes(searchValue.toLowerCase()))
                // gefilterede lijst gebruiken voor de highlights
                .map((todo) => {
                    const regex = new RegExp(`(${searchValue})`, 'gi');
                    // aangezien we alleen op title zoeken wordt deze alleen toegevoegd aan de highlights
                    return {
                        ...todo,
                        highlights: {
                            title: todo.title.replace(regex, '<mark class="p-0">$1</mark>')
                        }
                    };
                })
        );
    });

    // methode om alle todo items op te halen
    loadTodos(): void {
        // zet 'loading' op true
        this._isLoading.set(true);

        // ophalen via service > api
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

    // methode om de zoek value (signal) te zetten, verder is alles reactief
    search(value: string): void {
        this._searchValue.set(value);
    }

    // updaten van de todo lisjst met aangepaste item
    updateTodo(updatedTodoItem: Todo): void {
        const currentTodos = this._todos();
        const updatedTodos = currentTodos.map((todoItem) => (todoItem.id === updatedTodoItem.id ? updatedTodoItem : todoItem));
        this._todos.set(updatedTodos);
    }

    // toevoegen van een nieuwe id, we gebruiken voor de hulp functie voor een ID value
    addTodo(todoItem: Omit<Todo, 'id'>): void {
        const newTodo = {
            ...todoItem,
            id: this.generateId()
        };

        this._todos.update((currentTodos) => [...currentTodos, newTodo]);
    }

    // verwijderen van een todo uit de lijst
    deleteTodo(id: number): void {
        this._todos.update((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    }

    // kleine hulp functie voor een unieke id, normaal gesproken iets wat in de backed zit
    private readonly generateId = (): number => {
        const storedTodoItems = this._todos();
        const maxId = Math.max(0, ...storedTodoItems.map((todo) => todo.id));
        return maxId + 1;
    };
}
