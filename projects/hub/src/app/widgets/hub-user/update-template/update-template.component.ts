import { Component, OnInit, Input, AfterViewInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as M from "materialize-css/dist/js/materialize";
import { formatDate } from "@angular/common";
import { CompleterService, CompleterData, RemoteData, CompleterItem } from 'ng2-completer';
import { DomSanitizer } from "@angular/platform-browser";
import { UtilityService } from '../../../services/utility.service';
import { ToastService, SessionService, WidgetService } from '@nw-workspace/common-services';
import { EmployeeService } from '../../../services/employee.service';
import { MdmService } from '../../../services/mdm.service';
import { SdmService } from '../../../services/sdm.service';
import { environment } from 'projects/hub/src/environments/environment.prod';

declare var $: any;
declare var require: any;

@Component({
    selector: 'app-update-template',
    templateUrl: './update-template.component.html',
    styleUrls: ['./update-template.component.css']
})

export class UpdateTemplateComponent implements OnInit {
    deltaDIObj: any;
    deltaData: any;
    deltaObj: any = {};
    deltaDats: any = {};
    validationMsg: boolean;
    rquestProcessing: boolean = false;
    neosuiteNotifications: any;
    preferredLang: any;
    employeeInfo: any;
    currentApprovalAssignment: any = {};
    approvalAssignmentList: any = [];
    latelyApprovalData: any = {};
    updatedDataViewFlag: boolean = false;
    oneTimeUpdateFlag: boolean = false;
    oneTimeUpdatedView: boolean = false;
    employeeData: any;
    approvalData: any;
    newDataDisplayNames: any = {};
    oldDataDisplayNames: any = {};
    totalFields: any = {};
    notification: any;
    formId: any;
    effectiveDateView: boolean = false;
    currentEvent: any;
    previousEffectiveDate: Date = new Date();
    formFileData: any;
    loading: boolean = false;
    updatedData: any;
    oldData: any;
    data: any;
    fileList: any = [];
    additionalValue: any = {};
    formCode: any;
    flowCode: any;
    showEvent: boolean = true;
    selectedEvent: any;
    form_data: FormData;
    personalDetail: any;
    clonedPersonal: any;
    widgetWidth: number;
    options: { headers: HttpHeaders; };
    headers: HttpHeaders;
    effectiveDate: Date;
    currentUser: any;
    loader: boolean=false;
    cdnUrl = environment.cdnPath;
    convoAI: boolean = false;

    @Input("visibleEventView") visibleEventView: any;
    @Input("eventList") eventList: any;
    @Input("actionList") actionList: any;
    @Input("keyRestrictions") keyRestrictions: any;
    @Input("currentEmployeeId") currentEmployeeId: string;
    @Input("appCode") appCode: any;
    @Input("widgetCode") widgetCode: any;
    @Input("component") component: any;
    @Input("viewId") viewId: number;
    @Input("employeeViewPage") employeeViewPage: boolean;
    @Input("temporaryClientCode") temporaryClientCode: string;
    @Input("movementsTaskId") movementsTaskId: string;
    @Input("disabledButton") disabledButton: boolean;
    @ViewChild("listDiv", { static: false }) listDiv: ElementRef;
    @Output() nameEvent = new EventEmitter<boolean>();
    @Output() outPutToParentComponent = new EventEmitter();
    @Output() outputFromEhubUpdateTemplate = new EventEmitter<boolean>();

    constructor(private sanitizer: DomSanitizer, private toastService: ToastService, private http: HttpClient, private sessionService: SessionService, private widgetService: WidgetService, private sdmService: SdmService, private completerService: CompleterService, private utilityService: UtilityService, private mdmService: MdmService, private employeeService: EmployeeService) {
        this.currentUser = this.sessionService.getCurrentUser().sessionDTO;
    }

    ngOnInit() {
        debugger
        this.preferredLang = this.sessionService.getCurrentUser().additionalDetails.mdm.preferredLang;
        this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username
        this.actionList;
        if (!this.visibleEventView) {
            if (this.eventList.length == 1) {
                this.fetchEventForm(this.eventList[0]);
            } else {
                this.showEvent = false
            }
        } else {
            this.showEvent = false
        }
        this.effectiveDate = new Date();
        this.generateHeaders();

    }

    generateHeaders() {
        this.keyRestrictions["effectiveDate"] = this.employeeService.convertTime12to24(new Date());
        this.headers = new HttpHeaders();

        if (this.component == "updateclient") {
            this.headers = this.headers.append('Client-Code', this.keyRestrictions["clientCode"]);
        }
        this.headers = this.headers.append('App-Code', this.appCode);
        if (this.component == undefined) {
            this.component = "update";
            this.headers = this.headers.append('Component', "update");
        }
        else {
            this.headers = this.headers.append('Component', this.component);
            if (this.temporaryClientCode != undefined || this.temporaryClientCode != null) {
                this.headers = this.headers.append('Client-Code', this.temporaryClientCode);
            }
        }
        this.options = { headers: this.headers };
    }


    ngAfterViewInit() {
        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("update_maindiv"), element => {
            this.onResizedEvent(element);
        });
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


    showEventView() {
        this.additionalValue = {
            "featureCode": "update",
            "customFieldsFirst": null
        }
        this.effectiveDateView = false;
        this.oneTimeUpdateFlag = false;
        this.updatedDataViewFlag = false;
        this.formCode = null;
        this.flowCode = null;
        this.selectedEvent = null;
        if (!this.visibleEventView) {
            if (this.eventList.length == 1) {
                this.back();
            }
        } else {
            this.showEvent = false;
        }

        this.outputFromEhubUpdateTemplate.emit(false);
    }

    back() {
        this.employeeViewPage = false;
        this.nameEvent.emit(this.employeeViewPage);
    }

    updateEmployeeByApproval() {
        this.loader=true;
        if (!this.rquestProcessing) {
            this.rquestProcessing = true;
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


            var data = { component: "update", predata: this.oldData, data: this.data.data, applicationCode: this.appCode, formCode: this.formCode, flowCode: this.flowCode, formFileData: this.formFileData, eventId: null, eventCode: eventCode, actionCode: actionCode, updateAPICode: this.data.updateAPICode, formId: this.formId, notification: this.notification, totalFields: this.totalFields, oldDataDisplayNames: this.oldDataDisplayNames, newDataDisplayNames: this.newDataDisplayNames, roleFormId: this.selectedEvent.id, movementsTaskId: this.movementsTaskId, neosuiteNotifications: this.neosuiteNotifications, routineId: routineId, customDataFlow: customDataFlow, oldApprovalFlowFlag: oldApprovalFlowFlag, deltaData: this.deltaData, deltaDIObj: this.deltaDIObj };
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
                this.fetchEventForm(this.selectedEvent)
                this.rquestProcessing = false;
                this.loader=false;
            }, err => {
                this.rquestProcessing = false;
                this.loader=false;
            });

        } else {
            this.toastService.success("Request under process");
            this.loader=false;
        }
    }




    generateEffectiveHeaders(date) {

        this.headers = new HttpHeaders();
        if (this.component == "updateclient")
            this.headers = this.headers.append('Client-Code', this.keyRestrictions["clientCode"]);
        this.headers = this.headers.append('App-Code', this.appCode);
        if (this.component == undefined)
            this.headers = this.headers.append('Component', "update");
        else
            this.headers = this.headers.append('Component', this.component);
        if (date != undefined && date != null)
            this.headers = this.headers.append('Effective-Date', date);
        this.options = { headers: this.headers };
    }


    outputFromFormView(outPutFromChild) {

        if (outPutFromChild.selectedAction == "saveButton") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.oldData)) {
                this.oldData = outPutFromChild.oldData;
            }
            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.updatedData)) {
                this.updatedData = outPutFromChild.updatedData.data;
            }
            this.formId = outPutFromChild.formId;
            this.form_data = outPutFromChild.formDetails;
            this.data = outPutFromChild.data;
            this.fileList = outPutFromChild.fileList;

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.deltaDIObj)) {
                this.deltaDIObj = outPutFromChild.deltaDIObj;
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.deltaData)) {
                this.deltaData = outPutFromChild.deltaData;
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.formFileData)) {
                this.formFileData = outPutFromChild.formFileData;
            }
            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.totalFields)) {
                this.totalFields = outPutFromChild.totalFields;
            }
            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.oldDataDisplayNames)) {
                this.oldDataDisplayNames = outPutFromChild.oldDataDisplayNames;
            }
            if (this.utilityService.isNotNullOrEmptyOrUndefined(outPutFromChild.newDataDisplayNames)) {
                this.newDataDisplayNames = outPutFromChild.newDataDisplayNames;
            }

            this.updateEmployeeByApproval();
        }
        else if (outPutFromChild.selectedAction == "eventView") {
            this.selectedEvent = null;
        }

        else if (outPutFromChild.selectedAction == "back") {
            this.showEventView();
        }
        else if (outPutFromChild.selectedAction == "effectiveDate") {
            this.openTriggerModal();
        }


    }

    fetchEventForm(event) {
        if(event.convoAI){
            this.convoAI = true;
        }
        this.employeeData = null;
        this.oneTimeUpdatedView = false;
        if (this.utilityService.isNullOrEmptyOrUndefined(this.effectiveDate)) {
            this.effectiveDate = new Date();
        }

        if (this.utilityService.isNotNullOrEmptyOrUndefined(event.validationMsg)) {
            this.validationMsg = event.validationMsg;
        }

        if (this.utilityService.isNotNullOrEmptyOrUndefined(event.effectiveDateView)) {
            this.effectiveDateView = event.effectiveDateView;
            if (this.oneTimeUpdateFlag) {
                this.oneTimeUpdateFlag = false;
            }
            if (this.updatedDataViewFlag) {
                this.updatedDataViewFlag = false;
            }
        } else {
            this.effectiveDateView = false;
            if (this.utilityService.isNotNullOrEmptyOrUndefined2(event.oneTimeUpdate) && event.oneTimeUpdate) {
                this.fetchapprovalInformationByFormRoleId(event, this.keyRestrictions["employeeGlobalId"], true);
            } else if (this.utilityService.isNotNullOrEmptyOrUndefined2(event.updatedDataView) && event.updatedDataView) {
                this.fetchapprovalInformationByFormRoleId(event, this.keyRestrictions["employeeGlobalId"], false);
            }
        }
        var effectiveDate = null;
        if (this.effectiveDate != null && this.effectiveDate != undefined) {
            effectiveDate = this.employeeService.convertTime12to24(this.effectiveDate);
        }
        else {
            effectiveDate = this.employeeService.convertTime12to24(new Date());
        }
        this.additionalValue = {
            "featureCode": this.component,
            "customFieldsFirst": event.eventCode,
            "effectiveDate": effectiveDate
        }
        if(this.utilityService.isNotNullOrEmptyOrUndefined(this.keyRestrictions.effectiveStartDate)){
            effectiveDate = this.keyRestrictions.effectiveStartDate;
            this.keyRestrictions["effectiveDate"] = effectiveDate;
             var [date,time] = effectiveDate.split( ' ' );
             var [hours, minutes, seconds] = time.split( ':' );
             effectiveDate = date + ' ' + 23 + ':' + 59 + ':' + 50;   
        }
            
        this.keyRestrictions["effectiveDate"] = effectiveDate;
        this.component;
        //fetchEffectiveDatedCB
        this.http.get<any>("employee/effective-dated?employeeGlobalId=" + this.keyRestrictions["employeeGlobalId"] + "&effectiveDate=" + effectiveDate + "&component=" + this.component, this.options).subscribe(personalData => {
            this.formCode = event.formCode;
            this.flowCode = event.flowCode;

            if (this.utilityService.isNotNullOrEmptyOrUndefined(personalData.payload.list) && personalData.payload.list.length > 0) {
                this.previousEffectiveDate = this.effectiveDate;
                if (this.utilityService.isNotNullOrEmptyOrUndefined(personalData.payload.list[0].countryCode))
                this.keyRestrictions["countryCode"] = personalData.payload.list[0].countryCode
                if (this.utilityService.isNotNullOrEmptyOrUndefined(personalData.payload.list[0].businessunitCode))
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
                this.loader=false;
                this.showEvent = true;
                this.loading = true;
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.selectedEvent.notification)) {
                    this.notification = this.selectedEvent.notification
                }

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.selectedEvent.neosuiteNotifications)) {
                    this.neosuiteNotifications = this.selectedEvent.neosuiteNotifications
                }
                setTimeout(() => {
                    this.loading = false;
                    this.loader=false;

                }, 100);
            } else {
                this.effectiveDate = this.previousEffectiveDate
                this.toastService.warning("Record not found for selected date")
                this.loader=false;
            }
        }, err => {
            this.loader=false;
        });



    }

    openTriggerModal() {
        var elemodal = document.getElementById('trigger_Event');
        var instance = M.Modal.init(elemodal, {});

        instance.open();

    }

    closeTriggerModal() {
        var elemodal = document.getElementById('trigger_Event');
        var instance = M.Modal.init(elemodal, {});

        instance.close();
    }

    selectDate() {

        this.fetchEventForm(this.selectedEvent);

        this.closeTriggerModal()
    }

    openApprovalDetailsModal() {
        var elemodal = document.getElementById('approvalDetailsModal');
        var instance = M.Modal.init(elemodal, {});
        instance.open();
    }

    closeApprovalDetailsModal() {
        var elemodal = document.getElementById('approvalDetailsModal');
        var instance = M.Modal.init(elemodal, {});
        instance.close();
    }

    fetchapprovalInformationByFormRoleId(event, employeeGlobalId, oneTimeUpdate) {
        this.http.get<any>("approvals/" + employeeGlobalId + "?formRoleId=" + event.id, this.options).subscribe(personalData => {
            this.approvalData = personalData.payload;

            if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.approvalData)) {
                this.latelyApprovalData = this.approvalData[this.approvalData.length - 1];
                if (this.latelyApprovalData.status.statusName == "Open") {
                    var request = JSON.parse(this.latelyApprovalData.request);
                    this.employeeData = request.data;
                    if (oneTimeUpdate) {
                        this.oneTimeUpdatedView = true;
                        this.oneTimeUpdateFlag = true;
                    } else {
                        this.oneTimeUpdatedView = false;
                        this.updatedDataViewFlag = true;
                    }
                }
            }
        })
    }

    getApprovalAssignmentByApprovalId() {
        var empIds = [];

        this.http.get<any>("approvals/assignment?approvalId=" + this.latelyApprovalData.id, this.options).subscribe(approvalAssignmentData => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined2(approvalAssignmentData)) {
                this.approvalAssignmentList = approvalAssignmentData.payload
            } else {
                this.toastService.error("Approval Details not found");
            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.approvalAssignmentList)) {
                for (var approvalAssignment of this.approvalAssignmentList) {
                    if (approvalAssignment.status.statusName == "Open") {
                        this.currentApprovalAssignment = approvalAssignment;
                        break;
                    }
                }
                empIds.push(this.latelyApprovalData.createdBy);
                empIds.push(this.currentApprovalAssignment.assignedTo);
                this.fetchEmployeeName(empIds);
                this.openApprovalDetailsModal();
            }

        })


    }

    fetchEmployeeName(empIds) {
        if (this.utilityService.isNotNullOrEmptyOrUndefined(empIds)) {
            this.employeeService.getEmployee(empIds).subscribe(data => {
                this.employeeInfo = data;
            })

        }
    }


}
