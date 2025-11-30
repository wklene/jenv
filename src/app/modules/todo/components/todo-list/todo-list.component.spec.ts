import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { mockHighlightedTodoItems, mockTodoItems, mockTodoStore } from '../../todo.mock';
import { TodoStore } from '../todo.store';
import { TodoListComponent } from './todo-list.component';

describe('TodoListPageComponent', () => {
    let component: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, DatePipe],
            providers: [provideRouter([])]
        }).compileComponents();

        // we overschrijven hier de provided TodoStore en pakken hier onze mocked store.
        // dit doen we los van de originele configuratie ivm werking locally provided services
        TestBed.overrideComponent(TodoListComponent, {
            set: {
                providers: [
                    { provide: TodoStore, useValue: mockTodoStore },
                    { provide: ActivatedRoute, useValue: { params: of({}) } }
                ]
            }
        });

        fixture = TestBed.createComponent(TodoListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should show a spinner when loading', () => {
        expect(fixture.debugElement.query(By.css('[data-test="todo-list_loading"]'))).toBeFalsy();
        mockTodoStore.isLoading.set(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('[data-test="todo-list_loading"]'))).toBeTruthy();
        mockTodoStore.isLoading.set(false);
    });

    describe('showing items', () => {
        beforeEach(() => {
            mockTodoStore.filteredTodos.set(mockTodoItems);
            fixture.detectChanges();
        });

        it('should show a list of todo items if available', () => {
            const pipe = new DatePipe('en');

            const rows = fixture.debugElement.queryAll(By.css('[data-test="todo-list_row"]'));
            expect(rows.length).toBe(2);

            rows.forEach((row, index) => {
                expect(row.nativeElement.textContent).toContain(mockTodoItems[index].title);
                // deadline zou een vriendelijke waarde moeten tonen, want we gebruiken een date pipe in de html
                const deadline = pipe.transform(mockTodoItems[index].deadline);
                expect(row.nativeElement.textContent).toContain(deadline);
                // controleren of de checkbox goed is gezet op basis van de completed eigenschap
                expect(row.query(By.css('input[type="checkbox"]')).nativeElement.checked).toBe(mockTodoItems[index].completed);
            });
        });

        it('should be able to navigate to details of an item', () => {
            const router = TestBed.inject(Router);
            router.navigateByUrl = jest.fn();

            fixture.debugElement.query(By.css('[data-test="todo-list_link"]')).nativeElement.click();
            fixture.detectChanges();

            expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree([`/todo/1`]), expect.any(Object));
        });

        it('should be able to complete a todo', () => {
            const row = fixture.debugElement.query(By.css('[data-test="todo-list_row"]'));
            row.query(By.css('input[type="checkbox"]')).nativeElement.click();

            fixture.detectChanges();

            expect(mockTodoStore.updateTodo).toHaveBeenCalledWith({
                ...mockTodoItems[0],
                completed: true
            });
        });
    });

    it('should be able to show higlights', () => {
        mockTodoStore.filteredTodos.set(mockHighlightedTodoItems);
        fixture.detectChanges();

        const row = fixture.debugElement.query(By.css('[data-test="todo-list_row"]'));
        expect(row.nativeElement.innerHTML).toContain(mockHighlightedTodoItems[0].highlights?.title);
    });

    it('should be able to add new todo', () => {
        const router = TestBed.inject(Router);
        router.navigateByUrl = jest.fn();

        fixture.debugElement.query(By.css('[data-test="todo-list_new"]')).nativeElement.click();
        fixture.detectChanges();

        expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree([`/todo/new`]), expect.any(Object));
    });
});
