import { Component, EventEmitter, importProvidersFrom, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { SharedBaseModule, SharedFormModule } from '../../shared';

import { isFieldInvalid } from '../../utils';

@Component({
    standalone: true,
    selector: 'app-datepicker-component',
    inputs: [
        'form',
        'formControlName',
        'label',
        'labelRequired',
        'labelDisabled',
        'customPlaceholder',
        'maxDate',
        'minDate',
        'readonly',
        'customFieldValidation',
    ],
    outputs: [ 'onChangeData' ],
    imports: [ SharedBaseModule, SharedFormModule, BsDatepickerModule ],
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
                [formControlName]="formControlName"
                [maxDate]="maxDate ? maxDate : maximumDate"
                [minDate]="minDate ? minDate : minimumDate"
                [placeholder]="customPlaceholder ? customPlaceholder : label"
                [bsConfig]="{
                    dateInputFormat: 'YYYY-MM-DD',
                    isAnimated: true
                }"
                class="form-control"
                type="text"
                bsDatepicker
            />
            <ng-container
                *ngIf="customFieldValidation ? customFieldValidation(form, formControlName) : isFieldInvalid(form, formControlName)">
                <!-- validators required -->
                <div *ngIf="form.get(formControlName)?.hasError('required')" class="invalid-feedback">
                    {{ label }} is required
                </div>
            </ng-container>
        </div>
    `
})
export class AppDatepickerComponent implements OnChanges {
    @Input() form!: FormGroup;
    @Input() formControlName!: string;
    @Input() label?: string;
    @Input() labelRequired?: boolean = false;
    @Input() labelDisabled?: boolean = false;
    @Input() customPlaceholder?: string;
    @Input() maxDate?: Date;
    @Input() minDate?: Date;
    @Input() readonly?: boolean;
    @Input() customFieldValidation?: Function;

    @Output() onChangeData = new EventEmitter<any>(true);

    maximumDate = new Date('9999-12-31');
    minimumDate = new Date(1960, 0, 0);
    isFieldInvalid = isFieldInvalid;

    ngOnChanges(changes: SimpleChanges) {
        this.readonly
            ? this.form.get(this.formControlName)?.disable()
            : this.form.get(this.formControlName)?.enable();
    }
}
