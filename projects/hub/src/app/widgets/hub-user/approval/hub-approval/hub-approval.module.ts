import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubApprovalComponent } from './hub-approval.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { Ng2CompleterModule } from "ng2-completer";

@NgModule({
    declarations: [HubApprovalComponent],
    bootstrap: [HubApprovalComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        HttpClientModule,
        TranslateModule,
        Ng2CompleterModule
    ],
    exports: [HubApprovalComponent]
})

export class HubApprovalModule { }
