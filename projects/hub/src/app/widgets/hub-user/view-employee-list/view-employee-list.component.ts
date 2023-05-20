import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LazyModuleLoaderService, SessionService, ToastService, WidgetService } from '@nw-workspace/common-services';
import * as M from "materialize-css/dist/js/materialize";
import { CompleterService } from 'ng2-completer';
import { environment } from 'projects/hub/src/environments/environment.prod';
import { AdvanceFilterDTO } from '../../../model/advance-filter-dto';
import { ApprovalAssignmentDTO } from '../../../model/ApprovalAssignmentDTO';
import { Constant } from '../../../model/constant';
import { EmployeeDTO } from '../../../model/EmployeeDTO';
import { EmployeeService } from '../../../services/employee.service';
import { EventsService } from '../../../services/events.service';
import { MdmService } from '../../../services/mdm.service';
import { SdmService } from '../../../services/sdm.service';
import { UtilityService } from '../../../services/utility.service';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-view-employee-list',
    templateUrl: './view-employee-list.component.html',
    styleUrls: ['./view-employee-list.component.css']
})

export class ViewEmployeeListComponent implements OnInit {
    pickCodeList: any = [];
    updateType: boolean = true
    picklistDetails: any = [];
    actions: any = [];
    picklistValue: string[] = [];
    noChanges: any;
    eventId: any;
    inputData: any = {};
    filteredData: any = {};
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    widgetCode: string;
    keyRestrictions: any = {};
    dateTimeFields: any = [];
    widgetDetail: any;
    suggestions: any = [];
    autoComplete: any = [];
    mdmFields: any = [];
    dbData: any;
    sdmValue: any;
    sdmCodes: any = [];
    currentSpoc: any;
    currentEventId: number;
    selectedIndex: any;
    dateFields: any = [];
    currentEmployee: string;
    currentEvent: string = "";
    eventConfig: any = [];
    events: any = [];
    e: any;
    checked: boolean[] = [];
    configurationss: any = [];
    fieldsToConfigure: any = [];
    noOfFields: number = 0;
    configuration: any = [];
    configurations: any = [];
    widgetWidth: number;
    searchKey: string = "";
    currentUser: any;
    count: number = 0;
    itemsPerPage: number = 50;
    currentPage: number = 1;
    employeeViewList: EmployeeDTO[] = [];
    employee = new EmployeeDTO();
    employeeViewPage: boolean;
    createEmployeePage: boolean;
    employeeDTO: EmployeeDTO = new EmployeeDTO();
    test: number = 0;
    sort: string = "employeeId asc";
    pageSizeOption: any = [10, 20, 30];
    loader: boolean = true;
    selectData: any = {}
    selectMDMData: any = {};
    personalDetail: any = {};
    approvalRequest: ApprovalAssignmentDTO = new ApprovalAssignmentDTO();
    fieldSdmMap: Map<string, string> = new Map();
    fieldConfiguration: any = {};
    showEntryButton: boolean;
    eventRoleId: number;
    eventRoleMappingId: number;
    allMyWidgets: any;
    appCode: any;
    app: any;
    buCode: any = this.sessionService.getCurrentUser().additionalDetails.mdm.buCode;
    clientCode: any = this.sessionService.getCurrentUser().additionalDetails.mdm.clientCode;
    countryCode: any = this.sessionService.getCurrentUser().additionalDetails.mdm.countryCode;
    itemsPerPageToDisplay: number = 50;
    eventHide: boolean;
    loaderEvent: boolean;
    totalFields: any = [];
    clonedData: any = {};
    visibleEventView: boolean = true;
    cdnUrl=environment.cdnPath;
    advanceList = new AdvanceFilterDTO()
    advanceFilter: any;
    headers: HttpHeaders = new HttpHeaders();
    options: { headers: HttpHeaders; };
    configId: any;
    searchKeyCount: number = 0;
    previousSearchKey: string = "";
    futureDatedEmployee: boolean = false;
    showfutureDatedSwitch: boolean = false;
    showTemplate: boolean = false;

    constructor(private http: HttpClient, private toastService: ToastService, private sessionService: SessionService, private widgetService: WidgetService, private sdmService: SdmService, private completerService: CompleterService, private utilityService: UtilityService, private mdmService: MdmService, private employeeService: EmployeeService, private lazyModuleLoaderService: LazyModuleLoaderService, private advanceEvents: EventsService) {
        this.widgetService.selectedWidget$.subscribe(myWid => {
            this.widgetDetail = myWid;
        })
    }

    ngOnInit() {
        debugger
       // this.getWidgetDetails();
        this.appCode = this.widgetDetail.application.appCode;
        this.widgetCode = this.widgetDetail.widgetCode;
        this.headers = this.headers.append('App-Code', this.appCode);
        this.headers = this.headers.append('Component', "listview");
        this.options = { headers: this.headers };
        this.fetchListConfigurationByRole();
        this.fetchFutureDated();
        this.currentUser = this.sessionService.getCurrentUser();


        this.advanceEvents.on(Constant.CONSTANT_SEND_ACTION, (advanceFilterDTO) => {
            debugger
            this.advanceList = advanceFilterDTO;
            this.currentPage = 1;
            this.fetchEmployeeView();

        });

        this.lazyModuleLoaderService.getCompFactory(
            import('../advance-filter-list/advance-filter-list.module').then(m => m.AdvanceFilterListModule)).subscribe(compFactory => {
                this.advanceFilter = compFactory;

            });
    }

   /*  getWidgetDetails() {
        this.widgetService.currentWidgets.subscribe(widgets => {
            //console.table(widgets)
            for(let singleWidget of widgets) {
             if(singleWidget.widgetPath == "ViewEmployeeListComponent") {
             this.widgetDetail = singleWidget;
             //console.log(singleWidget);
             break;
             }
            }
         
     })
    } */

    ngAfterViewInit() {
        setTimeout(function () {
            var elems = document.querySelectorAll('.datepicker');
            var instances = M.Datepicker.init(elems, {});
            let dropDownEle: Element = document.getElementById("viewEmployeePageSizeDropdown")
            var instances = M.Dropdown.init(dropDownEle, { coverTrigger: false, closeOnClick: true });

            let dropDownEle2: Element = document.getElementById("pexFieldConfig")
            var instances2 = M.Dropdown.init(dropDownEle2, { coverTrigger: false, closeOnClick: false, alignment: 'right' });
        }, 0);

        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("viewPage"), element => {
            this.onResizedEvent(element);
        });
    }

    sortFn(item) {
        this.sort = item + " asc";
        this.fetchEmployeeView();
    }

    openDropdown() {

        let dropDownEle: Element = document.getElementById("viewEmployeePageSizeDropdown")
        var instance = M.Dropdown.init(dropDownEle, { coverTrigger: false, closeOnClick: true });
        instance.open();
    }


    setDate(value, fieldName) {
        this.personalDetail[fieldName] = value;

    }
    openDropdownListFieldConfiguration() {

        let dropDownEle: Element = document.getElementById('pexFieldConfig');
        var instance = M.Dropdown.init(dropDownEle, { closeOnClick: false, alignment: 'right' });
        instance.open();
    }


    openPexEventsDropdown(index) {

        this.selectedIndex = index
        this.currentEmployee = this.employeeViewList[index]['employeeGlobalId'];
        let dropDownEle: Element = document.getElementById('pexEvents' + index);
        var instance = M.Dropdown.init(dropDownEle, { closeOnClick: true });

        instance.recalculateDimensions();
        instance.open();
    }


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


    setPageSize(size) {

        this.currentPage = 1;
        var fetchData = false;
        if (this.itemsPerPage < size)
            fetchData = true;
        this.itemsPerPage = size;
        if (fetchData) {
            this.fetchEmployeeView();
        }
        else {
            this.employeeViewList = this.employeeViewList.slice(0, size);
        }

    }


    fetchEmployeeView() {
 debugger
        if (this.previousSearchKey != this.searchKey) {
            this.previousSearchKey = this.searchKey;
            this.searchKeyCount = 0;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
            if (this.searchKeyCount == 0) {
                this.currentPage = 1;
                this.searchKeyCount++;
            }
        }
        this.loader = true;
        //fetch
        let url = "employee?searchKey=" + this.searchKey + "&page=" + this.currentPage + "&size=" + this.itemsPerPageToDisplay + "&futureDated=" + this.futureDatedEmployee
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



        this.http.get<any>(url, this.options).subscribe(employeeData => {
            this.employeeViewList = employeeData.payload.list;
            var pickObject = {}
            if (this.configuration[0].listConfig.pickListVal) {
                var value = JSON.parse(this.configuration[0].listConfig.picklistinfo)
                for (let i in value) {
                    var pickCodeList1 = []
                    for (var employee of this.employeeViewList) {

                        if (this.utilityService.isNotNullOrEmptyOrUndefined(employee[value[i].fieldName])) {

                            if (!pickCodeList1.includes(employee[value[i].fieldName])) {
                                pickCodeList1.push(employee[value[i].fieldName])
                            }
                        }
                    }
                    pickObject = {
                        picklistCode: value[i].picklistCode,
                        fieldCodeList: pickCodeList1,
                        fieldName: value[i].fieldName
                    }

                }
                if (!this.pickCodeList.includes(pickObject)) {
                    this.pickCodeList.push(pickObject)
                }
                pickObject = {}
            }


            this.fetchlistPicklists();
            this.count = employeeData.payload.totalItems;
            this.actionButtonsDisplay();
            this.loader = false;
        });

    }

    viewDetails(employee) {
        this.employee.employeeGlobalId = employee;
        this.employeeViewPage = true;
    }

    nameEventHander($event: any) {
        this.showfutureDatedSwitch
        this.futureDatedEmployee = false;
        this.searchKey = "";
        this.itemsPerPageToDisplay = 50;
        this.employeeViewPage = $event;
        this.showTemplate = false;
        if (!this.employeeViewPage) {
            this.currentPage = 1
        }
        //this.seeFutureDated();
        this.fetchEmployeeView();
        this.createEmployeePage = $event;
    }

    createEmployee() {
        this.createEmployeePage = true;
    }

    pageRefresh() {

        setTimeout(function () {
            $('select').formSelect();
            M.updateTextFields();
        }, 100);

    }

    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect();
            M.updateTextFields();
        }, 0);
    }


    fetchListConfigurationByRole() {

        //fetchListConfiguration
        this.http.get<any>("list-configuration?futureDated=" + this.futureDatedEmployee, this.options).subscribe(data => {
            this.configuration = data.payload.fieldMap;

            this.employeeViewList = data.payload.employee.payload.list;

            if (this.configuration[0].listConfig.pickListVal) {
                var value = JSON.parse(this.configuration[0].listConfig.picklistinfo)
                for (let i in value) {
                    var pickObject = {}
                    var pickCodeList1 = []
                    for (var employee of data.payload.employee.payload.list) {

                        if (this.utilityService.isNotNullOrEmptyOrUndefined(employee[value[i].fieldName])) {

                            if (!pickCodeList1.includes(employee[value[i].fieldName])) {
                                pickCodeList1.push(employee[value[i].fieldName])
                            }
                        }
                    }
                    pickObject = {
                        picklistCode: value[i].picklistCode,
                        fieldCodeList: pickCodeList1,
                        fieldName: value[i].fieldName
                    }
                    if (!this.pickCodeList.includes(pickObject)) {
                        this.pickCodeList.push(pickObject)
                    }
                    pickObject = {}

                }
            }


            this.fetchlistPicklists();

            this.count = data.payload.employee.payload.totalItems;
            this.actionButtonsDisplay();
            this.loader = false;


            for (var e of this.configuration) {

                this.noOfFields = this.noOfFields + 1;
                if (e.mandatory == true) {
                    this.configurations.push(e);
                    this.configurationss.push(e);
                } else if (this.configurations.length < 7) {
                    this.configurations.push(e);
                }
            }
            this.pageRefresh();
        });

    }


    fetchlistPicklists() {


        this.http.post<any>("picklist-values", this.pickCodeList, this.options).subscribe(data => {


            if (this.configuration[0].listConfig.pickListVal) {
                var value = JSON.parse(this.configuration[0].listConfig.picklistinfo)
                for (let i in value) {

                    for (var employee of this.employeeViewList) {
                        for (var pick of data) {
                            if (this.utilityService.isNotNullOrEmptyOrUndefined(pick[value[i].fieldName])) {
                                for (var emp of pick[value[i].fieldName]) {
                                    if (employee[value[i].fieldName] === emp["fieldCode"]) {
                                        if (this.utilityService.isNullOrEmptyOrUndefined(employee[value[i]["fieldTitle"]])) {
                                            employee[value[i]["fieldTitle"]] = emp["fieldName"]


                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

        })
    }

    limitfields(event, i) {


        if (this.configurations.length > 6) {
            this.configurations.pop();
            this.configurations;
            this.selectRefresh();
        }

    }

    compare(a, b) {
        if (a.sequence < b.sequence)
            return -1;
        if (a.sequence > b.sequence)
            return 1;
        return 0;
    }

    pushFields(i, field) {


        if (this.checked[i] == true) {
            if (this.configurationss.indexOf(field) == -1) {
                this.configurationss.push(field);
                this.configurationss.sort(this.compare);
            }
        } else if (this.checked[i] == false) {

            this.configurationss.splice(this.configurationss.indexOf(field), 1);

        }

    }


    fetchEventsByRole(keyRestrictions) {
        debugger

        let url = "employee-forms?component=update";
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
            if (!this.employeeViewPage) {
                this.viewDetails(this.keyRestrictions['employeeGlobalId']);
            }

        })
    }

 /*    fetchEventroleId(eventId) {
        this.http.get<any>("fetchEventId?eventId=" + eventId, this.options).subscribe(data => {
            this.eventRoleId = data.payload;
        })

    } */

/*Batch Upload feature not used*/
    downloadCOnfigFile(configId) {

        this.http.get("downloadConfigFile?configId=" + configId, { responseType: 'blob' }).subscribe(data => {

            var blob = new Blob([data], { type: "application/octet-stream" });

            var url = window.URL.createObjectURL(blob);

            var a = document.createElement("a");

            document.body.appendChild(a);

            a.href = url;

            a.download = "SampleTemplate.csv";

            a.click();

            window.URL.revokeObjectURL(url);
        })
    }

/*batch upload feature not used*/ 
    uploadFileDocument(event) {

        var type;
        if (this.updateType) {
            type = "PUT"
        } else {
            type = "POST"
        }




        let formdata = new FormData()

        let selectedFile: FileList = event.target.files;

        if (selectedFile.length > 0) {
            let file: File = selectedFile[0];


            formdata.append('file', file);
            var httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'multipart/formdata',
                })
            };
        }



        this.http.put<any>("uploadBatchFile?configId=" + this.configId + "&type=" + type, formdata).subscribe(data => {

            if (this.utilityService.isNotNullOrEmptyOrUndefined(data.payload)) {
                var val = JSON.parse(data.payload.body)
                this.toastService.success(val.description)
            }
            this.closeModal();

        })
    }
    clearFile() {

        $("#addFile").val("");

    }


    openModal(configId) {

        this.clearFile();
        this.configId = null;
        var elems = document.getElementById('batch_Upload');
        var instance = M.Modal.init(elems, { dismissible: false });
        this.selectRefresh();
        this.configId = configId;
        instance.open();
    }

    closeModal() {
        var elems = document.getElementById('batch_Upload');
        var instance = M.Modal.init(elems, { dismissible: false });
        instance.close();
    }








    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {

        for (var k in this.employeeViewList) {
            this.employeeViewList[k].actionButtonsList = [];
            //            this.employeeViewList[k].showViewButton = true;
            //            this.employeeViewList[k].showEventButton = true;
            this.employeeViewList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View",environment.cdnPath+"/Hub/view"));
            //            this.employeeViewList[k].actionButtonsList.push( this.actionButtonsObjectCreation( "eventButton", "event", "event" ) );

        }
    }

    outputFromListView(outPutFromChild) {

        if (outPutFromChild.selectedAction == "viewButton") {

            this.showTemplate=true;
            this.currentEmployee = outPutFromChild.listDetails.employeeGlobalId;
            this.keyRestrictions["employeeGlobalId"] = this.currentEmployee;
            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.listDetails.countryCode))
            this.keyRestrictions["countryCode"] = outPutFromChild.listDetails.countryCode;
            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.listDetails.businessunitCode))
            this.keyRestrictions["businessunitCode"] = outPutFromChild.listDetails.businessunitCode;

            if (new Date(formatDate(outPutFromChild.listDetails.effectiveStartDate, 'yyyy-MM-dd', 'en-US', '+0000') + " 00:00:00") > new Date()) {
                this.keyRestrictions["effectiveStartDate"] = formatDate(outPutFromChild.listDetails.effectiveStartDate, 'yyyy-MM-dd', 'en-US', '+0000') + " 00:00:00";
                this.keyRestrictions["futureDated"] = true;
            }

            this.fetchEventsByRole(this.keyRestrictions);
        } else if (outPutFromChild.selectedAction == "Download") {
            let configId = this.configuration[0].listConfig.configId;
            this.downloadCOnfigFile(configId);

        } else if (outPutFromChild.selectedAction == "Upload") {
            let configId = this.configuration[0].listConfig.configId;
            this.openModal(configId);
            /* this.removeApies( apiId );
             this.fetchApi();*/
        }



        else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
            this.fetchEmployeeView();
        }
        else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                this.searchKey = outPutFromChild.textToSearch;
            }
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            if (outPutFromChild.buttonClicked == "resetButton") {
                this.advanceList = new AdvanceFilterDTO();
            }
            this.fetchEmployeeView();
        }

        else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchKey = outPutFromChild.listDetails
            this.fetchEmployeeView();
        }


    }

    backmodal() {
        this.eventHide = true;
        this.fetchEventsByRole(this.keyRestrictions);
        this.selectRefresh();
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
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(eventsWithSequence)) {
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
        } else {
            return eventsWithOutSequence;
        }

    }

    seeFutureDated() {
        debugger
        if (!this.futureDatedEmployee) {
            this.futureDatedEmployee = true;
            this.employeeViewList = null;
            this.fetchListConfigurationByRole();

        } else {
            this.futureDatedEmployee = false;
            this.loader = true;
            this.fetchListConfigurationByRole();
        }
    }

    fetchFutureDated() {
        //futureDated
        this.http.get<any>("future-dated", this.options).subscribe(res => {
            this.showfutureDatedSwitch = res.payload;
        })
    }

}


