import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TodoStore } from '../../components/todo.store';

@Component({
    selector: 'app-todo-list-page',
    templateUrl: './todo-list-page.component.html',
    // hier wordt de todostore toegevoegd en "aangemaakt"
    providers: [TodoStore],
    imports: [ReactiveFormsModule, RouterModule],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListPageComponent {
    // gebruik van de todostore in dit component
    private todoStore = inject(TodoStore);

    constructor() {
        // eenmalig inladen todo items
        this.todoStore.loadTodos();
    }
}
