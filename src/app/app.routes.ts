import { Routes } from '@angular/router';

import { AuthGuard } from './core/auth.guard';

import { AppDefaultLayoutComponent } from './core/default-layout/default-layout.component';

export const routes: Routes = [
    {
        path: 'sign-in',
        loadChildren: () => import('./views/authentication/sign-in.routing').then((mod) => mod.SignInRouting)
    },
    {
        path: '',
        component: AppDefaultLayoutComponent,
        canActivate: [ AuthGuard ],
        canActivateChild: [ AuthGuard ],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                // tslint:disable-next-line:max-line-length
                loadComponent: () => import('./views/dashboard/dashboard.component').then((mod) => mod.AppDashboardComponent)
            },
            {
                path: 'management',
                loadChildren: () => import('./views/management/management.routing').then((mod) => mod.ManagementRouting)
            },
        ]
    }
];
