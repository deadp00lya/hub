import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PexRoleComponent } from './hub-role.component';
import { FormsModule } from "@angular/forms";
import { Ng2CompleterModule } from "ng2-completer";
import { NgSelectModule } from '@ng-select/ng-select';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { HubApprovalSpocConfigModule } from '../../hub-user/approval/hub-approval-spoc-config/hub-approval-spoc-config.module';
import { NeoConfigViewModule } from '../neo-config-view/neo-config-view.module';

@NgModule({
    declarations: [PexRoleComponent],
    imports: [
        CommonModule,
        FormsModule,
        UniversalListViewModule,
        Ng2CompleterModule,
        HubApprovalSpocConfigModule,
        NgSelectModule,
        NeoConfigViewModule
    ],
    exports: [PexRoleComponent]
})

export class PexRoleModule { }
