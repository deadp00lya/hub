const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "orgStructureView",
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
         name: "orgStructureView",
        filename: "remoteEntry.js",
        exposes: {
            './Component': './projects/org-structure-view/src/app/app.component.ts',
        },        
        
        // For hosts (please adjust)
        // remotes: {
        //     "neosuite": "neosuite@http://localhost:4200/remoteEntry.js",
        //     "hub": "hub@http://localhost:1995/remoteEntry.js",

        // },

        shared: {
          "@angular/core": { singleton: true, strictVersion: false, requiredVersion: '12.1.4'  }, 
          "@angular/common": { singleton: true, strictVersion: false,requiredVersion: '12.1.4' }, 
          "@angular/common/http": { singleton: true, strictVersion: false,requiredVersion: '12.1.4' },
          "@angular/forms": { singleton: true, strictVersion: false, requiredVersion: '12.1.4'  },  
          "@angular/router": { singleton: true, strictVersion: false,requiredVersion: '12.1.4' },
          "@ngx-translate/core":{singleton:true,strictVersion:false,requiredVersion:'13.0.0'} ,
          "rxjs":{ singleton: true, strictVersion: false,requiredVersion: '6.6.0' },
          "@nw-workspace/common-services":{ singleton: true, strictVersion: false,requiredVersion: '0.0.7' },
          ...sharedMappings.getDescriptors()
        }

    }),
    sharedMappings.getPlugin()
  ],
};
