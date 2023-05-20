
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from '@ng-select/ng-select';
import { UniversalListViewModule } from "@nw-workspace/universal-list-view";
import { OrgConfigComponent } from "./org-config.component";

@NgModule({
    declarations: [OrgConfigComponent],
    bootstrap: [OrgConfigComponent],
    exports: [OrgConfigComponent],
    imports: [
        FormsModule,
        NgSelectModule,
        CommonModule,
        UniversalListViewModule
    ],
    providers: [OrgConfigComponent]
})
export class OrgConfigModule { }
