import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { OrgStructureComponent } from './org-structure.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [OrgStructureComponent],
    bootstrap: [OrgStructureComponent],
    exports: [OrgStructureComponent],
    imports: [
        FormsModule,
        CommonModule,
        NgSelectModule
    ],
    providers: []
})
export class OrgStructureModule { }

