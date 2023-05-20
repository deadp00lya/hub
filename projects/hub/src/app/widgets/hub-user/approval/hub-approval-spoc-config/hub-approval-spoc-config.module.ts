import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Ng2CompleterModule } from "ng2-completer";
import { LoaderModule } from 'projects/hub/src/app/templates/loader/loader.module';
import { HubApprovalSpocConfigComponent } from './hub-approval-spoc-config.component';
import {  HttpClientModule } from "@angular/common/http";
import { NeoConfigViewModule } from '../../../hub-configuration/neo-config-view/neo-config-view.module';

@NgModule({
    declarations: [HubApprovalSpocConfigComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        Ng2CompleterModule,
        LoaderModule,
        NeoConfigViewModule
    ],
    exports: [HubApprovalSpocConfigComponent],
})

export class HubApprovalSpocConfigModule { }
