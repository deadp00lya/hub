import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root'
} )

export class MdmService {
    private observableCache: { [key: string]: Observable<any> } = {};
    private mdmCache: { [key: string]: any } = {};
    constructor( private http: HttpClient ) { }

    getMDM( fieldCode: string ,searchKey:string) {
        let clientCode = localStorage.getItem('tenantID');
        return this.http.get<any>( "hub/tenents/" + clientCode + "/autoComplete?fieldCode=" + fieldCode + "&searchKey=" + searchKey);
    }
 
    private fetchMDM( fieldCode: string ) {
        let clientCode = localStorage.getItem('tenantID');
        const url = String( "hub/tenants/" + clientCode + "/autoComplete?fieldCode=" + fieldCode );

        return this.http.get<any>( url ).pipe(
            map( rawData => this.mapCachedClub( fieldCode,rawData ), catchError( MdmService.handleError ) )
        );
    }

    private mapCachedClub( fieldCode: string, body: any ) {
        this.observableCache[fieldCode] = null;
        this.mdmCache[fieldCode] = body;
        return this.mdmCache[fieldCode];
    }

    static handleError( error: any ) {
        const _errMsg = ( error.message ) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error( _errMsg );
        return Observable.throw( _errMsg );
    }

}
