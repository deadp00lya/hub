const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  [ /* mapped paths to share */ ]);

module.exports = {
  output: {
    uniqueName: "hub",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  plugins: [
    new ModuleFederationPlugin({

      // For remotes (please adjust)
      name: "hub",
      filename: "remoteEntry.js",
      exposes: {
        'HubPrefrencesModule': './projects/hub/src/app/widgets/hub-configuration/hub-prefrences/hub-prefrences.module',
        'ViewEmployeeListModule': './projects/hub/src/app/widgets/hub-user/view-employee-list/view-employee-list.module',
        'HubApprovalListModule': './projects/hub/src/app/widgets/hub-user/approval/hub-approval-list/hub-approval-list.module',
        'EmployeeProfileModule': './projects/hub/src/app/widgets/hub-user/employee-profile/employee-profile.module',
        'HubGroupModule': './projects/hub/src/app/widgets/hub-user/approval/hub-group/hub-group.module',
        'ClientcreationModule': './projects/hub/src/app/widgets/admin/client-creation/clientcreation/clientcreation.module',
        'ApiregitsrationModule': './projects/hub/src/app/widgets/hub-configuration/apiregitsration/apiregitsration.module',
        'HostUrlModule': './projects/hub/src/app/widgets/admin/host-url/host-url.module',
        'CreateEmployeeModule': './projects/hub/src/app/widgets/hub-user/create-employee/create-employee.module',
        'ListTemplateModule': './projects/hub/src/app/widgets/hub-user/list-template/list-template.module',
        'CreateTemplateModule': './projects/hub/src/app/widgets/hub-user/create-template/create-template.module',
        'WidgetComponentModule': './projects/hub/src/app/widgets/admin/widget-component/widget-component.module',
        'HubAuditModule': './projects/hub/src/app/widgets/hub-configuration/hub-audit/hub-audit.module',
        'EventLogConfigurationModule': './projects/hub/src/app/widgets/hub-configuration/event-log-configuration/event-log-configuration.module',
        'ClientBuCreationModule': './projects/hub/src/app/widgets/hub-root/client-bu-creation/client-bu-creation.module',
        'EmployeeEffectiveListModule': './projects/hub/src/app/widgets/hub-user/employee-effective-list/employee-effective-list.module',
        'BulkManagerModule': './projects/hub/src/app/widgets/hub-configuration/bulk-manager/bulk-manager.module',
        'OrgPreferencesModule': './projects/hub/src/app//widgets/hub-configuration/org-preferences/org-preferences.module',
        'OrganizationStructureModule': './projects/hub/src/app/widgets/hub-user/organization-structure/organization-structure.module',
        'CompensationFormModule': './projects/hub/src/app/widgets/hub-root/compensation-form/compensation-form.module',
        'AdvanceFilterListModule': './projects/hub/src/app/widgets/hub-user/advance-filter-list/advance-filter-list.module',
        'SeriesModule': './projects/hub/src/app/widgets/hub-configuration/id-generation/series/series.module',
        'UpdateTemplateModule': './projects/hub/src/app/widgets/hub-user/update-template/update-template.module',
      },

      shared: {
        "@angular/core": {
          singleton: true,
          strictVersion: false,
          requiredVersion: '12.1.4'
        },
        "@angular/common": {
          singleton: true,
          strictVersion: false,
          requiredVersion: '12.1.4'
        },
        "@angular/common/http": {
          singleton: true,
          strictVersion: false,
          requiredVersion: '12.1.4'
        },
        "@angular/forms": {
          singleton: true,
          strictVersion: false,
          requiredVersion: '12.1.4'
        },
        "@angular/router": {
          singleton: true,
          strictVersion: false,
          requiredVersion: '12.1.4'
        },
        "@ngx-translate/core": {
          singleton: true,
          strictVersion: false,
          requiredVersion: '13.0.0'
        },
        "rxjs": {
          singleton: true,
          strictVersion: false,
          requiredVersion: '6.6.0'
        },
        "@nw-workspace/common-services": {
          singleton: true,
          strictVersion: false,
          requiredVersion: '1.5.3'
        },
        ...sharedMappings.getDescriptors()
      }

    }),
    sharedMappings.getPlugin()
  ],
};
