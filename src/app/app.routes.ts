import { Routes } from '@angular/router';

export const routes: Routes = [
    // standaard pad, voorlopig een redirect naar onze todo pagina
    {
        path: '',
        redirectTo: 'todo',
        pathMatch: 'full'
    },
    // het todo pad, alle kind-routes worden zo lazy ingeladen
    {
        path: 'todo',
        loadChildren: () => import('./modules/todo/todo.routes').then((m) => m.TodoRoutes)
    }
];
