import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from '@ng-select/ng-select';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { HubApprovalSpocConfigModule } from '../../hub-user/approval/hub-approval-spoc-config/hub-approval-spoc-config.module';
import { OrgRoleConfigComponent } from './org-role-config.component';

@NgModule({
    declarations: [OrgRoleConfigComponent],
    bootstrap: [OrgRoleConfigComponent],
    imports: [
        CommonModule,
        FormsModule,
        UniversalListViewModule,
        NgSelectModule,
        HubApprovalSpocConfigModule
    ],
    exports: [OrgRoleConfigComponent]
})
export class OrgRoleConfigModule { }
