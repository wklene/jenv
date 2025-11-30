import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Todo } from '../../todo.model';
import { TodoStore } from '../todo.store';

@Component({
    selector: 'app-todo-details',
    templateUrl: './todo-details.component.html',
    imports: [ReactiveFormsModule],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoDetailsComponent {
    // gebruik van de todostore in dit component
    private todoStore = inject(TodoStore);
    protected activatedRoute = inject(ActivatedRoute);

    // ophalen van geselecteerde todoId uit de routing
    protected activeTodoId = toSignal(this.activatedRoute.params.pipe(map((params) => params['todoId'])));
    // computed signal voor het checken of we een nieuwe todo willen aanmaken
    protected newTodoMode = computed(() => this.activeTodoId() === 'new');

    // mapping van de variabelen uit de todo store
    protected todoItems = this.todoStore.todos;
    protected isLoading = this.todoStore.isLoading;

    // reactief formulier voor een todo
    protected todoForm = new FormGroup({
        id: new FormControl<number | null>(null),
        title: new FormControl('', Validators.required),
        description: new FormControl(''),
        deadline: new FormControl(''),
        completed: new FormControl(false)
    });

    // computed signal die adhv de geselecteerde id uit de routing de todo item zelf pakt
    readonly activeTodo = computed<Todo | undefined>(() => {
        const todoItems = this.todoItems();
        const selectedId = this.activeTodoId();

        if (selectedId && parseInt(selectedId)) {
            return todoItems.find((item) => item.id === parseInt(selectedId));
        } else {
            return undefined;
        }
    });

    // listener (signal) die kijken of de actieve todo item veranderd, zoja wordt het formulier aangepast
    private todoItemChangedEffect = effect(() => {
        const activeTodo = this.activeTodo();
        if (activeTodo) {
            this.todoForm.patchValue(activeTodo);
        } else {
            this.todoForm.reset();
        }
    });

    // opslaan of aanmaken van todo item. op basis van wel of geen ID value een andere call naar de store
    protected saveTodo = (): void => {
        if (this.todoForm.invalid) return;

        const formValue = this.todoForm.value;

        if (formValue.id) {
            this.todoStore.updateTodo({
                id: formValue.id,
                title: formValue.title ?? '',
                description: formValue.description ?? '',
                deadline: formValue.deadline ?? '',
                completed: formValue.completed ?? false
            });
        } else {
            this.todoStore.addTodo({
                title: formValue.title ?? '',
                description: formValue.description ?? '',
                deadline: formValue.deadline ?? '',
                completed: formValue.completed ?? false
            });
        }
    };

    // verwijderen van de actieve todo item
    protected deleteTodo = (): void => {
        const activeTodo = this.activeTodo();

        if (activeTodo) {
            this.todoStore.deleteTodo(activeTodo.id);
        }
    };
}
