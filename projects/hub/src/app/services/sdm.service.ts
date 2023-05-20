import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root'
} )

export class SdmService {
    widgetDetail: any;
    private observableCache: { [key: string]: Observable<any> } = {};
    private sdmCache: { [key: string]: any } = {};
    constructor( private http: HttpClient ) { }

    getSDM( sdmCodes: any, appCode: string ) {
        var newSdmCodes = [];

        for ( var i = 0; i < sdmCodes.length; i++ ) {
            if ( sdmCodes[i] != undefined && !this.sdmCache[sdmCodes[i]] ) {
                newSdmCodes.push( sdmCodes[i] );
            }
        }
        
        if ( newSdmCodes.length == 0 ) return of( this.sdmCache );
        else if ( this.observableCache["data"] ) return this.observableCache["data"];
        else this.observableCache["data"] = this.fetchSDM( newSdmCodes, appCode );

        return this.observableCache["data"];
    }

    private fetchSDM( sdmCodes: any, appCode: string ) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append( 'App-Code', appCode );
        let options = { headers: headers };

        const url = String( 'employeeMaster/sdmValues' );

        return this.http.post<any>( url, sdmCodes, options ).pipe(
            map( rawData => this.mapCachedClub( rawData ), catchError( SdmService.handleError ) )
        );
        
    }

    private mapCachedClub( body: any ) {
        Object.keys( body.payload ).forEach( key => {
            this.observableCache["data"] = null;
            this.sdmCache[key] = body.payload[key];
        } )
        
        return this.sdmCache;
    }

    static handleError( error: any ) {
        const _errMsg = ( error.message ) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error( _errMsg );
        return Observable.throw( _errMsg );
    }

}
