import { Routes } from '@angular/router';
import { TodoDetailsComponent } from './components/todo-details/todo-details.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoListPageComponent } from './pages/todo-list-page/todo-list-page.component';

/* 
    Deze routes zijn gemaakt voor een setup met meerdere router-outlets. 
    Hiervoor gekozen om een lijst en detailweergave op 1 pagina te tonen.
*/
export const TodoRoutes: Routes = [
    // standaard lege pad ('todo') toont de algemene todo pagina in de hoofd router-outlet
    {
        path: '',
        component: TodoListPageComponent,
        children: [
            // standaard lege pad toont 1 component in de onderliggende router-outlet. namelijk de todolijst
            {
                path: '',
                component: TodoListComponent
            },
            // het pad naar een specifieke todo-item toont twee componenten. De lijst en de detail pagina
            {
                path: ':todoId',
                children: [
                    {
                        path: '',
                        component: TodoListComponent
                    },
                    {
                        path: '',
                        component: TodoDetailsComponent,
                        // detail pagina getoond in de detailsOutlet
                        outlet: 'detailsOutlet'
                    }
                ]
            }
        ]
    }
];
