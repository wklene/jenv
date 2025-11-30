import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { mockTodoItems, mockTodoStore } from '../../todo.mock';
import { TodoStore } from '../todo.store';
import { TodoListComponent } from './todo-list.component';

describe('TodoListPageComponent', () => {
    let component: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, DatePipe]
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
            mockTodoStore.todos.set(mockTodoItems);
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
    });
});
