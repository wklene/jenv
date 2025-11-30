import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoStore } from '../../components/todo.store';
import { mockTodoStore } from '../../todo.mock';
import { TodoListPageComponent } from './todo-list-page.component';

describe('TodoListPageComponent', () => {
    let component: TodoListPageComponent;
    let fixture: ComponentFixture<TodoListPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        })
        .compileComponents();

         // we overschrijven hier de provided TodoStore en pakken hier onze mocked store
        TestBed.overrideComponent(TodoListPageComponent, {
            set: {
                providers: [
                    { provide: TodoStore, useValue: mockTodoStore }
                ]
            }
        });

        fixture = TestBed.createComponent(TodoListPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    afterEach( () => {
        mockTodoStore.loadTodos.mockClear();
    })

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should call loadTodos exactly once on initialization', () => {
        fixture.detectChanges();
        expect(mockTodoStore.loadTodos).toHaveBeenCalledTimes(1);
    });
});