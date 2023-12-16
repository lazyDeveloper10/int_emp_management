import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { SharedBaseModule } from '../../../shared';

import { AppCardComponent } from '../../../components/card';
import { AppFormComponent } from '../../../components/form';
import { AppInputCurrencyComponent, AppInputTextComponent } from '../../../components/input';
import { AppDatepickerComponent } from '../../../components/datepicker';
import { AppDropdownComponent } from '../../../components/dropdown';

import { User, UserInterface } from '../../../models';
import { ApiServices, managementApiService } from '../../../services';

@Component({
    standalone: true,
    imports: [ SharedBaseModule, AppCardComponent, AppFormComponent, AppInputTextComponent, AppDatepickerComponent, AppDropdownComponent, AppInputCurrencyComponent, AppInputCurrencyComponent, ],
    template: `
        <app-card-component [headerTitle]="id ? 'Update User' : 'Create User'">
            <app-form-component
                (onSubmit)="onSubmit($event)"
                (onCancel)="onCancel()"
                [form]="form"
                [actionStandalone]="false"
                [canSubmit]="true"
                [submitLabel]="id ? 'Update' : 'Create'"
                [canCancel]="true"
                [cancelDisabled]="formLoading"
            >
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <app-input-text-component
                            [form]="form"
                            [labelRequired]="true"
                            [readonly]="formLoading"
                            label="First Name"
                            formControlName="firstName"
                        ></app-input-text-component>

                        <app-input-text-component
                            [form]="form"
                            [labelRequired]="true"
                            [readonly]="formLoading"
                            label="Last Name"
                            formControlName="lastName"
                        ></app-input-text-component>

                        <app-input-text-component
                            [form]="form"
                            [labelRequired]="true"
                            [readonly]="formLoading"
                            label="Username"
                            formControlName="username"
                        ></app-input-text-component>

                        <app-input-text-component
                            [form]="form"
                            [labelRequired]="true"
                            [readonly]="formLoading"
                            label="Status"
                            formControlName="status"
                        ></app-input-text-component>

                        <app-datepicker-component
                            [form]="form"
                            [labelRequired]="true"
                            [readonly]="formLoading"
                            [maxDate]="maxDate"
                            label="Birth Date"
                            formControlName="birthdate"
                        ></app-datepicker-component>
                    </div>

                    <div class="col-12 col-sm-6">
                        <app-input-text-component
                            [form]="form"
                            [labelRequired]="true"
                            [readonly]="formLoading"
                            label="Email"
                            formControlName="email"
                        ></app-input-text-component>

                        <app-input-currency-component
                            [form]="form"
                            [labelRequired]="true"
                            [readonly]="formLoading"
                            label="Salary"
                            formControlName="basicSalary"
                        ></app-input-currency-component>

                        <app-dropdown-component
                            [form]="form"
                            [labelRequired]="true"
                            [dataDropdown]="group"
                            [readonly]="formLoading"
                            label="Group"
                            formControlName="groupId"
                            bindValue="id"
                            bindLabel="group"
                        ></app-dropdown-component>

                        <app-datepicker-component
                            [form]="form"
                            [labelRequired]="true"
                            [readonly]="formLoading"
                            [maxDate]="maxDate"
                            label="Description"
                            formControlName="description"
                        ></app-datepicker-component>
                    </div>
                </div>
            </app-form-component>
        </app-card-component>
    `,
})
export class AppUserFormComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();

    id?: string | null;
    form: FormGroup;
    group?: any[];

    formLoading: boolean = false;
    maxDate = new Date();

    constructor(
        public location: Location,
        private router: Router,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private apiServices: ApiServices,
        private toasterService: ToastrService,
    ) {
        this.form = this.formBuilder.group(new User());
    }

    ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');

        this.apiServices.findAllService(managementApiService.group)
            .subscribe((response: any) => {
                this.group = response;
            });

        if (this.id) {
            this.formLoading = true;

            this.apiServices.findByIdService(managementApiService.user, this.id)
                .pipe(
                    takeUntil(this.ngUnsubscribe),
                    finalize(() => (this.formLoading = false))
                )
                .subscribe((response: UserInterface) => {
                    this.form.patchValue(response);
                });
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

    async onCancel() {
        await this.location.back();
    }

    onSubmit(value: any) {
        this.formLoading = true;

        if (this.id) {
            this.apiServices.updateOneService(managementApiService.user, this.id, value)
                .pipe(
                    takeUntil(this.ngUnsubscribe),
                    finalize(() => (this.formLoading = false))
                )
                .subscribe(async () => {
                    this.toasterService.warning('Data Updated', 'Error');

                    await this.location.back();
                });
        } else {
            this.apiServices.createOneService(managementApiService.user, value)
                .pipe(
                    takeUntil(this.ngUnsubscribe),
                    finalize(() => (this.formLoading = false))
                )
                .subscribe(async () => {
                    this.toasterService.success('Data Created', 'Error');

                    await this.location.back();
                });
        }
    }
}
