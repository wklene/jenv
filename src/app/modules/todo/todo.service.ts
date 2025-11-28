import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Todo, TodoArraySchema } from './todo.model';

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    private readonly httpClient = inject(HttpClient);

    // Locatie van mijn "Fake API"
    private readonly apiUrl = '/assets/todo.json';

    // ophalen voor alle todo items
    getTodoItems(): Observable<Todo[]> {
        return this.httpClient.get<Todo[]>(this.apiUrl).pipe(
            // neppe vertraging om wat network latency te mocken ivm loading/spinners
            delay(1000),
            // valideren van backend data met Zod library
            map((response: Todo[]) => TodoArraySchema.parse(response))
        );
    }
}
