import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { OnInit } from "@angular/core";

@Directive( {
    selector: '[access]'
} )
export class AccessDirective implements OnInit {
    _arrayValue: any;


    @Input( "access" ) authorizedRoles: string | string[];

    constructor( private el: ElementRef, private renderer: Renderer2, private authService: AuthService ) {



    }
    ngOnInit(): void {
       
        if (typeof this.authorizedRoles == 'string') {
            this._arrayValue = JSON.parse(this.authorizedRoles)
          } else {
            this._arrayValue = this.authorizedRoles
          }
        if ( !this.authService.isAuthorized(this._arrayValue))
            this.renderer.addClass( this.el.nativeElement, 'hide' )
      
           
    }

}
