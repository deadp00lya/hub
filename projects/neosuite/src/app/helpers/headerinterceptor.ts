import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from "rxjs";
import { AdminAuthService } from "../superadmin/services/admin-auth.service";
import { Router } from "@angular/router";
import { ToastService } from "@nw-workspace/common-services";
import * as M from "materialize-css/dist/js/materialize";
import { finalize } from 'rxjs/operators';
@Injectable()
export class ClientHeaderInterceptor implements HttpInterceptor {
    flag = 0;

    selectClient: String[] = ["/superadmin/widgetSubscription", "/superadmin/businessUnit", "/superadmin/department", "/superadmin/widgetMapping",
        "/superadmin/userRoleMapping", "/superadmin/passwordCreation", "/superadmin/passwordConfig", "/superadmin/widgetLog", "/superadmin/user", "/superadmin/restrictIp", "/superadmin/theme","/superadmin/consent"];

    constructor( private authService: AdminAuthService, private route: Router, private toastService: ToastService ) { }
    intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
        this.authService.pageLoad.next( true );
        var foundroute = this.selectClient.find( r => r === this.route.url )

        if ( foundroute != null ) {

            if ( this.authService.selectedClient && this.authService.selectedClient.schemaName ) {
                request = request.clone( {
                    setHeaders: {
                        'X-CLIENT-ID': this.authService.selectedClient.schemaName
                    }
                } );

            }
            else {
                if ( request.url == "api/gadmin/getClients" || request.url == "api/logout" ) {
                    return next.handle( request ).
                    pipe(  finalize(() => {  this.authService.pageLoad.next( false )}));
                }

                if ( this.flag == 0 ) {
                    this.toastService.error( "Please Select Client" );
                    this.route.navigate( ["/superadmin/dashboard"] )
                    this.flag = 1
                }
                this.authService.pageLoad.next( false );
                return of( null );

            }
        }
        this.flag = 0
        return next.handle( request ).pipe(  finalize(() => {  this.authService.pageLoad.next( false )}));
    }
}