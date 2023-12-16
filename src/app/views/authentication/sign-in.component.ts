import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { keystore, SharedBaseModule } from '../../shared';

import { AppFormComponent } from '../../components/form';
import { AppInputTextComponent } from '../../components/input';

import { SignIn } from '../../models';
import { StorageServices } from '../../services';

@Component({
    standalone: true,
    imports: [ SharedBaseModule, AppFormComponent, AppInputTextComponent ],
    template: `
        <div class="sign-in-container">
            <div class="sign-in-wrapper">
                <div class="sign-in-intro-wrapper">
                    <h2>Sign in.</h2>
                    <p>Welcome back, please sign in to get started</p>
                </div>

                <app-form-component [form]="form" (onSubmit)="onSubmit($event)" actionDisabled="true">
                    <app-input-text-component
                        [form]="form" [readonly]="formLoading"
                        formControlName="username"
                        label="Username"
                        labelDisabled="true"
                        hasCustomGroup="true"
                        customPlaceholder="Please Input Email"
                    ></app-input-text-component>

                    <app-input-text-component
                        [form]="form"
                        [readonly]="formLoading"
                        formControlName="password"
                        label="Password"
                        labelDisabled="true"
                        hasCustomGroup="true" inputType="password"
                        customPlaceholder="Please Input Password"
                    ></app-input-text-component>

                    <div class="d-grid gap-2 mx-auto">
                        <button
                            type="submit"
                            class="px-4 btn btn-primary"
                        >
                            Login
                        </button>
                    </div>
                </app-form-component>
            </div>
        </div>
    `,
    styleUrls: [ 'sign-in.component.scss' ],
})
export class AppSignInComponent implements OnDestroy {
    private ngUnsubscribe = new Subject();

    id?: string | null;
    form: FormGroup;

    formLoading: boolean = false;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private toasterService: ToastrService,
        private storageServices: StorageServices,
    ) {
        this.form = this.formBuilder.group(new SignIn());
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

    async onSubmit(value: any) {
        this.formLoading = true;

        if (value.username !== 'admin' || value.password !== 'admin') {
            this.formLoading = false;

            return this.toasterService.error('Error: Wrong username or password', 'Error');
        }

        this.storageServices.setLocalStorage(keystore.accessToken, 'Temporary access granted');

        this.formLoading = false;

        return await this.router.navigateByUrl(`/`);
    }
}
