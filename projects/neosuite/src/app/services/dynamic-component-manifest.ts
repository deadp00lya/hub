import { InjectionToken, NgModuleFactory, Type } from '@angular/core';
export const DYNAMIC_COMPONENT_MANIFESTS = new InjectionToken<any>('DYNAMIC_COMPONENT_MANIFESTS');
export interface DynamicComponentManifest {

    /** Unique identifier, used in the application to retrieve a ComponentFactory. */
    componentName: string,
    remoteEntry: string,
    remoteName: string,
    exposedModule:string

    /** Path to component module. */
  //  loadChildren: () => Promise<NgModuleFactory<any> | Type<any>>;
}
