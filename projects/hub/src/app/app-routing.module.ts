import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'HubPrefrencesComponent', loadChildren: () => import('./widgets/hub-configuration/hub-prefrences/hub-prefrences.module').then(m => m.HubPrefrencesModule)
  },
  {
    path: 'ViewEmployeeListComponent', loadChildren: () => import('./widgets/hub-user/view-employee-list/view-employee-list.module').then(m => m.ViewEmployeeListModule)
  },
  {
    path: 'HubApprovalListComponent', loadChildren: () => import('./widgets/hub-user/approval/hub-approval-list/hub-approval-list.module').then(m => m.HubApprovalListModule)
  },
  {
    path: 'EmployeeProfileComponent', loadChildren: () => import('./widgets/hub-user/employee-profile/employee-profile.module').then(m => m.EmployeeProfileModule)
  },
  {
    path: 'HubGroupComponent', loadChildren: () => import('./widgets/hub-user/approval/hub-group/hub-group.module').then(m => m.HubGroupModule)
  },

  {
    path: 'ClientcreationComponent', loadChildren: () => import('./widgets/admin/client-creation/clientcreation/clientcreation.module').then(m => m.ClientcreationModule)

  },
  {
    path: 'ApiregitsrationComponent', loadChildren: () => import('./widgets/hub-configuration/apiregitsration/apiregitsration.module').then(m => m.ApiregitsrationModule)

  },
  {
    path: 'HostUrlComponent', loadChildren: () => import('./widgets/admin/host-url/host-url.module').then(m => m.HostUrlModule)
  }
  ,
  {
    path: 'CreateEmployeeComponent', loadChildren: () => import('./widgets/hub-user/create-employee/create-employee.module').then(m => m.CreateEmployeeModule)
  }
  ,
  {
    path: 'ListTemplateComponent', loadChildren: () => import('./widgets/hub-user/list-template/list-template.module').then(m => m.ListTemplateModule)
  },
  {
    path: 'HubCreateTemplateComponent', loadChildren: () => import('./widgets/hub-user/create-template/create-template.module').then(m => m.CreateTemplateModule)
  },
  {
    path: 'WidgetComponentComponent', loadChildren: () => import('./widgets/admin/widget-component/widget-component.module').then(m => m.WidgetComponentModule)
  },
  {
    path: 'HubAuditComponent', loadChildren: () => import('./widgets/hub-configuration/hub-audit/hub-audit.module').then(m => m.HubAuditModule)
  },
  {
    path: 'EventLogConfigurationComponent', loadChildren: () => import('./widgets/hub-configuration/event-log-configuration/event-log-configuration.module').then(m => m.EventLogConfigurationModule)
  },
  {
    path: 'ClientBuCreationComponent', loadChildren: () => import('./widgets/hub-root/client-bu-creation/client-bu-creation.module').then(m => m.ClientBuCreationModule)
  }
  ,
  {
    path: 'EmployeeEffectiveListComponent', loadChildren: () => import('./widgets/hub-user/employee-effective-list/employee-effective-list.module').then(m => m.EmployeeEffectiveListModule)
  }
  ,
  {
    path: 'BulkManagerComponent', loadChildren: () => import('./widgets/hub-configuration/bulk-manager/bulk-manager.module').then(m => m.BulkManagerModule)
  },
  {
    path: 'OrgPreferencesComponent', loadChildren: () => import('./widgets/hub-configuration/org-preferences/org-preferences.module').then(m => m.OrgPreferencesModule)
  },
  {
    path: 'OrganizationStructureComponent', loadChildren: () => import('./widgets/hub-user/organization-structure/organization-structure.module').then(m => m.OrganizationStructureModule)
  },
  {
    path: 'CompensationFormComponent', loadChildren: () => import('./widgets/hub-root/compensation-form/compensation-form.module').then(m => m.CompensationFormModule)
  }
  ,
  {
    path: 'AdvanceFilterListComponent', loadChildren: () => import('./widgets/hub-user/advance-filter-list/advance-filter-list.module').then(m => m.AdvanceFilterListModule)
  } ,
  {
    path: 'SeriesComponent', loadChildren: () => import('./widgets/hub-configuration/id-generation/series/series.module').then(m => m.SeriesModule)
  },
  {
    path: 'UpdateTemplateComponent', loadChildren: () => import('./widgets/hub-user/update-template/update-template.module').then(m => m.UpdateTemplateModule)
  }
  ,

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
