import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyMaskModule, CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';

import { SharedBaseModule, SharedFormModule } from '../../shared';

import { isFieldInvalid } from '../../utils';

const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: 'right',
    allowNegative: true,
    decimal: ',',
    precision: 2,
    prefix: 'Rp ',
    suffix: '',
    thousands: '.'
};

@Component({
    standalone: true,
    selector: 'app-input-currency-component',
    inputs: [
        'form',
        'formControlName',
        'label',
        'labelRequired',
        'labelDisabled',
        'hasCustomGroup',
        'customPlaceholder',
        'smallText',
        'readonly',
        'customFieldValidation'
    ],
    outputs: [ 'onChangeData' ],
    imports: [ SharedBaseModule, SharedFormModule, CurrencyMaskModule ],
    providers: [
        {
            provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig,
        },
    ],
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
                    [formControlName]="formControlName"
                    [placeholder]="customPlaceholder ? customPlaceholder : label"
                    [readOnly]="readonly ? readonly : false"
                    [class.is-invalid]="customFieldValidation ? customFieldValidation(form, formControlName) : isFieldInvalid(form, formControlName)"
                    class="form-control"
                    currencyMask
            />
            <ng-container
                    *ngIf="customFieldValidation ? customFieldValidation(form, formControlName) : isFieldInvalid(form, formControlName)"
            >
                <div *ngIf="form.get(formControlName)?.hasError('required')" class="invalid-feedback">
                    {{ label }} is required
                </div>
            </ng-container>
        </div>
    `
})
export class AppInputCurrencyComponent implements OnInit, OnDestroy {
    @Input() form!: FormGroup;
    @Input() formControlName!: string;
    @Input() label?: string;
    @Input() labelRequired?: boolean = false;
    @Input() labelDisabled?: boolean = false;
    @Input() hasCustomGroup?: boolean = false;
    @Input() customPlaceholder?: string;
    @Input() smallText?: string;
    @Input() readonly ?: boolean;
    @Input() customFieldValidation?: Function;

    @Output() onChangeData = new EventEmitter<any>(true);

    private ngUnsubscribe = new Subject();

    isFieldInvalid = isFieldInvalid;

    ngOnInit() {
        this.onValueChanges();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

    onValueChanges() {
        this.form.get(this.formControlName)?.valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((value) => {
                if (!value) {
                    this.form.get(this.formControlName)?.setValue(0, { emitEvent: false });
                }

                this.onChangeData.emit(value);
            });
    }
}
