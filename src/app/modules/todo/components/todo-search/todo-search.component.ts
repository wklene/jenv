import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { TodoStore } from '../todo.store';

@Component({
    selector: 'app-todo-search',
    templateUrl: './todo-search.component.html',
    imports: [ReactiveFormsModule],
    standalone: true,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoSearchComponent {
    // gebruik van de todostore, eerder provided
    private todoStore = inject(TodoStore);
    private destroyRef = inject(DestroyRef);

    searchControl = new FormControl<string>('');

    constructor() {
        // bij wijzigingen van de search control voeren wij een search op de todo store
        this.searchControl.valueChanges
            .pipe(
                // kleine debounce, zodat hij niet te vaak triggered
                debounceTime(300),
                // cleanup on destroy
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((searchValue) => {
                this.todoStore.search(searchValue ?? '');
            });
    }
}
