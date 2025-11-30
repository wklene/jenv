import { signal } from '@angular/core';
import { HighlightedTodo, Todo } from './todo.model';

// herbruikbare mock voor onze todoStore
export const mockTodoStore = {
    loadTodos: jest.fn(),
    deleteTodo: jest.fn(),
    updateTodo: jest.fn(),
    addTodo: jest.fn(),
    search: jest.fn(),
    isLoading: signal(false),
    todos: signal<Todo[]>([]),
    filteredTodos: signal<HighlightedTodo[]>([])
};

// herbruikbare lijst met mock todo items
export const mockTodoItems: Todo[] = [
    {
        id: 1,
        title: 'Mock todo',
        description: 'This is for testing purposes',
        deadline: '2025-01-01',
        completed: false
    },
    {
        id: 2,
        title: 'Mock todo item',
        description: 'This is for testing purposes also',
        deadline: '2020-01-01',
        completed: true
    }
];

export const mockHighlightedTodoItems: HighlightedTodo[] = [
    {
        id: 1,
        title: 'Mock todo',
        description: 'This is for testing purposes',
        deadline: '2025-01-01',
        completed: false,
        highlights: { title: 'M<mark>ock</mark> todo' }
    },
    {
        id: 2,
        title: 'Mock todo item',
        description: 'This is for testing purposes also',
        deadline: '2020-01-01',
        completed: true
    }
];
