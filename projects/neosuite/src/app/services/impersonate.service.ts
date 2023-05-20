import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable( {
    providedIn: 'root'
} )
export class ImpersonateService {

    constructor( private http: HttpClient ) { }

    private static buildImpersonateRequestBody( userId: string, keycloakClientId: string, currentUserAccessToken: string ): URLSearchParams {
        const body = new URLSearchParams();

        body.set( 'grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange' );
        body.set( 'subject_token', currentUserAccessToken );//localstorage
        body.set( 'client_id', keycloakClientId );//neosuite-client
        body.set( 'requested_subject', userId );

        return body;
    }

    private static getOptions() {
        return {
            headers: new HttpHeaders().append( 'Content-Type', 'application/x-www-form-urlencoded' ),
            withCredentials: true
        };
    }


    public impersonate( userId: string, keycloakClientId: string, currentUserAccessToken: string ): Observable<any> {
        const body = new URLSearchParams();

        body.set( 'grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange' );
        body.set( 'subject_token',  currentUserAccessToken );//localstorage
        body.set( 'client_id', keycloakClientId );//neosuite-client
        body.set( 'requested_subject', userId );

        let realm = localStorage.getItem( "tenantID" );
       
        let url = environment.issuerHost+'/admin/realms/' + realm + '/users/' + userId + '/impersonation';
        
        return this.http.post( url, body.toString(), ImpersonateService.getOptions() )
            .pipe(
            tap( response => {
               
                // start using new token
                console.log( response['access_token'] );
                console.log( response['refresh_token'] );
            } )
            );

    }
}
