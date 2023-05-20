import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ActionLogComponent } from "./action-log.component";
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { NeoConfigViewModule } from '../neo-config-view/neo-config-view.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UniversalListViewModule,
        NeoConfigViewModule
    ],
    exports: [ActionLogComponent],
    declarations: [ActionLogComponent]
})
export class ActionLogModule { }
