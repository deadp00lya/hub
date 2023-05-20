import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

import * as M from "materialize-css/dist/js/materialize";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from "@angular/common";
import { Input } from "@angular/core";
import { CompleterService, CompleterData, RemoteData, CompleterItem } from 'ng2-completer';
import { DomSanitizer } from "@angular/platform-browser";
import { ToastService, WidgetService, SessionService, UtilityService, LazyModuleLoaderService } from '@nw-workspace/common-services';
import { EmployeeService } from '../../../services/employee.service';
import { MdmService } from '../../../services/mdm.service';
import { SdmService } from '../../../services/sdm.service';
import { CreateTemplateComponent } from '../create-template/create-template.component';
import { CommonService } from '../../../services/common.service';
declare var require: any;
declare var $: any;

@Component({
    selector: 'app-create-employee',
    templateUrl: './create-employee.component.html',
    styleUrls: ['./create-employee.component.css']
})

export class CreateEmployeeComponent implements OnInit {
    candidateView: boolean = false;
    loader: boolean;
    fieldConfiguration: any;
    component: string;
    widgetWidth: number;
    appCode: any;
    widgetDetail: any;
    widgetCode: any;

    landingPage: boolean = true;
    headers: HttpHeaders = new HttpHeaders();
    options: { headers: HttpHeaders; };


    constructor(private sanitizer: DomSanitizer, private toastService: ToastService,
         private http: HttpClient, private widgetService: WidgetService,
          private sessionService: SessionService, private completerService: CompleterService,
           private utilityService: UtilityService, private mdmService: MdmService,
            private sdmService: SdmService, private employeeService: EmployeeService,         
            private viewContainerRef : ViewContainerRef,
            private dynamicComponentLoader: CommonService,
            private cfr: ComponentFactoryResolver
           ) {
            this.widgetService.selectedWidget$.subscribe(myWid => {
                this.widgetDetail = myWid;
            })

    }

    ngOnInit() {
        debugger
        //this.getWidgetDetails();
        this.appCode = this.widgetDetail.application.appCode;
        this.headers = this.headers.append('App-Code', this.appCode);
        this.headers = this.headers.append('Component', "create");
        this.options = { headers: this.headers };
        this.fetchFieldConfiguratorList();
    }

    /* getWidgetDetails() {
        this.widgetService.currentWidgets.subscribe(widgets => {
            //console.table(widgets)
            for(let singleWidget of widgets){
             if(singleWidget.widgetPath == "CreateEmployeeComponent") {
             this.widgetDetail = singleWidget;
             //console.log(singleWidget);
             break;
             }
            }
         
     })
    } */



    ngAfterViewInit() {

        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("createMainDiv"), element => {
            this.onResizedEvent(element);
        });

    }

    nameEventHander(event) {

        this.landingPage = event;
    }



    //                                 --------------Responsive----------------

    onResizedEvent(event) {
        this.widgetWidth = this.widgetService.onResized(event);
        if (this.widgetWidth > 12) {
            this.widgetWidth = 12
        }
    }

    getResponsiveClasses(widgetWidth, classSizeList, defaultClasses) {
        return this.widgetService.getResponsiveClasses(widgetWidth, classSizeList, defaultClasses);
    }

    getHideShow(className, widgetWidth, comparator, startSize, endSize) {
        return this.widgetService.getHideShow(className, widgetWidth, comparator, startSize, endSize);
    }



    //                        --------------------MDM & Functionality--------------------


    openCreateComponent() {
        debugger
        this.component = "create";
        this.landingPage = false;
        this.openCreateTemplate();
    }

    openCandidateComponent() {
        debugger
        this.component = "candidateCreate";
        this.landingPage = false;
        this.openCreateTemplate();
    }

    openCreateTemplate() {
      //this is used for dynamic loading, here we can pass component and remoteName to load component
      // in this we can also 
    /* this.dynamicComponentLoader.getComponentFactory("CreateTemplateComponent").subscribe(
      (componentFactory) => {
        let ref = this.viewContainerRef.createComponent(componentFactory);
        ref.instance.appCode = this.appCode;
        ref.instance.component = this.component;
      },
      (error) => {
        console.warn(error);
      }
    ); */
    // In the below code we can simply use container ref and componentFactory resolver to import and load component asynchronously
   /*  this.viewContainerRef.clear();
    const { CreateTemplateComponent } = await import('../create-template/create-template.component');
    let greetcomp = this.viewContainerRef.createComponent(
      this.cfr.resolveComponentFactory(CreateTemplateComponent)
    );
    greetcomp.instance.appCode = this.appCode;
    greetcomp.instance.component = this.component; */
   
    // In this below code Sometimes not possible to make a function async hence we can use then()  promise’s then method to lazy load a component 
    this.viewContainerRef.clear();
    import('../create-template/create-template.component').then(
      ({ CreateTemplateComponent }) => {
        let greetcomp = this.viewContainerRef.createComponent(
          this.cfr.resolveComponentFactory(CreateTemplateComponent)
        );
        greetcomp.instance.appCode = this.appCode;
        greetcomp.instance.component = this.component;
        greetcomp.instance.nameEvent.subscribe(data => {
            debugger
            this.landingPage = data
        })
      }
    )
    
    }

    fetchFieldConfiguratorList() {
        
        this.loader = true;
       
        //fieldConfigurator
        this.http.get<any>("field-configurations", this.options).subscribe(data => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(data.payload)) {
                this.fieldConfiguration = data.payload;
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.fieldConfiguration.candidateFormView) && this.fieldConfiguration.candidateFormView.visible) {
                    this.candidateView = true;
                } else {
                    this.candidateView = false;
                }
            } else {
                this.candidateView = false;
            }
            this.loader = false;
        }, err => {
            this.candidateView = false;
            this.loader = false;
        });

    }
}


