import { Routes } from '@angular/router';

import { AppUserTableComponent } from './user-table.component';
import { AppUserFormComponent } from './user-form.component';

export const UserManagementRouting: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list'
            },
            {
                path: 'list',
                component: AppUserTableComponent
            },
            {
                path: 'create',
                component: AppUserFormComponent
            },
            {
                path: 'update/:id',
                component: AppUserFormComponent
            }
        ]
    }
];
