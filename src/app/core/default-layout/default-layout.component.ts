import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { StorageServices } from '../../services';

import { SharedBaseModule, SharedFormModule } from '../../shared';


@Component({
    standalone: true,
    selector: 'app-input-text-component',
    inputs: [
        'form',
        'formControlName',
        'label',
        'labelRequired',
        'labelDisabled',
        'hasCustomGroup',
        'customPlaceholder',
        'inputType',
        'minLength',
        'maxLength',
        'smallText',
        'readonly',
        'customFieldValidation'
    ],
    outputs: [],
    imports: [
        RouterLink,
        SharedBaseModule,
        SharedFormModule,
        RouterOutlet
    ],
    template: `
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <button (click)="toggleNavbar()" type="button" class="navbar-toggler">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <a class="navbar-brand" routerLink="/dashboard">Navbar</a>
                <div class="navbar-collapse collapse" [ngClass]="{ 'show': navbarOpen }">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page" routerLink="/">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
                               aria-expanded="false">
                                Management
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" routerLink="/management/user">User</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page" (click)="onSignOut()" style="cursor: pointer">Sign Out</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container" style="padding: 24px 16px">
            <!-- Content here -->
            <router-outlet></router-outlet>
        </div>

    `
})
export class AppDefaultLayoutComponent {
    navbarOpen = false;

    constructor(
        private router: Router,
        private storageServices: StorageServices,
    ) {
    }

    toggleNavbar() {
        this.navbarOpen = !this.navbarOpen;
    }

    async onSignOut() {
        this.storageServices.clearLocalStorage();

        await this.router.navigateByUrl('/sign-in');
    }
}
