import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from "@angular/common/http";
import { UtilityService, WidgetService } from '@nw-workspace/common-services';
import { formatDate } from "@angular/common";
import { ToastService } from '../../../services/toast.service';
import { AuditDTO } from '../../../model/AuditDTO';
import { JsonFieldDTO } from '../../../model/JsonFieldDTO';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-hub-audit',
    templateUrl: './hub-audit.component.html',
    styleUrls: ['./hub-audit.component.css']
})

export class HubAuditComponent implements OnInit {
    modalInstance: any;
    constructor(private http: HttpClient, public widgetService: WidgetService,
        private toastService: ToastService, public utilityService: UtilityService) {
    }

    itemsPerPageToDisplay: number = 50;
    currentPage: number = 1;
    count: any;
    itemsPerPageToDisplayEmp: number = 50;
    currentPageEmp: number = 1;
    countEmp: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    customCssObject: {};
    searchKey: string = '';
    widgetWidth: number;

    employeeList: any[] = [];
    employeeListAll: any[] = [];
    businessUnitList: any[] = [];
    countryList: any[] = [];
    sectionList: any[] = [];
    fieldMap: any[] = [];
    fieldList: JsonFieldDTO[] = [];
    fieldDto: JsonFieldDTO = new JsonFieldDTO();

    auditList: any[] = [];
    auditListFlag: boolean = false;
    auditDataMdm: any;
    collapsibleValues: any;

    auditDataDto: AuditDTO = new AuditDTO();
    auditListDto: AuditDTO = new AuditDTO();

    eventPage: boolean = true;
    eventLogListView: boolean = true;
    eventLogDataView: boolean = false;
    eventDetailsView: boolean = true;
    eventHistoryView: boolean = false;
    eventDetailsPage: boolean = false;
    eventList: any[] = [];
    allEventList: any[] = [];

    actionPage: boolean = false;
    actionLogListView: boolean = false;
    actionLogDataView: boolean = false;
    actionDetailsView: boolean = false;
    actionHistoryView: boolean = false;
    actionDetailsPage: boolean = false;
    actionList: any[] = [];
    allActionList: any[] = [];

    fieldType: string = "Event";
    logType: string = "Details";
    eventDetails: any = new Object;
    showDataFlag: boolean = false;
    cdnUrl=environment.cdnPath;

    periodList: any = [
        { "value": "1 Month" },
        { "value": "3 Month" },
    ];

    employeeAudtiList: any;
    loader: boolean = false;

    ngOnInit() {
        this.getAllEventList();
        this.getCountryList();
        this.setDateData();

        this.auditListDto.fieldType = 'Event';
        this.selectRefresh();
    }

    ngAfterViewInit() {
        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll"
        });

        erdUltraFast.listenTo(document.getElementById("hub_audit"), element => {
            this.onResizedEvent(element);
        });

        document.addEventListener("DOMContentLoaded", function () {
            $('.preloader-background ').delay(5000).fadeOut(' slow');
            $('.preloader-wrapper ')
                .delay(5000)
                .fadeOut();
        });

        $('.datepicker').datepicker();
        $('.collapsible').collapsible();
        $('.dropdown-trigger').dropdown({
            closeOnClick: false
        });


        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.fixed-action-btn');
            var instances = M.FloatingActionButton.init(elems, {
                direction: "left"
            });
        });

        var elems = document.querySelectorAll('.collapsible');
        var instances = M.Collapsible.init(elems, {});

        this.dateRefresh();
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

    pageRefresh() {
        this.selectRefresh();
        $('.collapsible').collapsible();
    }

    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect()
            M.updateTextFields();
        }, 0);
    }

    dateRefresh() {
        setTimeout(() => {
            var elems = document.querySelectorAll('.datepicker');
            var instances = M.Datepicker.init(elems, {
                showClearBtn: true
            });
        }, 0);
    }

    loaderOff(duration) {
        setInterval(() => {
            this.loader = false;
        }, duration);
    }

    resetData() {
        this.auditListDto = new AuditDTO();
        this.auditList = [];
        this.businessUnitList = [];
        this.employeeList = [];

        this.pageRefresh();
        this.selectRefresh();
        this.setDateData();
    }

    logTypeFilter(type: any) {
        this.logType = type;

        if (this.fieldType == 'Event') {
            if (this.logType == 'Details') {
                this.eventDetailsView = true;
                this.eventHistoryView = false;
            } else if (this.logType == 'History') {
                this.eventHistoryView = true;
                this.eventDetailsView = false;
                this.fetchEmployeeLog();
            }
        } else if (this.fieldType == 'Action') {

        }

    }

    fetchRecordFilter(event: any) {
        this.loader = true;
        this.fieldType = event;
        this.auditListDto = new AuditDTO();
        this.auditDataDto = new AuditDTO();

        if (this.fieldType == 'Event') {
            this.getAllEventList();
            this.eventLogListView = true;
            this.actionLogListView = false;
            this.eventPage = true;
            this.auditListDto.fieldType = 'Event';
            this.auditDataDto.fieldType = 'Event';
        } else if (this.fieldType == 'Action') {
            this.getAllActionList();
            this.eventLogListView = false;
            this.actionLogListView = true;
            this.actionPage = true;
            this.auditListDto.fieldType = 'Action';
            this.auditDataDto.fieldType = 'Action';
        }

        this.auditList = [];
        this.businessUnitList = [];
        this.auditDataMdm = null;
        this.setDateData();
        this.auditListFlag = false;
        this.loaderOff(500);
        this.pageRefresh();
    }


    setDate(setValue: string) {
        return formatDate(setValue, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }

    setDateDat() {
        if (this.utilityService.isNullOrEmptyOrUndefined(this.eventDetails.createdOn))
            this.eventDetails.createdOn = null;
        else
            this.eventDetails.createdOn = formatDate(this.eventDetails.createdOn, 'yyyy-MM-dd HH:mm:ss', 'en-US');

        if (this.utilityService.isNullOrEmptyOrUndefined(this.eventDetails.effectiveStartDate))
            this.eventDetails.effectiveStartDate = null
        else
            this.eventDetails.effectiveStartDate = formatDate(this.eventDetails.effectiveStartDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');

        if (this.utilityService.isNullOrEmptyOrUndefined(this.eventDetails.effectiveEndDate))
            this.eventDetails.effectiveEndDate = null;
        else
            this.eventDetails.effectiveEndDate = formatDate(this.eventDetails.effectiveEndDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');

        if (this.utilityService.isNullOrEmptyOrUndefined(this.eventDetails.modifiedOn))
            this.eventDetails.modifiedOn = null;
        else
            this.eventDetails.modifiedOn = formatDate(this.eventDetails.modifiedOn, 'yyyy-MM-dd HH:mm:ss', 'en-US');

    }

    collabsibleClick(item) {
        this.collapsibleValues = item.value;
        this.pageRefresh();
    }

    setDateData() {
        let currentDate = new Date();
        var dateOffset = (24 * 60 * 60 * 1000) * 7;

        this.auditListDto.toDate = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
        this.auditListDto.fromDate = formatDate(currentDate.getTime() - dateOffset, 'yyyy-MM-dd HH:mm:ss', 'en-US');

        this.pageRefresh();
    }

    searchEmployee(searchString: string) {
        this.employeeList = [];

        if (this.utilityService.isNotNullOrEmptyOrUndefined(searchString) && searchString != "") {
            //searchEmployee
            let url = "employee-search?searchString=" + searchString

            if(this.utilityService.isNotNullOrEmptyOrUndefined(this.auditListDto.countryCode))
               url = url + "&countryCode=" + this.auditListDto.countryCode;
            
            if(this.utilityService.isNotNullOrEmptyOrUndefined(this.auditListDto.businessunitCode))
               url = url + "&businessunitCode=" + this.auditListDto.businessunitCode;   
              
            this.http.get<any>(url).subscribe(response => {
                this.employeeList = response.payload.list;
                this.employeeList.forEach(item => {
                    item.empIdAndName = item.preferredName + " : " + item.employeeId;
                });

                this.pageRefresh();
            });
        }
    }

    getAllEventList() {
        this.allEventList = [];

        this.http.get<any>("event").subscribe(response => {
            this.allEventList = response.payload;
            this.getEventList();
            this.pageRefresh();
        });

    }

    getEventList() {
        this.eventList = [];

        this.http.get<any>("json-configuration/event").subscribe(response => {
            this.eventList = response.payload.list;
            this.pageRefresh();
            this.dateRefresh();
        });

    }

    getAllActionList() {
        this.actionList = [];

        this.http.get<any>("action").subscribe(response => {
            this.allActionList = response.payload.actionList;
            this.getActionList();
            this.pageRefresh();
        });

    }

    getActionList() {
        this.actionList = [];

        this.http.get<any>("json-configuration/action").subscribe(response => {
            this.actionList = response.payload.list;
            this.pageRefresh();
            this.dateRefresh();
        });

    }

    viewLogData(data) {
        this.loader = true;
        this.auditDataDto = new AuditDTO();
        this.auditDataDto.rev = data.REV;
        this.auditDataDto.employeeGlobalId = data.employeeGlobalId;
        this.auditDataDto.employeeName = null;

        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditDataDto.employeeGlobalId)) {
            //searchEmployee
            this.http.get<any>("employee-search?searchString=" + this.auditDataDto.employeeGlobalId).subscribe(response => {
                if (this.utilityService.isNotNullOrEmptyOrUndefined(response) && response.payload.list.length > 0) {
                    let emp = response.payload.list[0];
                    this.auditDataDto.employeeName = emp.preferredName;
                }
                this.pageRefresh();
            });
        }

        if (this.fieldType == 'Event') {
            this.eventLogListView = false;
            this.eventLogDataView = true;
            this.eventDetailsView = true;
            this.auditDataDto.eventType = data.eventType;
            this.auditDataDto.fieldType = 'Event';
            this.pageRefresh();
        } else if (this.fieldType == 'Action') {
            this.actionLogListView = false;
            this.actionLogDataView = true;
            this.auditDataDto.actionType = data.eventType;
            this.auditDataDto.fieldType = 'Event';
            this.pageRefresh();
        }

        var domElement = document.getElementById("hub_audit") as HTMLElement;
        domElement.scrollTop = 0;
        this.setDateDat();
        this.fetchAuditLogs();
        this.loaderOff(9000);
    }

    closeEventDetailsView() {
        this.loader = true;
        this.fieldList = [];
        if (this.fieldType == 'Event') {
            this.eventLogListView = true;
            this.eventLogDataView = false;
            this.fieldList = [];
        } else if (this.fieldType == 'Action') {
            this.actionLogListView = true;
            this.actionLogDataView = false;
            this.fieldList = [];
        }

        this.showDataFlag = false;
        this.loaderOff(1000);
        this.dateRefresh();
        this.pageRefresh();
    }

    closeEventHistoryView() {
        if (this.fieldType == 'Event') {
            if (this.eventDetailsPage) {
                this.eventDetailsPage = false;
                this.eventHistoryView = true;
            } else {
                this.eventDetailsView = true;
                this.eventHistoryView = false;
                this.logType = 'Details';
            }
        } else if (this.fieldType == 'Action') {
            this.actionLogListView = true;
            this.actionLogDataView = false;
        }
        this.pageRefresh();
    }

    closeAuditDataView() {
        this.loader = true;
        if (this.fieldType == 'Event') {
            this.eventLogListView = true;
            this.eventLogDataView = false;
        } else if (this.fieldType == 'Action') {
            this.actionLogListView = true;
            this.actionLogDataView = false;
        }

        this.loaderOff(800);
        this.setDateData();
        this.pageRefresh();
    }

    showMore() {
        this.loader = true;
        this.showDataFlag = true;
        this.loaderOff(3000);
    }

    showLess() {
        this.showDataFlag = false;
    }

    getCountryList() {
        this.countryList = [];

        this.http.get<any>("countries").subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response)) {
                this.countryList = response.payload.list;
            }
            this.pageRefresh();
        });
    }

    getBusinessUnitList() {
        this.businessUnitList = [];

        this.http.get<any>("businessunit?countryCode='" + this.auditListDto.countryCode + "'").subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response)) {
                this.businessUnitList = response.payload.list;
            }
            this.pageRefresh();
        });
    }

    fetchAuditList() {
        
        this.loader = true;
        this.auditList = [];
        this.auditListDto.page = this.currentPage - 1;
        this.auditListDto.size = this.itemsPerPageToDisplay;
        this.auditListDto.searchString = this.searchKey;

        //fetchAuditLogsList
        let url = this.fieldType+"/<type>/audit-list?page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay;

        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditListDto.employeeGlobalId)) {
            url = url + "&employeeGlobalId=" + this.auditListDto.employeeGlobalId;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditListDto.countryCode)) {
            url = url + "&countryCode=" + this.auditListDto.countryCode;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditListDto.businessunitCode)) {
            url = url + "&businessunitCode=" + this.auditListDto.businessunitCode;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditListDto.fromDate)) {
            url = url + "&fromDate=" + this.auditListDto.fromDate;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditListDto.toDate)) {
            url = url + "&toDate=" + this.auditListDto.toDate;
        }

        if (this.fieldType == 'Event') {
            if (this.utilityService.isNullOrEmptyOrUndefined(this.auditListDto.eventType)) {
                this.loader = false;
                return this.toastService.error("Select Event");
            } else {
                url = url.replace("<type>",this.auditListDto.eventType);
            }
        } else if (this.fieldType == 'Action') {
            if (this.utilityService.isNullOrEmptyOrUndefined(this.auditListDto.actionType)) {
                this.loader = false;
                return this.toastService.error("Select Action");
            } else {
                url = url.replace("<type>",this.auditListDto.actionType);
            }
        }
        

        //fetchAuditLogsList
        this.http.get<any>(url).subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response.payload.event)) {
                this.auditList = response.payload.event;
                this.count = this.auditList.length;
                this.actionButtonsDisplay();
                this.loader = false;
            }

            if (this.auditList.length > 0)
                this.auditListFlag = false;
            else
                this.auditListFlag = true;

            this.pageRefresh();
        });

        this.loaderOff(3000);
    }

    fetchAuditLogs() {
        this.auditDataMdm = null;
        this.eventDetails = {};

        //fetchAuditLogs
        let url = this.fieldType+"/<type>/employee/audit?page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay;

        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditDataDto.employeeGlobalId)) {
            url = url + "&employeeGlobalId=" + this.auditDataDto.employeeGlobalId;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditDataDto.countryCode)) {
            url = url + "&countryCode=" + this.auditDataDto.countryCode;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditDataDto.businessunitCode)) {
            url = url + "&businessunitCode=" + this.auditDataDto.businessunitCode;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditDataDto.fromDate)) {
            url = url + "&fromDate=" + this.auditDataDto.fromDate;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditDataDto.toDate)) {
            url = url + "&toDate=" + this.auditDataDto.toDate;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditDataDto.rev)) {
            url = url + "&rev=" + this.auditDataDto.rev;
        }

        if (this.fieldType == 'Event') {
            if (this.utilityService.isNullOrEmptyOrUndefined(this.auditDataDto.eventType)) {
                this.loader = false;
                return this.toastService.error("Select Event");
            } else {
                url = url.replace("<type>",this.auditDataDto.eventType);
            }
        } else if (this.fieldType == 'Action') {
            if (this.utilityService.isNullOrEmptyOrUndefined(this.auditDataDto.actionType)) {
                this.loader = false;
                return this.toastService.error("Select Action");
            } else {
                url = url.replace("<type>",this.auditDataDto.actionType);
            }
        }

        //fetchAuditLogs
        this.http.get<any>(url).subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response)) {
                this.auditDataMdm = response.payload;

                if (this.utilityService.isNotNullOrEmptyOrUndefined(response.payload.event[0]))
                    this.eventDetails = response.payload.event[0];

                this.showFieldData();
                this.setDateDat();
                this.count = response.payload.totalItems;
                this.actionButtonsDisplay();
            }
            this.setDateDat();
            this.pageRefresh();
        });
    }

    showFieldData() {
        debugger
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.auditDataMdm)) {
            for (let field in this.fieldMap) {
                if (this.auditDataMdm[field] != undefined && this.auditDataMdm[field].length > 0) {
                    let listOne = this.fieldMap[field];
                    let listTwo = this.auditDataMdm[field][0];

                    for (let item of listOne) {
                        this.fieldDto = new JsonFieldDTO();
                        this.fieldDto = Object.assign({}, item);
                        this.fieldDto.fieldValue = listTwo[item.fieldName];

                        if (item.fieldSource != null && item.sourceCode != null) {
                            let api;
                            if (this.fieldDto.fieldSource == "MDM") {
                                api = "mdm-field-values";   //getMDMFieldValue
                                api = api + "/" + this.fieldDto.fieldName + "/" + this.fieldDto.fieldValue + "?source-code=" + this.fieldDto.sourceCode;
                            }
                            else {
                                api = "picklist-values";  //getPickListFieldValue
                                api = api + "/" + this.fieldDto.fieldValue + "?source-code=" + this.fieldDto.sourceCode;
                            }

                            

                            this.http.get<any>(api).subscribe(response => {
                                if (this.utilityService.isNotNullOrEmptyOrUndefined(response.payload)) {
                                    this.fieldDto = response.payload;
                                    this.fieldDto.fieldDisplay = this.resolvePattern(this.fieldDto.fieldValue, this.fieldDto);
                                    this.fieldList.push(this.fieldDto);
                                    this.pageRefresh();
                                }
                            });
                        }
                        else {
                            this.fieldDto.fieldDisplay = this.resolvePattern(this.fieldDto.fieldValue, this.fieldDto);
                            this.fieldList.push(this.fieldDto);
                        }
                    }
                }
            }
        }
    }

    resolvePattern(data, pattern) {
        let map = new Map();

        if (this.utilityService.isNotNullOrEmptyOrUndefined(data) && this.utilityService.isNotNullOrEmptyOrUndefined(pattern.sourceCode)) {
            let string = data;
            let keyValuePairs = string.slice(1, -1).split(/\s*,\s*/).map(chunk => chunk.split("="));
            map = new Map(keyValuePairs);
        }

        if (pattern && pattern.fieldDisplay) {
            var patt = pattern.fieldDisplay;

            let result = patt.replace(/\{\S+?\}/g, function (str, offset, input) {
                var key = str.replace('{', '');
                key = key.replace('}', '');

                data = map.get(key);
                if (data == null || data == undefined) {
                    var empty = "";
                    return empty;
                }
                else {
                    return data;
                }
            });
            if (pattern.fieldType == 'DateTime') {
                if (pattern.fieldDisplay != null && data != null)
                    return formatDate(data, pattern.fieldDisplay, 'en-US');
                else return data;
            } else if (pattern.fieldType == 'Bit') {
                return data;
            }
            else return result;
        } else {
            if (pattern.fieldType == 'Date' && data != null) {
                return formatDate(data, 'yyyy-MM-dd', 'en-US');
            } else
                return data;
        }
    }

    fetchEmployeeLog() {
        this.employeeAudtiList = [{ "eventType": "CDC", "createdBy": "abc", "createdOn": "1611705600000" }];
        this.actionButtonsDisplay();
    }

    getSectionList(eventType) {
        this.sectionList = [];
        this.http.get<any>("section?eventType=" + eventType).subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response.payload)) {
                this.sectionList = response.payload.sectionList;
                this.fieldMap = response.payload.fieldMap;
                this.pageRefresh();
            }
        });
    }

    customCssObjects(cssName, columToApply) {
        return this.customCssObject = {
            cssName: cssName,
            columToApply: columToApply,
        }
    }

    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.auditList) {
            this.auditList[k].actionButtonsList = [];
            this.auditList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewLogButton", "View Log",environment.cdnPath+"/Hub/view"));
        }

        if (this.eventHistoryView) {
            for (var k in this.employeeAudtiList) {
                this.employeeAudtiList[k].actionButtonsList = [];
                this.employeeAudtiList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewEmployeeLogButton", "View", environment.cdnPath+"/Hub/view"));
            }
        }
    }

    outputFromListView(outPutFromChild) {
        debugger
        if (outPutFromChild.selectedAction == "viewLogButton") {
            let audit = outPutFromChild.listDetails;
            this.viewLogData(audit);
            this.getSectionList(audit.eventType);
        } else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
            this.fetchAuditList();
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchKey = outPutFromChild.listDetails;
            this.fetchAuditList();
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.fetchAuditList();
        } else if (outPutFromChild.selectedAction == "viewEmployeeLogButton") {
            let audit = outPutFromChild.listDetails;
            this.eventDetails.eventType = "JDC";
            this.eventDetailsPage = true;
        }
    }
}
