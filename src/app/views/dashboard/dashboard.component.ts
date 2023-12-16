import { Component } from '@angular/core';
import { SharedBaseModule, SharedFormModule } from '../../shared';

@Component({
    standalone: true,
    imports: [ SharedBaseModule, SharedFormModule, ],
    template: `
        <div>
            Hi Admin,

        </div>
    `,
})
export class AppDashboardComponent {
}
