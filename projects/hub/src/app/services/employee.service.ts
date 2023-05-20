
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from "@angular/common";
import { map, catchError } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root'
} )

export class EmployeeService {
private observableCache: { [key: string]: Observable<any> } = {};
    private empCache: { [key: string]: any } = {};
    constructor( private http: HttpClient ) { }
    h: Date;
    
    convertTime12to24( dateTime ) {

        if ( dateTime != undefined ) {
            var isoDate = new Date( dateTime ).toISOString();

            var date12h = formatDate( dateTime, 'yyyy-MM-dd', 'en-US', '+0000' )
            var time12h = formatDate( dateTime, 'hh:mm:ss a', 'en-US', '+0000' )

            const [time, modifier] = time12h.split( ' ' );
            var [hours, minutes, seconds] = time.split( ':' );
            if ( hours === '12' ) {
                hours = '00';
            }
            if ( modifier === 'PM' ) {
                hours = ( parseInt( hours, 10 ) + 12 ).toString();
            }
            return date12h + ' ' + hours + ':' + minutes + ':' + seconds;
        }
    }

    convertOnlyDate( dateTime ) {

        if ( dateTime != undefined ) {
            var isoDate =  dateTime ;
debugger
            var date12h = formatDate( dateTime, 'yyyy-MM-dd', 'en-US' )
            var time12h = formatDate( dateTime, 'hh:mm:ss a', 'en-US', '+0000' )

            const [time, modifier] = time12h.split( ' ' );
            var [hours, minutes, seconds] = time.split( ':' );
            if ( hours === '12' ) {
                hours = '00';
            }
            if ( modifier === 'PM' ) {
                hours = ( parseInt( hours, 10 ) + 12 ).toString();
            }
            return date12h;
        }
    }

    
    
    getUTCDate( dateToChange ) {

        return new Date( dateToChange ).getUTCDate();
    }

    getLocalDate( dateToChange ) {

        return new Date( dateToChange ).getUTCDate();
    }

    getEmployee( employeeId: any ) {
        debugger
        var newEmpIds : string = "";
        for ( var i = 0; i < employeeId.length; i++ ) {
            if ( employeeId[i] != undefined && !this.empCache[employeeId[i]] ) {
                newEmpIds = newEmpIds + employeeId[i] + ",";
            }
        }
        // Data available
        if ( newEmpIds.length == 0 ) return of( this.empCache );
        //        // Request pending
        else if ( this.observableCache["data"] ) return this.observableCache["data"];
        // New request needed
        else this.observableCache["data"] = this.fetchEmployee( newEmpIds );

        return this.observableCache["data"];
    }

    private fetchEmployee( employeeId: string ) {
        debugger
        let clientCode = localStorage.getItem('tenantID');
        //fetchEmployeesByEmployeeId
        const url = String( 'hub/tenants/' + clientCode + '/employee-ids' );

        return this.http.get<any>( url + "?employees=" + employeeId ).pipe(
            map( rawData => this.mapCachedClub( rawData ), catchError( EmployeeService.handleError ) )
        );
        
    }

    private mapCachedClub( body: any ) {
        Object.keys( body.payload ).forEach( key => {
            this.observableCache["data"] = null;
            this.empCache[key] = body.payload[key];
        } )
        return this.empCache;
    }

    // ERRORS handling
    /**
     * Internal-static member, used to handle error incomming from data-call.
     * @param     - error returned from http call
     * @returns   - event stream error
     */
    static handleError( error: any ) {
        const _errMsg = ( error.message ) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error( _errMsg );
        return Observable.throw( _errMsg );
    }


}
