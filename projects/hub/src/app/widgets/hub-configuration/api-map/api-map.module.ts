import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { ApiMapComponent } from './api-map.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { NeoConfigViewModule } from '../neo-config-view/neo-config-view.module';

@NgModule({
    declarations: [ApiMapComponent],
    bootstrap: [ApiMapComponent],
    imports: [
        NgSelectModule,
        CommonModule,
        FormsModule,
        UniversalListViewModule,
        NeoConfigViewModule
    ],
    exports: [ApiMapComponent]
})
export class ApiMapModule { }
