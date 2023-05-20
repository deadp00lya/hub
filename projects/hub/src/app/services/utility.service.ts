import { Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )

export class UtilityService {

    constructor() { }

    public isNullOrEmptyOrUndefined( obj ) {

        if ( obj == "" || obj == null || obj == undefined || JSON.stringify( obj ) === JSON.stringify( {} ) )
            return true;
        else
            return false;
    }

    public isNotNullOrEmptyOrUndefined( obj ) {
        if ( obj == "" || obj == null || obj == undefined )
            return false;
        else
            return true;
    }


    public isNullOrUndefined( obj ) {
        if ( obj == null || obj == undefined )
            return true;
        else
            return false;
    }


    public isNotNullOrUndefined( obj ) {
        if ( obj == null || obj == undefined )
            return false;
        else
            return true;
    }
    
    public isNotNullOrEmptyOrUndefined2( obj ) {
        if ( obj == "" || obj == null || obj == undefined || JSON.stringify( obj ) === JSON.stringify( {} ))
            return false;
        else
            return true;
    }
}

export function getProperty( value: { [key: string]: any }, key: string ): any {

    if ( new UtilityService().isNullOrUndefined( value ) ) {
        return undefined;
    }

    const keys: string[] = key.split( '.' );
    let result: any = value[keys.shift()!];

    for ( const key of keys ) {
        if ( new UtilityService().isNullOrUndefined( result ) ) {
            return undefined;
        }

        result = result[key];
    }

    return result;
}
