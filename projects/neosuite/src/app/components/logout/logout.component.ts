import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

@Component( {
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css']
} )
export class LogoutComponent implements OnInit {
    idpUrl: any;
    screenWidth: any;

    constructor( route: ActivatedRoute, private router: Router ) {



        // 2
        // 3

    }

    ngOnInit() {

        // this.idpUrl = localStorage.getItem( "myidp" );
         this.screenWidth = window.innerWidth;
        
        // if ( this.idpUrl == null || this.idpUrl === "" )
        //     this.router.navigate( ['/login'] );
   
    }

    @HostListener( 'window:resize', ['$event'] )
    onResize( event ) {
        this.screenWidth = window.innerWidth;
    }
}
