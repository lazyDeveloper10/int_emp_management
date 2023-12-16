import { Component, Input } from '@angular/core';
import { FormGroup, } from '@angular/forms';

import { SharedBaseModule, SharedFormModule } from '../../shared';

import { isFieldInvalid } from '../../utils';

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
    imports: [ SharedBaseModule, SharedFormModule ],
    template: `
        <div [formGroup]="form" class="mb-3">
            <label
                    *ngIf="!labelDisabled"
                    [class.required]="labelRequired"
                    style="margin-bottom: 5px"
            >
                {{ label ? label : 'Please input label'  }}
            </label>
            <input
                    [class.is-invalid]="customFieldValidation ? customFieldValidation(form, formControlName) : isFieldInvalid(form, formControlName)"
                    [ngClass]="(labelRequired ? 'required' : '!required')"
                    [formControlName]="formControlName"
                    [maxlength]="maxLength ? maxLength : null"
                    [minlength]="minLength ? minLength : null"
                    [type]="inputType ? inputType : null"
                    [placeholder]="customPlaceholder ? customPlaceholder : label"
                    [readOnly]="readonly"
                    class="form-control"
            >
            <ng-container
                    *ngIf="customFieldValidation ? customFieldValidation(form, formControlName) : isFieldInvalid(form, formControlName)"
            >
                <!-- validators required -->
                <div *ngIf="form.get(formControlName)?.hasError('required')" class="invalid-feedback">
                    {{ label }} is required
                </div>

                <!-- validators min length -->
                <div *ngIf="form.get(formControlName)?.hasError('minlength')" class="invalid-feedback">
                    {{ label }} minimal length is {{ minLength }}
                </div>

                <!-- validators max length -->
                <div *ngIf="form.get(formControlName)?.hasError('maxlength')" class="invalid-feedback">
                    {{ label }} maximum length is {{ maxLength }}
                </div>

                <!-- validators pattern -->
                <div *ngIf="form.get(formControlName)?.hasError('emailFormat')" class="invalid-feedback">
                    {{ label }} has not valid format
                </div>
            </ng-container>
        </div>
    `
})
export class AppInputTextComponent {
    @Input() form!: FormGroup;
    @Input() formControlName!: string;
    @Input() label?: string;
    @Input() labelRequired?: boolean = false;
    @Input() labelDisabled?: boolean = false;
    @Input() customPlaceholder?: string;
    @Input() inputType?: any; // string | number | password
    @Input() minLength?: number;
    @Input() maxLength?: number;
    @Input() readonly ?: boolean;
    @Input() customFieldValidation?: Function;

    isFieldInvalid = isFieldInvalid;
}
