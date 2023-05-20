import { Injectable } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  constructor() { }
  
  public error( msg ) {

      M.toast( { html: msg, classes: 'red darken-2 rounded' } );

  }
  public success( msg ) {
      M.toast( { html: msg, classes: 'green lighten-1 rounded' } );

  }

  public warning( msg ) {

      M.toast( { html: msg, classes: 'yellow darken-4 rounded' } );

  }
  
}
