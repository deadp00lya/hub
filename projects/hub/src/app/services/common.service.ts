import { loadRemoteModule } from "@angular-architects/module-federation";
import { HttpClient } from "@angular/common/http";
import { Compiler, ComponentFactory, Injectable, Injector, NgModuleFactory } from '@angular/core';
import { UtilityService } from '@nw-workspace/common-services';
import { from, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(private http: HttpClient, private utilityService: UtilityService, private compiler: Compiler, private injector: Injector) { }
    
    getComponentFactory(componentName: string): Observable<ComponentFactory<any>> {
        debugger
        const p = loadRemoteModule({
            remoteEntry: 'http://localhost:1995/remoteEntry.js',
            remoteName: 'hub',
            exposedModule: 'CreateTemplateModule'
        }).then(m => m.CreateTemplateModule).then(ngModuleOrNgModuleFactory => {
            debugger

            let moduleFactory;
            if (ngModuleOrNgModuleFactory instanceof NgModuleFactory) {
                moduleFactory = ngModuleOrNgModuleFactory;
            } else {
                moduleFactory = this.compiler.compileModuleSync(ngModuleOrNgModuleFactory);
            }
            const moduleRef = moduleFactory.create(this.injector);
            const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(moduleFactory.moduleType.ɵmod.bootstrap[0]);
            return componentFactory;
        });
        return from(p);
    }

}
