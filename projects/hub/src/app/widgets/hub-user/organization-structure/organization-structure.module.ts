
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorInterceptorService } from "@nw-workspace/common-services";
import { OrganizationStructureComponent } from "./organization-structure.component";
import { OrgStructureModule } from "projects/org-structure-view/src/app/widgets/org-structure/org-structure.module";
import { RouterModule, Routes } from "@angular/router";
import { ReportInterceptor } from "../../../services/report.interceptor";

const routes: Routes = [
    {
      path: '', component: OrganizationStructureComponent
    }
  
  ];
@NgModule({
    declarations: [OrganizationStructureComponent],
    bootstrap: [OrganizationStructureComponent],
    imports: [
        OrgStructureModule,
        FormsModule,
        CommonModule,
        RouterModule.forChild(routes)
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true }
    ],
    exports: [RouterModule]
})
export class OrganizationStructureModule { }
