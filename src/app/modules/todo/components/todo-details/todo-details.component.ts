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
    protected activatedRoute = inject(ActivatedRoute);
    // gebruik van de todostore in dit component
    private todoStore = inject(TodoStore);

    // ophalen van geselecteerde todoId uit de routing
    protected activeTodoId = toSignal(this.activatedRoute.params.pipe( map((params) => params['todoId'] )));
    // computed signal voor het checken of we een nieuwe todo willen aanmaken
    protected newTodoMode = computed( () => this.activeTodoId() === 'new' );

    // mapping van de variabelen uit de todo store
    protected todoItems = this.todoStore.todos;
    protected isLoading = this.todoStore.isLoading;

    // reactief formulier voor een todo
    protected todoForm = new FormGroup({
        id: new FormControl<number | null>({ value: null, disabled: true }),
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
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
}
