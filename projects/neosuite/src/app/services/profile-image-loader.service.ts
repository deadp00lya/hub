import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

@Injectable( {
    providedIn: 'root'
} )
export class ProfileImageLoaderService {
    userProfileImg: string;
    constructor( private http: HttpClient ) { }
    downloadProfileImage(): Observable<any> {

        return this.http.get( "neosuite/api/getProfileImage")

    }

//    async   loadsyncimage( employeeId, elementid ) {
//
//        const responseData = await this.downloadProfileImage( employeeId );
//        const blobUrl = URL.createObjectURL( responseData );
//        document.getElementById( elementid ).setAttribute( 'src', blobUrl );
//
//
//    }


}
