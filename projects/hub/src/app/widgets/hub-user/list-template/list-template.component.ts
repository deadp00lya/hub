import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as M from "materialize-css/dist/js/materialize";
import { formatDate } from "@angular/common";
import { CompleterService, CompleterData, RemoteData, CompleterItem } from 'ng2-completer';
import { UtilityService } from '../../../services/utility.service';
import { ToastService, SessionService, WidgetService } from '@nw-workspace/common-services';
import { EmployeeService } from '../../../services/employee.service';
import { MdmService } from '../../../services/mdm.service';
import { SdmService } from '../../../services/sdm.service';
import { environment } from 'projects/hub/src/environments/environment.prod';
import { AdvanceFilterDTO } from '../../../model/advance-filter-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-list-template',
    templateUrl: './list-template.component.html',
    styleUrls: ['./list-template.component.css']
})

export class ListTemplateComponent implements OnInit, OnDestroy {
    actions: any = [];
    events: any = [];
    temporaryClientCode: any;
    listComponent: any;
    currentClientCodeValue: any;
    clientListMDM: any;
    component: any;
    keys: any;
    listViewComponent: any;
    widgetCode: any;
    appCode: any;
    currentClientCode: any;
    eventHide: boolean;
    searchKey: string = "";
    componentViewPage: boolean;
    currentPage: number = 1;
    itemsPerPageToDisplay: number;
    count: any;
    loader: boolean;
    widgetDetail: any;
    currentClient: any;
    keyRestrictions: any = {};
    headers: HttpHeaders = new HttpHeaders();
    options: { headers: HttpHeaders; };
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    list: any[] = [];
    visibleEventView: boolean = true;
    advanceList = new AdvanceFilterDTO();
    configuration: any;
    pickCodeList: any=[];
    subscription: Subscription;
    
    

    constructor(private http: HttpClient, private toastService: ToastService,
         private sessionService: SessionService, private widgetService: WidgetService,
         private utilityService: UtilityService, private mdmService: MdmService,
         private router: ActivatedRoute, private route: Router) { 

         }
    

    ngOnInit() {
        debugger
        
        this.subscription =  this.widgetService.selectedWidget$.subscribe(myWid => {
            debugger
            this.listViewComponent = null;
            this.count = this.itemsPerPageToDisplay =0;
            this.headers = new HttpHeaders;
            this.widgetDetail = myWid;
            this.keyRestrictions['countryCode'] = this.sessionService.getCurrentUser().additionalDetails.mdm.countryCode
            this.keyRestrictions["legalEntityCode"] = this.sessionService.getCurrentUser().additionalDetails.mdm.buCode
            this.keyRestrictions["employeeGlobalId"] = this.sessionService.getCurrentUser().preferred_username;
            this.appCode = this.widgetDetail.application.appCode;
            this.widgetCode = this.widgetDetail.widgetCode;
            this.fetchWidgetComponent();
        
         })
        //this.getWidgetDetails();
       
    }

    getWidgetDetails() {
     /*    let activeWidget = "hublisttemplatecomponent/" + this.router.snapshot.url[0].path;

        this.widgetService.currentWidgets.subscribe(widgets => {
            //console.table(widgets)
            for(let singleWidget of widgets) {
             if(singleWidget.routePath == activeWidget) {
             this.widgetDetail = singleWidget;
             break;
             //console.log(singleWidget);
             }
            }
         
     }) */

  
    }

    fetchWidgetComponent() {
        this.options = null;
        this.http.get<any>("widget/mapping?componentType=list&widgetCode=" + this.widgetCode).subscribe(data => {
            if (data.payload != null) {
                this.headers = this.headers.append('App-Code', this.appCode);
                this.headers = this.headers.append('Component', data.payload.widgetComponent);
                this.keys = data.payload.keyCodes;
                this.options = { headers: this.headers };
                this.listComponent = data.payload.widgetComponent;
                this.listViewComponent = data.payload.listViewComponent;
                this.fetchViewList();
            }
            this.checkForUpdate();
        });

    }


    checkForUpdate() {

        this.http.get<any>("widget/mapping?componentType=update&widgetCode=" + this.widgetCode).subscribe(data => {
            if (data.payload != null) {

                this.component = data.payload.widgetComponent;
                this.fetchEventsByRole(this.keyRestrictions);
            }
        });
    }

    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.list) {
            this.list[k].actionButtonsList = [];
            this.list[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath+"/Hub/view"));
        }
    }

    outputFromListView(outPutFromChild) {
        debugger
        if (outPutFromChild.selectedAction == "viewButton") {
            this.currentClient = outPutFromChild.listDetails[this.keys];
            var array = this.keys.split(',');
            for (var item of array) {
                this.keyRestrictions[item] = outPutFromChild.listDetails[item];
            }
            this.viewDetails(outPutFromChild.listDetails[this.keys]);
        }
        else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
            this.fetchViewList();
        }
        else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                this.searchKey = outPutFromChild.textToSearch;
            }
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.fetchViewList();
        }
        else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchKey = outPutFromChild.listDetails
            this.fetchViewList();
        }
        else if (outPutFromChild.selectedAction == "applicationButton") {
            this.openModal();
        }


    }


    viewDetails(client) {
        this.currentClientCode = client;
        this.componentViewPage = true;
    }

    fetchViewList() {

        this.loader = true;

        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
            this.currentPage = 1;
        }
        this.itemsPerPageToDisplay =50;
        let url = "employee?searchKey=" + this.searchKey + "&page=" + this.currentPage + "&size=" + this.itemsPerPageToDisplay
        //this.showfutureDatedSwitch = true;
        //        this.headers = this.headers.append( 'App-Code', this.appCode );
        //        this.headers = this.headers.append( 'Component', "listview" );
        //        this.options = { headers: this.headers };

        if(this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceList)) {

            if(this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceList.countryCode)) {
                url = url + "&countryCode=" +this.advanceList.countryCode;
            }
            if(this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceList.businessunitCode)) {
                url = url + "&businessunitCode=" +this.advanceList.businessunitCode;
            }
            if(this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceList.employeeStatus)) {
                url = url + "&employeeStatus=" +this.advanceList.employeeStatus;
            }
            if(this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceList.dateOfJoining)) {
                url = url + "&dateOfJoining=" +this.advanceList.dateOfJoining;
            }
            if(this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceList.location)) {
                url = url + "&location=" +this.advanceList.location;
            }
        }
        //fetch
        this.http.get<any>(url, this.options).subscribe(data => {

            this.list = data.payload.list;
            
            var pickObject = {}
            if (this.utilityService.isNotNullOrEmptyOrUndefined(data.picklist)) {
                this.configuration=JSON.parse(data.picklist);
                for (let i in this.configuration) {
                    var pickCodeList1 = []
                    this.list.forEach(employee => {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(employee[this.configuration[i].fieldName])) {

                            if (!pickCodeList1.includes(employee[this.configuration[i].fieldName])) {
                                pickCodeList1.push(employee[this.configuration[i].fieldName])
                            }
                        }
                    });
                    pickObject = {
                        picklistCode: this.configuration[i].picklistCode,
                        fieldCodeList: pickCodeList1,
                        fieldName: this.configuration[i].fieldName
                    }

                }
                if (!this.pickCodeList.includes(pickObject)) {
                    this.pickCodeList.push(pickObject)
                }
                pickObject = {}
                
                setTimeout(() => {
                    this.fetchlistPicklists();
                   }, 10);
           }

           

            this.count = data.payload.totalItems;
            this.actionButtonsDisplay();
            this.loader = false;
        });

    }

    fetchEventsByRole(keyRestrictions) {
        debugger
        let url = "employee-forms?component=" + this.component;
        if(this.utilityService.isNotNullOrEmptyOrUndefined(keyRestrictions.countryCode)) {
            url = url.concat("&countryCode=" + keyRestrictions.countryCode);
            if(this.utilityService.isNotNullOrEmptyOrUndefined(keyRestrictions.countryCode)) {
                url = url.concat("&businessunitCode=" + keyRestrictions.businessunitCode);
            }
        }
        url = url.concat("&employeeGlobalId="+ this.keyRestrictions.employeeGlobalId)
        this.http.get<any>(url, this.options).subscribe(data => {
            this.events = data.payload.events;
            this.actions = data.payload.actions;
            if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.events)) {
                this.events = this.sortEvents(this.events);
            }
            if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.actions)) {
                this.actions = this.sortEvents(this.actions);
            }
        })
    }


    backmodal() {
        this.eventHide = true;
        this.selectRefresh();
    }
    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect();
            M.updateTextFields();
        }, 0);
    }



    nameEventHander($event: any) {
        this.searchKey = "";
        this.itemsPerPageToDisplay = 10;
        this.componentViewPage = $event;
        this.fetchViewList();
    }

    saveClient() {

        this.currentClientCodeValue;
        this.headers = new HttpHeaders();
        this.headers = this.headers.append('Client-Code', this.currentClientCodeValue);
        this.headers = this.headers.append('App-Code', this.appCode);

        this.headers = this.headers.append('Component', this.listComponent);
        this.options = { headers: this.headers };

        //        this.fetchWidgetComponent()
        this.fetchViewList();
        this.closeModal();
        this.temporaryClientCode = this.currentClientCodeValue;
    }

    closeModal() {
        var elemodal = document.getElementById('selectClientModal');
        var modalInstance = M.Modal.init(elemodal, {});

        modalInstance.close();
    }

    openModal() {
        this.currentClientCodeValue = null;
        this.clientListMDM = []
        this.fetchClientsFromMDM();
        var elems = document.getElementById('selectClientModal');
        var instance = M.Modal.init(elems, {});
        this.selectRefresh();
        instance.open();
    }

    fetchClientsFromMDM() {

        this.http.get<any>("fetchClientsMDM").subscribe(data => {
            this.clientListMDM = data.payload.list;
            this.selectRefresh();
        });
    }

    sortEvents(events) {
        var eventsWithSequence = []
        var eventsWithOutSequence = []
        for (var event of events) {
            if (this.utilityService.isNotNullOrEmptyOrUndefined2(event.sequence)) {
                eventsWithSequence.push(event)
            } else {
                eventsWithOutSequence.push(event);
            }
        }
        for (var i = 0; i < eventsWithSequence.length; i++) {
            for (var j = 0; j < eventsWithSequence.length - 1; j++) {
                if (eventsWithSequence[j].sequence > eventsWithSequence[j + 1].sequence) {
                    var temp = eventsWithSequence[j];
                    eventsWithSequence[j] = eventsWithSequence[j + 1];
                    eventsWithSequence[j + 1] = temp;
                }
            }
        }
        eventsWithSequence = eventsWithSequence.concat(eventsWithOutSequence);
        return eventsWithSequence;
    }

/************************************pexList configuration************************************** */

fetchlistPicklists() {
debugger
    this.http.post<any>("picklist-values", this.pickCodeList, this.options).subscribe(data => {
        this.pickCodeList =[];
            for (let i in this.configuration) {
            this.list.forEach(employee =>{
                data.forEach(pick =>{
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(pick[this.configuration[i].fieldName])) {
                        for (var emp of pick[this.configuration[i].fieldName]) {
                            if (employee[this.configuration[i].fieldName] === emp["fieldCode"]) {
                                if (this.utilityService.isNotNullOrEmptyOrUndefined(employee[this.configuration[i]["fieldName"]])) {
                                    employee[this.configuration[i]["fieldName"]] = emp["fieldName"]


                                }
                            }
                        }
                    }
                })
         })
        }
    })
}

ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
    this.subscription.unsubscribe();
}

}
