import { Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class CurrentBrowserService {

    isIe: boolean = false;
    isEdge: boolean = false;
    isChrome: boolean = false;
    homeOnloadFlag: boolean = false;
    isSafari: boolean = false;

    constructor() { }
}
