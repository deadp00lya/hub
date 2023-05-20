import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

declare var $: any;

@Component( {
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
} )
export class SettingsComponent implements OnInit {

    generalFlag: boolean = true;
    proxyUserName: string;

    /*@ViewChild( 'settingsComponent', { read: ViewContainerRef } )
    settingsComponent: ViewContainerRef;*/

    constructor( ) { }

    ngOnInit() {
        this.openGeneralContent();
    }

    openGeneralContent() {
        
        this.generalFlag = true;
        setTimeout( function() {
            $( 'select' ).formSelect();
            $( '#outlookModal' ).modal( { 'dismissible': false } );
        }, 10 );
       /* $( "#generalContent" ).css({"color" : "#ffffff"} );*/

        /*$( "#proxyContent" ).css({ "background-color":"rgba(255, 255, 255, 0)","color" : "black" });*/
    }

    /*openProxyContent() {
        
        this.generalFlag = false;
        setTimeout( function() {
            $( 'select' ).formSelect();
        }, 10 );
        $( "#generalContent" ).css({ "background-color": "rgba(255, 255, 255, 0)","color" : "black" });
        $( "#proxyContent" ).css({ "background-color": "#007EE5","color" : "#ffffff" });
    }*/

}
