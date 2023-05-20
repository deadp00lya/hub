import { Component, ViewChild, ElementRef, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as M from "materialize-css/dist/js/materialize";
import { CompleterService, CompleterData, RemoteData, CompleterItem } from 'ng2-completer';
import { formatDate } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { UtilityService } from '../../../services/utility.service';
import { ToastService, WidgetService, SessionService } from '@nw-workspace/common-services';
import { ApprovalAssignmentDTO } from '../../../model/ApprovalAssignmentDTO';
import { EmployeeService } from '../../../services/employee.service';
import { MdmService } from '../../../services/mdm.service';
import { SdmService } from '../../../services/sdm.service';


declare var require: any;
declare var $: any;

@Component({
    selector: 'app-employee-profile',
    templateUrl: './employee-profile.component.html',
    styleUrls: ['./employee-profile.component.css']
})

export class EmployeeProfileComponent implements OnInit {
    validationMsg: boolean;
    deltaDIObj: any = {};
    deltaData: any = {};
    neosuiteNotifications: any;
    preferredLang: any;
    approvalData: any;
    effectiveDateView: any = false;
    oneTimeUpdatedView: boolean = false;
    employeeData: any;
    newDataDisplayNames: any = {};
    oldDataDisplayNames: any = {};
    actionList: any = [];
    totalFields: any = [];
    notification: any;
    formId: any;
    formFileData: any;
    loading: boolean;
    selectedEvent: any;
    formCode: any;
    flowCode: any;
    effectiveDate: any;
    eventList: any;
    fileList: any;
    data: any;
    updatedData: any;
    oldData: any;
    additionalValue: {};
    currentEvent: any;
    component: string;
    events: any;
    widgetWidth: number;
    form_data: FormData;

    widgetDetail: any;
    showEvent: boolean = false;

    convoAI: boolean = false;

    headers: HttpHeaders = new HttpHeaders();
    options: { headers: HttpHeaders; };
    keyRestrictions: any = {};

    approvalRequest: ApprovalAssignmentDTO = new ApprovalAssignmentDTO();

    @Input("appCode") appCode: any;
    @Input("widgetCode") widgetCode: any;
    @ViewChild("pexProfileTab", { static: true }) pexProfileTab: ElementRef;

    constructor(private sanitizer: DomSanitizer, private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService, private sessionService: SessionService, private sdmService: SdmService, private completerService: CompleterService, private utilityService: UtilityService, private mdmService: MdmService, private employeeService: EmployeeService) {
        this.widgetService.selectedWidget$.subscribe(myWid => {
            this.widgetDetail = myWid;
        })
    }

    ngOnInit() {
        //this.getWidgetDetails();
        this.preferredLang = this.sessionService.getCurrentUser().additionalDetails.mdm.preferredLang;
        this.additionalValue = {
            "featureCode": "profile",
            "customFieldsFirst": null
        }

        if (this.appCode == undefined || this.appCode == null || this.appCode == "") {
            this.appCode = this.widgetDetail.application.appCode;
        }

        if (this.widgetCode == undefined || this.widgetCode == null || this.widgetCode == "") {
            this.widgetCode = this.widgetDetail.widgetCode;
        }

        this.headers = this.headers.append('App-Code', this.appCode);
        this.headers = this.headers.append('Component', "profile");
        this.options = { headers: this.headers };

        this.keyRestrictions['countryCode'] = this.sessionService.getCurrentUser().additionalDetails.mdm.countryCode
        this.keyRestrictions["businessunitCode"] = this.sessionService.getCurrentUser().additionalDetails.mdm.buCode
        this.keyRestrictions["employeeGlobalId"] = this.sessionService.getCurrentUser().preferred_username
        this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username

        this.fetchEventsByRole(this.keyRestrictions);
    }

    /* getWidgetDetails() {
        this.widgetService.currentWidgets.subscribe(widgets => {
            //console.table(widgets)
            for(let singleWidget of widgets) {
             if(singleWidget.widgetPath == "EmployeeProfileComponent") {
             this.widgetDetail = singleWidget;
             console.log(singleWidget);
             }
            }
         
     })
    } */

    fetchEventsByRole(keyRestrictions) {

        let url = "employee-forms?component=profile";
        if(this.utilityService.isNotNullOrEmptyOrUndefined(keyRestrictions.countryCode)) {
            url = url.concat("&countryCode=" + keyRestrictions.countryCode);
            if(this.utilityService.isNotNullOrEmptyOrUndefined(keyRestrictions.countryCode)) {
                url = url.concat("&businessunitCode=" + keyRestrictions.businessunitCode);
            }
        }
        url = url.concat("&employeeGlobalId="+ this.keyRestrictions.employeeGlobalId)
        
        this.http.get<any>(url, this.options).subscribe(data => {
            this.eventList = data.payload.events;
            this.actionList = data.payload.actions;

            if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.eventList)) {
                this.eventList = this.sortEvents(this.eventList);
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.actionList)) {
                this.actionList = this.sortEvents(this.actionList);
            }
        })
    }

    ngAfterViewInit() {
        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });

        setTimeout(() => {
            var elems1 = document.getElementById("pexfile");
            var instances = M.Modal.init(elems1, { dismissible: false });
        }, 10);

        erdUltraFast.listenTo(document.getElementById("pex_profile"), element => {
            this.onResizedEvent(element);
            this.refresh();

            setTimeout(function () {
                var elems = document.querySelectorAll('.datepicker');
                var instances = M.Datepicker.init(elems, { format: 'yyyy-mm-dd' });
            }, 50);
        });
    }

    refresh() {
        setTimeout(function () {
            $('select').formSelect();
        }, 10);
    }

    selectRefresh() {
        setTimeout(function () {
            $('select').formSelect();
            M.updateTextFields();
        }, 10);
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

    updateEmployeeProfileByApproval() {
        var dataInjection = JSON.parse(this.selectedEvent.dataInjection);

        for (var [key, value] of Object.entries(dataInjection)) {
            if (dataInjection[key] == 'currentDate') {
                this.data.data[key] = new Date();
            } else {
                this.data.data[key] = dataInjection[key];
            }
        }

        var eventCode = null;
        var actionCode = null;

        var customDataFlow = false;
        var routineId = null;

        var oldApprovalFlowFlag = true;

        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.selectedEvent.customDataFlow)) {
            customDataFlow = this.selectedEvent.customDataFlow;
        }

        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.selectedEvent.routineId)) {
            routineId = this.selectedEvent.routineId;
        }

        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.selectedEvent.eventCode)) {
            eventCode = this.selectedEvent.eventCode;
        }

        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.selectedEvent.actionCode)) {
            actionCode = this.selectedEvent.actionCode;
        }

        oldApprovalFlowFlag = this.selectedEvent.oldApprovalFlowFlag;

        var data = { component: "update", predata: this.oldData, data: this.data.data, formCode: this.formCode, flowCode: this.flowCode, pexFileData: null, formFileData: this.formFileData, eventId: null, eventCode: eventCode, actionCode: actionCode, updateAPICode: this.data.updateAPICode, formId: this.formId, notification: this.notification, totalFields: this.totalFields, oldDataDisplayNames: this.oldDataDisplayNames, newDataDisplayNames: this.newDataDisplayNames, roleFormId: this.selectedEvent.id, neosuiteNotifications: this.neosuiteNotifications, routineId: routineId, customDataFlow: customDataFlow, oldApprovalFlowFlag: oldApprovalFlowFlag, deltaData: this.deltaData, deltaDIObj: this.deltaDIObj };

        if (this.selectedEvent.deltaApi) {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(dataInjection)) {
                for (var [key, value] of Object.entries(dataInjection)) {
                    if (dataInjection[key] == 'currentDate') {
                        if (this.deltaData[key] == undefined)
                            this.deltaData[key] = new Date();
                    } else {
                        if (this.deltaData[key] == undefined)
                            this.deltaData[key] = dataInjection[key];
                    }
                }
            }
            data["data"] = this.deltaData;
        }

        var form_data = new FormData();

        for (var key in this.fileList) {
            for (var file of this.fileList[key])
                form_data.append(key, file);
        }

        form_data.append("widgetDTO", new Blob([JSON.stringify(data)], {
            type: "application/json"
        }));

        //update employee
        this.http.put<any>("employee", form_data, this.options).subscribe(personalData => {
            this.fetchEventForm(this.selectedEvent);
        }, err => {
        });
    }

    generateEffectiveHeaders(date) {
        this.headers = new HttpHeaders();
        this.headers = this.headers.append('App-Code', this.appCode);
        this.headers = this.headers.append('Component', "profile");

        if (date != undefined && date != null) {
            this.headers = this.headers.append('Effective-Date', date);
        }

        this.options = { headers: this.headers };
    }

    generateHeaders() {
        this.headers = new HttpHeaders();
        this.headers = this.headers.append('App-Code', this.appCode);
        this.headers = this.headers.append('Component', "profile");
        this.options = { headers: this.headers };
    }

    fetchEventForm(event) {
        if(event.convoAI){
            this.convoAI = true;
        }
        this.employeeData = null;
        this.oneTimeUpdatedView = false;

        if (this.utilityService.isNotNullOrEmptyOrUndefined(event.effectiveDateView)) {
            this.effectiveDateView = event.effectiveDateView;
        } else {
            this.effectiveDateView = false;
            if (this.utilityService.isNotNullOrEmptyOrUndefined2(event.oneTimeUpdate) && event.oneTimeUpdate) {
                this.fetchapprovalInformationByFormRoleId(event, this.keyRestrictions["employeeGlobalId"], true);
            } else if (this.utilityService.isNotNullOrEmptyOrUndefined2(event.updatedDataView) && event.updatedDataView) {
                this.fetchapprovalInformationByFormRoleId(event, this.keyRestrictions["employeeGlobalId"], false);
            }
        }

        if (this.utilityService.isNotNullOrEmptyOrUndefined(event.validationMsg)) {
            this.validationMsg = event.validationMsg;
        }

        var effectiveDate = null;

        if (this.effectiveDate != null && this.effectiveDate != undefined) {
            effectiveDate = this.employeeService.convertTime12to24(this.effectiveDate);
        }
        else {
            effectiveDate = this.employeeService.convertTime12to24(new Date());
        }

        this.additionalValue = {
            "featureCode": "profile",
            "customFieldsFirst": event.eventCode,
            "effectiveDate": effectiveDate
        }

        this.keyRestrictions["effectiveDate"] = effectiveDate;

        //fetchEffectiveDatedCB
        this.http.get<any>("employee/effective-dated?employeeGlobalId=" + this.keyRestrictions["employeeGlobalId"] + "&effectiveDate=" + effectiveDate, this.options).subscribe(personalData => {
            this.formCode = event.formCode;
            this.flowCode = event.flowCode;

            if (this.utilityService.isNotNullOrEmptyOrUndefined(personalData.payload.list[0].countryCode))
                this.keyRestrictions["countryCode"] = personalData.payload.list[0].countryCode
            if (this.utilityService.isNotNullOrEmptyOrUndefined(personalData.payload.list[0].countryCode))
                this.keyRestrictions["businessunitCode"] = personalData.payload.list[0].businessunitCode


            let customFieldsConfiguration = event.customFieldsConfiguration;

            if (this.utilityService.isNotNullOrEmptyOrUndefined(customFieldsConfiguration)) {
                let list = JSON.parse(customFieldsConfiguration);

                for (let customField of list) {
                    if (customField.customFieldType == 'customFieldsFirst') {
                        let value = personalData.payload.list[0][customField.fieldName];

                        if (value != undefined)
                            this.additionalValue['customFieldsFirst'] = value;
                        else
                            this.additionalValue['customFieldsFirst'] = null;
                    }

                    if (customField.customFieldType == 'customFieldsSecond') {
                        let value = personalData.payload.list[0][customField.fieldName];

                        if (value != undefined)
                            this.additionalValue['customFieldsSecond'] = value;
                        else
                            this.additionalValue['customFieldsSecond'] = null;
                    }

                    if (customField.customFieldType == 'customFieldsThird') {
                        let value = personalData.payload.list[0][customField.fieldName];

                        if (value != undefined)
                            this.additionalValue['customFieldsThird'] = value;
                        else
                            this.additionalValue['customFieldsThird'] = null;
                    }

                    if (customField.customFieldType == 'customFieldsFourth') {
                        let value = personalData.payload.list[0][customField.fieldName];

                        if (value != undefined)
                            this.additionalValue['customFieldsFourth'] = value;
                        else
                            this.additionalValue['customFieldsFourth'] = null;
                    }
                }
            }

            this.selectedEvent = event;
            this.showEvent = true;
            this.loading = true;

            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.selectedEvent.notification)) {
                this.notification = this.selectedEvent.notification;
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.selectedEvent.neosuiteNotifications)) {
                this.neosuiteNotifications = this.selectedEvent.neosuiteNotifications
            }

            setTimeout(() => {
                this.loading = false;
            }, 100);
        });
    }

    showEventView() {
        this.additionalValue = {
            "featureCode": "update",
            "customFieldsFirst": null
        }

        this.formCode = null;
        this.selectedEvent = null;
        this.showEvent = false;
    }

    outputFromFormView(outPutFromChild) {
        if (outPutFromChild.selectedAction == "saveButton") {
            this.form_data = outPutFromChild.formDetails;

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.oldData)) {
                this.oldData = outPutFromChild.oldData;
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.updatedData)) {
                this.updatedData = outPutFromChild.updatedData.data;
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.formFileData)) {
                this.formFileData = outPutFromChild.formFileData;
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.totalFields)) {
                this.totalFields = outPutFromChild.totalFields;
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.deltaData)) {
                this.deltaData = outPutFromChild.deltaData;
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.deltaDIObj)) {
                this.deltaDIObj = outPutFromChild.deltaDIObj;
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.oldDataDisplayNames)) {
                this.oldDataDisplayNames = outPutFromChild.oldDataDisplayNames;
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.newDataDisplayNames)) {
                this.newDataDisplayNames = outPutFromChild.newDataDisplayNames;
            }

            this.formId = outPutFromChild.formId;
            this.form_data = outPutFromChild.formDetails;
            this.data = outPutFromChild.data;
            this.fileList = outPutFromChild.fileList;

            this.updateEmployeeProfileByApproval();
        }
        else if (outPutFromChild.selectedAction == "eventView") {
            this.selectedEvent = null;
            this.showEvent = false;
        }

        else if (outPutFromChild.selectedAction == "back") {
            this.showEventView();
        }
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

    fetchapprovalInformationByFormRoleId(event, employeeGlobalId, oneTimeUpdate) {
        this.http.get<any>("approvals/" + employeeGlobalId + "?formRoleId=" + event.id, this.options).subscribe(personalData => {
            this.approvalData = personalData.payload;

            if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.approvalData)) {
                var latelyApprovalData = this.approvalData[this.approvalData.length - 1];
                if (latelyApprovalData.status.statusName == "Open") {
                    var request = JSON.parse(latelyApprovalData.request);
                    this.employeeData = request.data;
                    if (oneTimeUpdate) {
                        this.oneTimeUpdatedView = true;
                    } else {
                        this.oneTimeUpdatedView = false;
                    }
                }
            }
        })
    }
}

