import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PexEventComponent } from './hub-event.component';
import { FormsModule } from "@angular/forms";
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { NeoConfigViewModule } from '../../neo-config-view/neo-config-view.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UniversalListViewModule,
        NeoConfigViewModule
    ],
    exports: [PexEventComponent],
    declarations: [PexEventComponent]
})
export class PexEventModule { }
