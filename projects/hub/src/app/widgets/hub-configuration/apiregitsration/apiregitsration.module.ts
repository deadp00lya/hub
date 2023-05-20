import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ApiregitsrationComponent } from './apiregitsration.component';
import { Ng2CompleterModule } from "ng2-completer";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { LoaderModule } from '../../../templates/loader/loader.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NeoConfigViewModule } from '../neo-config-view/neo-config-view.module';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '', component: ApiregitsrationComponent
    }
  
  ];
@NgModule({
    declarations: [ApiregitsrationComponent],
    bootstrap: [ApiregitsrationComponent],
    imports: [
        CommonModule,
        FormsModule,
        UniversalListViewModule,
        Ng2CompleterModule,
        LoaderModule,
        NgSelectModule,
        NeoConfigViewModule,
        RouterModule.forChild(routes)
    ],
    exports: [ApiregitsrationComponent, RouterModule],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}]

})
export class ApiregitsrationModule { }
