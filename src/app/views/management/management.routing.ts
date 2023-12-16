import { Routes } from '@angular/router';

export const ManagementRouting: Routes = [
    {
        path: 'user',
        loadChildren: () => import('./user/user-management.routing').then((mod) => mod.UserManagementRouting)
    },
];
