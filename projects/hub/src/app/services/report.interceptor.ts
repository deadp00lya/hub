import { Injectable } from '@angular/core';

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()

export class ReportInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       
        if (req.url.startsWith("https://digiviewliteprod.s3") ||
        req.url.startsWith("https://digiviewlitepreprod.s3") ||
        req.url.startsWith("https://buzzeruat.s3") ||
        req.url.startsWith("https://digiviewlitedemo.s3") ||
        req.url.startsWith("https://digiviewlitebugfix.s3")) {
        let url = new HttpRequest(req.method, req.url, { responseType: req.responseType })
        return next.handle(url);
    }
    
        let clientCode = localStorage.getItem('tenantID');
        if (!req.url.includes("listViewApi") && !req.url.includes("neoforms") && !req.url.includes("neosuite/api") && !req.url.includes("convoAI/api")) {

            let urlWithtenet: any;
            let changeRequest: any = {};

            urlWithtenet = "hub/tenants/" + clientCode + "/" + req.url;

            changeRequest.url = urlWithtenet;
            req = req.clone(changeRequest);

            /* if (clientCode != null) {
                let params = new HttpParams();
                params = params.append('clientCode', clientCode);

                req = req.clone({
                    setParams: {
                        clientCode: clientCode
                    }
                });
                return next.handle(req);
            } */
        } 
        return next.handle(req);
    }
}
