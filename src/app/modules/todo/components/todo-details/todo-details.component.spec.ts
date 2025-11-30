import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { mockTodoItems, mockTodoStore } from '../../todo.mock';
import { TodoStore } from '../todo.store';
import { TodoDetailsComponent } from './todo-details.component';

describe('TodoListPageComponent', () => {
    let component: TodoDetailsComponent;
    let fixture: ComponentFixture<TodoDetailsComponent>;

    const routeParams = new Subject();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        }).compileComponents();

        // we overschrijven hier de provided TodoStore en pakken hier onze mocked store
        TestBed.overrideComponent(TodoDetailsComponent, {
            set: {
                providers: [
                    { provide: TodoStore, useValue: mockTodoStore },
                    { provide: ActivatedRoute, useValue: { params: routeParams.asObservable() } }
                ]
            }
        });

        fixture = TestBed.createComponent(TodoDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        mockTodoStore.todos.set([]);
        routeParams.next({});
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should show a spinner when loading', () => {
        expect(fixture.debugElement.query(By.css('[data-test="todo-details_loading"]'))).toBeFalsy();
        mockTodoStore.isLoading.set(true);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('[data-test="todo-details_loading"]'))).toBeTruthy();
        mockTodoStore.isLoading.set(false);
    });

    it('should set an active todo based on route and todo items array', () => {
        // geen todo items beschikbaar, dus activeTodo is undefined
        expect(component.activeTodo()).toBeFalsy();

        mockTodoStore.todos.set(mockTodoItems);
        fixture.detectChanges();

        // wel todo items beschikbaar, maar geen actieve id in de activatedRoute, dus activeTodo is undefined
        expect(component.activeTodo()).toBeFalsy();

        routeParams.next({ todoId: 1 });
        fixture.detectChanges();

        // beide gezet en er is een match
        expect(component.activeTodo()).toBeTruthy();
    });

    it('should show a message when there is no active todo item', () => {
        expect(fixture.debugElement.query(By.css('[data-test="todo-details_notfound"]')).nativeElement.textContent).toContain(
            'Helaas, geen todo item gevonden.'
        );
    });

    it('should show the active form values', () => {
        mockTodoStore.todos.set(mockTodoItems);
        routeParams.next({ todoId: 1 });
        fixture.detectChanges();

        const titleInputElement = fixture.debugElement.query(By.css('input[formControlName="title"]')).nativeElement;
        expect(titleInputElement.value).toBe(mockTodoItems[0].title);

        const descriptionInputElement = fixture.debugElement.query(By.css('textarea[formControlName="description"]')).nativeElement;
        expect(descriptionInputElement.value).toBe(mockTodoItems[0].description);

        const deadlineInputElement = fixture.debugElement.query(By.css('input[formControlName="deadline"]')).nativeElement;
        expect(deadlineInputElement.value).toBe(mockTodoItems[0].deadline);

        const completedInputElement = fixture.debugElement.query(By.css('input[formControlName="completed"]')).nativeElement;
        expect(completedInputElement.checked).toBe(mockTodoItems[0].completed);
    });

    it('should be able to delete a todo item', () => {
        mockTodoStore.todos.set(mockTodoItems);
        routeParams.next({ todoId: 1 });
        fixture.detectChanges();

        fixture.debugElement.query(By.css('[data-test="todo-details_delete"]')).nativeElement.click();
        fixture.detectChanges();

        expect(mockTodoStore.deleteTodo).toHaveBeenCalledWith(1);
    });

    it('should be able to update a todo item', () => {
        mockTodoStore.todos.set(mockTodoItems);
        routeParams.next({ todoId: 1 });
        fixture.detectChanges();

        const titleInputElement = fixture.debugElement.query(By.css('input[formControlName="title"]')).nativeElement;
        titleInputElement.value = 'changed title';
        titleInputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        fixture.debugElement.query(By.css('[data-test="todo-details_save"]')).nativeElement.click();
        fixture.detectChanges();

        expect(mockTodoStore.updateTodo).toHaveBeenCalledWith({
            ...mockTodoItems[0],
            title: 'changed title'
        });
    });

    it('should be able to add a new todo item', () => {
        mockTodoStore.todos.set(mockTodoItems);
        routeParams.next({ todoId: 'new' });
        fixture.detectChanges();

        const titleInputElement = fixture.debugElement.query(By.css('input[formControlName="title"]')).nativeElement;
        titleInputElement.value = 'changed title';
        titleInputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        fixture.debugElement.query(By.css('[data-test="todo-details_save"]')).nativeElement.click();
        fixture.detectChanges();

        expect(mockTodoStore.addTodo).toHaveBeenCalledWith({
            title: 'changed title',
            completed: false,
            deadline: '',
            description: ''
        });
    });
});
