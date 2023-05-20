import { Injectable } from '@angular/core';
import { ToastService } from "src/app/services/toast.service";

@Injectable( {
    providedIn: 'root'
} )
export class AttachmentServiceService {

    constructor( private toastService: ToastService ) { }


    validateAttachments( file ) {
        var fileExtension = file.name.substring( file.name.lastIndexOf( "." ) + 1, file.name.length ).toLowerCase();
        var allowedExtensions = ['txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'rtf', 'png', 'gif', 'jpeg', 'bmp', 'jpg', 'ico', 'zip', 'mp3', 'pptx'];
        if ( ( ( file.size / 1024 ) / 1024 ) < 10 ) {
            for ( var i = 0; i < allowedExtensions.length; i++ ) {
                if ( fileExtension == allowedExtensions[i] ) { return true; }
                if ( i == allowedExtensions.length - 1 ) {
                    this.toastService.error( "Invalid File : " + file.name );
                    return false;
                }
            }
        }
        else {
            this.toastService.error( "File size should not be greater than 10 MB" );
            return false;
        }
    }
}
