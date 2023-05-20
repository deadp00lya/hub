import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { LoaderModule } from 'projects/hub/src/app/templates/loader/loader.module';
import { ClientcreationComponent } from './clientcreation.component';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from 'projects/hub/src/app/services/report.interceptor';

const routes: Routes = [
  {
    path: '', component: ClientcreationComponent
  }

];
@NgModule({
  declarations: [ClientcreationComponent],
  bootstrap: [ClientcreationComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    LoaderModule,
    UniversalListViewModule,
    RouterModule.forChild(routes)
  ],
  exports: [ClientcreationComponent, RouterModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}
  ]
})

export class ClientcreationModule { }
