import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SharedBaseModule } from '../../shared';

@Component({
    standalone: true,
    selector: 'app-card-component',
    inputs: [
        'headerDisabled',
        'canCreateNew',
        'createNewDisabled',
    ],
    outputs: [ 'onCreateNew' ],
    imports: [ SharedBaseModule ],
    template: `
        <div class="card mb-4">
            <div class="card-header card-header-container">
                <div class="card-header-title">
                    {{ headerTitle }}
                </div>

                <div class="card-header-options">
                    <div class="card-header-option-button" style="margin: auto 0;">
                        <button
                            *ngIf="canCreateNew"
                            (click)="onCreateNew.emit()"
                            [disabled]="createNewDisabled ? createNewDisabled : false"
                            type="button"
                            class="btn btn-primary"
                        >
                            Create New
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <ng-content></ng-content>
            </div>
        </div>
    `
})
export class AppCardComponent {
    @Input() headerTitle?: string;
    @Input() canCreateNew?: boolean = false;
    @Input() createNewDisabled?: boolean;

    @Output() onCreateNew = new EventEmitter<any>(true);
}
