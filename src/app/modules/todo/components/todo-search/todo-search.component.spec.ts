import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { mockTodoStore } from '../../todo.mock';
import { TodoStore } from '../todo.store';
import { TodoSearchComponent } from './todo-search.component';

describe('TodoListPageComponent', () => {
    let component: TodoSearchComponent;
    let fixture: ComponentFixture<TodoSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [provideRouter([])]
        }).compileComponents();

        // we overschrijven hier de provided TodoStore en pakken hier onze mocked store.
        // dit doen we los van de originele configuratie ivm werking locally provided services
        TestBed.overrideComponent(TodoSearchComponent, {
            set: {
                providers: [{ provide: TodoStore, useValue: mockTodoStore }]
            }
        });

        fixture = TestBed.createComponent(TodoSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should search our todo store when search value has been set', fakeAsync(() => {
        component.searchControl.setValue('zoe');
        component.searchControl.setValue('zoeken maar!');

        // debounce time
        tick(300);
        fixture.detectChanges();

        expect(mockTodoStore.search).toHaveBeenCalledWith('zoeken maar!');
    }));
});
