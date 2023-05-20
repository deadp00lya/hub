import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';
import { AppsAuthGuard } from './apps-auth.guard';
import { AdvancedAppComponent } from './components/advanced-app/advanced-app.component';
import { DynamicComponentManifest } from './services/dynamic-component-manifest';
const CDN = 'http://localhost:1995';
const RE = 'remoteEntry.js?ngsw-bypass=true';

export const manifests: DynamicComponentManifest[] = [
  /*************************************** START : Neosuite  ************************************************/
  createManifest('post/NsocialComponent', getCDN('post'), 'post', 'HomeModule'),
  // /*************************************** END : Neosuite  ************************************************/
  /*************************************** START : Hub  ************************************************/
  createManifest(
    'hub/preferences',
    getCDN('Hub'),
    'hub',
    'HubPrefrencesModule'
  ),
  createManifest(
    'hub/list/employee',
    getCDN('Hub'),
    'hub',
    'ViewEmployeeListModule'
  ),
  createManifest(
    'hub/requests',
    getCDN('Hub'),
    'hub',
    'HubApprovalListModule'
  ),
  createManifest(
    'hub/employee-profile',
    getCDN('Hub'),
    'hub',
    'EmployeeProfileModule'
  ),
  createManifest(
    'hub/group',
    getCDN('Hub'),
    'hub',
    'HubGroupModule'
  ),
  createManifest(
    'hub/client-creation',
    getCDN('Hub'),
    'hub',
    'ClientcreationModule'
  ),
  createManifest(
    'hub/api',
    getCDN('Hub'),
    'hub',
    'ApiregitsrationModule'
  ),
  createManifest(
    'hub/host',
    getCDN('Hub'),
    'hub',
    'HostUrlModule'
  ),
  createManifest(
    'hub/create',
    getCDN('Hub'),
    'hub',
    'CreateEmployeeModule'
  ),
  createManifest(
    'hub/list',
    getCDN('Hub'),
    'hub',
    'ListTemplateModule'
  ),
  createManifest(
    'hub/create',
    getCDN('Hub'),
    'hub',
    'CreateTemplateModule'
  ),
  createManifest(
    'hub/widget-component',
    getCDN('Hub'),
    'hub',
    'WidgetComponentModule'
  ),
  createManifest(
    'hub/audit',
    getCDN('Hub'),
    'hub',
    'HubAuditModule'
  ),
  createManifest(
    'hub/EventLogConfigurationComponent',
    getCDN('Hub'),
    'hub',
    'EventLogConfigurationModule'
  ),
  createManifest(
    'cmas/client-creation',
    getCDN('Hub'),
    'hub',
    'ClientBuCreationModule'
  ),
  createManifest(
    'hub/effective-dated-view',
    getCDN('Hub'),
    'hub',
    'EmployeeEffectiveListModule'
  ),
  createManifest(
    'hub/bulk-manager',
    getCDN('Hub'),
    'hub',
    'BulkManagerModule'
  ),
  createManifest(
    'hub/preference',
    getCDN('Hub'),
    'hub',
    'OrgPreferencesModule'
  ),
  createManifest(
    'hub/org-structure',
    getCDN('Hub'),
    'hub',
    'OrganizationStructureModule'
  ),
  createManifest(
    'hub/compensation',
    getCDN('Hub'),
    'hub',
    'CompensationFormModule'
  ),
  createManifest(
    'hub/filter',
    getCDN('Hub'),
    'hub',
    'AdvanceFilterListModule'
  ),
  createManifest('hub/series', getCDN('Hub'), 'hub', 'SeriesModule'),
  createManifest(
    'hub/update-template',
    getCDN('Hub'),
    'hub',
    'UpdateTemplateModule'
  ),
  /*************************************** END : Hub  ************************************************/
  /*************************************** START : Neoforms  ************************************************/
  createManifest(
    'neoforms/configurations',
    getCDN('neoforms'),
    'neoforms',
    'ConfigurationPageModule'
  ),
  /*************************************** END : Neoforms  ************************************************/


];

export function createManifest(
  componentName: string,
  remoteEntry: string,
  remoteName: string,
  exposedModule: string
): DynamicComponentManifest {
  return {
    componentName,
    remoteEntry,
    remoteName,
    exposedModule,
  };
}

function getCDN(appNme: String) {
  return `${CDN}/${RE}`;
}
export const remoteRoutes: Routes = manifests.map((item) => {
  return {
    path: `${item.componentName.toLowerCase()}`,
    component: AdvancedAppComponent,
    loadChildren: () =>
      loadRemoteModule((({ componentName, ...o }) => o)(item)).then(
        (m) => m[item.exposedModule]
      ),
    canActivateChild: [AppsAuthGuard],
  };
});
