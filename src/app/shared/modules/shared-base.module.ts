import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@NgModule({
    imports: [ CommonModule, NgOptimizedImage ],
    exports: [ CommonModule, NgOptimizedImage ]
})
export class SharedBaseModule {
}
