import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { SharedBaseModule, SharedFormModule } from '../../shared';

import { isFieldInvalid } from '../../utils';

@Component({
    standalone: true,
    selector: 'app-dropdown-component',
    inputs: [
        'form',
        'formControlName',
        'label',
        'labelRequired',
        'labelDisabled',
        'customPlaceholder',
        'dataDropdown',
        'bindLabel',
        'bindValue',
        'readonly',
        'customFieldValidation'
    ],
    outputs: [ 'onChangeData' ],
    imports: [ SharedBaseModule, SharedFormModule, NgSelectModule ],
    template: `
        <div [formGroup]="form" class="mb-3">
            <label
                    *ngIf="!labelDisabled"
                    [class.required]="labelRequired"
                    style="margin-bottom: 5px"
            >
                {{ label ? label : 'Please input label'  }}
            </label>
            <ng-select
                    (change)="onChangeData.emit($event)"
                    [items]="dataDropdown"
                    [formControlName]="formControlName"
                    [bindValue]="bindValue"
                    [bindLabel]="bindLabel"
                    [placeholder]="customPlaceholder ? customPlaceholder : label"
                    [readonly]="readonly ? readonly : false"
                    [class.is-invalid]="customFieldValidation ? customFieldValidation(form, formControlName) : isFieldInvalid(form, formControlName)"
            ></ng-select>
            <ng-container
                    *ngIf="customFieldValidation ? customFieldValidation(form, formControlName) : isFieldInvalid(form, formControlName)"
            >
                <!-- validators required -->
                <div *ngIf="form.get(formControlName)?.hasError('required')" class="invalid-feedback">
                    {{ label }} is required
                </div>
            </ng-container>
        </div>
    `
})
export class AppDropdownComponent {
    @Input() form!: FormGroup;
    @Input() formControlName!: string;
    @Input() label?: string;
    @Input() labelRequired?: boolean = false;
    @Input() labelDisabled?: boolean = false;
    @Input() customPlaceholder?: string;
    @Input() dataDropdown?: any[] = [];
    @Input() bindLabel!: string;
    @Input() bindValue!: string;
    @Input() readonly ?: boolean;
    @Input() customFieldValidation?: Function;

    @Output() onChangeData = new EventEmitter<any>(true);

    isFieldInvalid = isFieldInvalid;
}
