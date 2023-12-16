import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SharedBaseModule, SharedFormModule } from '../../shared';

@Component({
    standalone: true,
    selector: 'app-form-component',
    inputs: [
        'form',
        'actionDisabled',
        'actionStandalone',
        'canSubmit',
        'submitLabel',
        'submitDisabled',
        'canCancel',
        'cancelLabel',
        'cancelDisabled'
    ],
    outputs: [
        'onSubmit',
        'onCancel'
    ],
    imports: [ SharedBaseModule, SharedFormModule ],
    template: `
        <form [formGroup]="form" (ngSubmit)="submitForm()">
            <ng-content></ng-content>

            <div
                *ngIf="!actionDisabled"
                [class.form-custom-container]="actionStandalone"
                class="d-grid gap-2 d-sm-flex justify-content-sm-end form-action-container"
            >
                <button
                    *ngIf="canCancel"
                    (click)="onCancel.emit()"
                    [disabled]="cancelDisabled ? cancelDisabled : false"
                    type="button"
                    class="btn btn-dark"
                >
                    {{ cancelLabel ? canCancel : 'Cancel' }}
                </button>

                <button
                    *ngIf="canSubmit"
                    [disabled]="submitDisabled ? submitDisabled : false"
                    type="submit"
                    class="btn btn-primary"
                >
                    {{ submitLabel ? submitLabel : 'Submit' }}
                </button>
            </div>
        </form>
    `
})
export class AppFormComponent {
    @Input() form!: FormGroup;
    @Input() actionDisabled?: boolean = false;
    @Input() actionStandalone?: boolean = false;

    @Input() canSubmit?: boolean = false;
    @Input() submitLabel?: string;
    @Input() submitDisabled?: boolean;

    @Input() canCancel?: boolean = false;
    @Input() cancelLabel?: string;
    @Input() cancelDisabled?: boolean;

    @Output() onSubmit = new EventEmitter<any>(true);
    @Output() onCancel = new EventEmitter<any>(true);

    submitForm() {
        this.form.markAllAsTouched();
        if (!this.form.valid) {
            return;
        }

        this.onSubmit.emit(this.form.value);
    }
}
