import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubGroupComponent } from './hub-group.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { Ng2CompleterModule } from "ng2-completer";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgSelectModule } from '@ng-select/ng-select';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { SearchPipe } from 'projects/hub/src/app/services/search.pipe';
import { LoaderModule } from 'projects/hub/src/app/templates/loader/loader.module';
import { NeoConfigViewModule } from '../../../hub-configuration/neo-config-view/neo-config-view.module';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from 'projects/hub/src/app/services/report.interceptor';

const routes: Routes = [
  {
    path: '', component: HubGroupComponent
  }

];
@NgModule({
  declarations: [HubGroupComponent, SearchPipe],
  bootstrap: [HubGroupComponent, SearchPipe],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    LoaderModule,
    Ng2CompleterModule,
    Ng2SearchPipeModule,
    UniversalListViewModule,
    NgSelectModule,
    NeoConfigViewModule,
    RouterModule.forChild(routes)
  ],
  exports: [HubGroupComponent, RouterModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}

  ]
})

export class HubGroupModule { }
