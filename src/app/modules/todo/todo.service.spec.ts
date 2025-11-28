import { provideHttpClient } from '@angular/common/http';
import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Todo } from './todo.model';
import z, { ZodError } from 'zod';

describe('TodoService', () => {
    let service: TodoService;
    let httpTestingController: HttpTestingController;

    const apiUrl = '/assets/todo.json';
    const mockTodo: Todo[] = [
        { id: 1, title: 'Mock Post 1', description: 'Body 1' },
        { id: 2, title: 'Mock Post 2', description: 'Body 2' }
    ];

    afterEach(() => {
        httpTestingController.verify();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TodoService]
        });
        service = TestBed.inject(TodoService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be able to get todo items', (done) => {
        expect.assertions(3);

        service.getTodoItems().subscribe((items) => {
            expect(items.length).toBe(2);
            expect(items).toEqual(mockTodo);
            done();
        });

        const req = httpTestingController.expectOne(apiUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockTodo);
    });

    it('should be fail if retreived data doesnt match our todo validation schema', (done) => {
        expect.assertions(3);

        service.getTodoItems().subscribe({
            error: (error) => {
                expect(z.prettifyError(error)).toContain('Invalid input: expected string, received number');
                expect(error instanceof ZodError).toBe(true);
                done();
            }
        });

        const req = httpTestingController.expectOne(apiUrl);
        expect(req.request.method).toBe('GET');
        req.flush([...mockTodo, { id: 4, title: 4 }]);
    });
});
