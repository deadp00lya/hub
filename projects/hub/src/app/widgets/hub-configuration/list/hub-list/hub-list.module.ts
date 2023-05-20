import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubListComponent } from './hub-list.component';
import { FormsModule } from "@angular/forms";
import { Ng2CompleterModule } from "ng2-completer";
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { NeoConfigViewModule } from '../../neo-config-view/neo-config-view.module';

@NgModule({
    declarations: [HubListComponent],
    imports: [
        CommonModule,
        FormsModule,
        UniversalListViewModule,
        Ng2CompleterModule,
        NeoConfigViewModule
    ],
    exports: [HubListComponent]
})

export class HubListModule { }
