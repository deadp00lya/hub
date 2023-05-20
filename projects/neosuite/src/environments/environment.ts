// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /* **************************************************
   * Knowledge Base widget componentId for help icon
   * **************************************************/  
   helpIconWidget:  'KbHomeComponent',
   issuerHost: 'https://oneloginuat.neeyamo.works',
   ApiGatewayURL:null,
   NeosuiteApiGatewayURL:null, 
   /*Below property must be used only in development mode to change the client */
   NeosuiteHost:"neosuiteuat.neeyamo.works"
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
