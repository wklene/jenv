import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { Todo } from '../../todo.model';
import { TodoSearchComponent } from '../todo-search/todo-search.component';
import { TodoStore } from '../todo.store';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule, DatePipe, TodoSearchComponent],
    standalone: true,
    styleUrls: ['./todo-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
    protected activatedRoute = inject(ActivatedRoute);
    // gebruik van de todostore, eerder provided
    private todoStore = inject(TodoStore);

    // mapping van de variabelen uit de todo store
    protected todoItems = this.todoStore.filteredTodos;
    protected isLoading = this.todoStore.isLoading;

    // op de routing wordt gekeken of er een id inzit die in de details wordt getoond. Dit ivm actieve selectie.
    protected activeTodoId = toSignal(this.activatedRoute.params.pipe(map((params) => params['todoId'])));

    // methode om deze todo item af te ronden
    protected toggleTodoCompletion = (item: Todo): void => {
        this.todoStore.updateTodo(item);
    };
}
