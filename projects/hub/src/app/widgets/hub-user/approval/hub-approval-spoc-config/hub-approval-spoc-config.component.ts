import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from '@angular/common/http';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { UtilityService } from 'projects/hub/src/app/services/utility.service';
import { WidgetService, SessionService } from '@nw-workspace/common-services';
import { RoleEventMappingDTO } from 'projects/hub/src/app/model/RoleEventMappingDTO';
import { RoleFormMappingDTO } from 'projects/hub/src/app/model/RoleFormMappingDTO';
import { SpocMappingDTO } from 'projects/hub/src/app/model/SpocMappingDTO';
import { SpocRegionDTO } from 'projects/hub/src/app/model/SpocRegionDTO';
import { EmployeeService } from 'projects/hub/src/app/services/employee.service';
import { ToastService } from 'projects/hub/src/app/services/toast.service';
import { ApplicationDTO } from 'projects/neosuite/src/app/models/ApplicationDTO';
declare var require: any;
declare var $: any;

@Component({
    selector: 'hub-approval-spoc-config',
    templateUrl: './hub-approval-spoc-config.component.html',
    styleUrls: ['./hub-approval-spoc-config.component.css']
})

export class HubApprovalSpocConfigComponent implements OnInit {
    inputVariableNotificationTo: any = {};
    neosuiteNotifications: any = {};
    showNeosuiteNotificationConfiguration: boolean = false;
    suggestions2: any = [];
    inputVariableBCC: any = {};
    currentSpocIndex: number;
    showMailConfiguration: boolean = false;
    allActionRoles: any = [{ "roleName": "Approved", "roleIdentifier": "approved" }, { "roleName": "Rejected", "roleIdentifier": "rejected" }, { "roleName": "Cancelled", "roleIdentifier": "cancelled" }]
    inputVariableTo: any = {};
    inputVariableCC: any = {};
    notification: any = {};
    approvedByTemplateCode: any;
    showInputBoxApprovedByTemplateCodeFlag: boolean = false;
    approvalSpocConfiguration: boolean;
    dataService1: CompleterData;
    fieldMasterList: any;
    formControl: boolean;
    suggestions: any = [];
    allApis: any = [];
    flag: boolean;
    message: string;
    value: boolean = true;
    component: string;
    widgetComponents: any;
    formsList: any;
    listOfRoles: any;
    listOfApplications: any;
    apiList: any;
    EventformList: any;
    roleCodeId: number;
    neosuiteRoleList: any;

    employeeInfo: any = {};
    autoComplete: any = [];
    autoComplete1: any = []
    roleCode: number;
    formId: number;
    eventId: number;
    widgetWidth: number;
    roleList: any;
    formList: any;
    events: any;
    spocList: SpocRegionDTO[] = [];
    eventRoleId: number;
    roleForm: number;
    spoc: SpocRegionDTO = new SpocRegionDTO();
    spocRecord: SpocRegionDTO;
    actionRoles: any = {};
    showSpoc: boolean = false;
    spocConfigs: any = [];
    showDynamic: boolean[];
    dataService: CompleterData;
    employeeList: any = {};
    spocdemo: any = [];
    spocValue: any = {};
    companyCode: any;
    currentClient = this.sessionService.getCurrentUser().additionalDetails.mdm.clientCode;
    applicationDTO: ApplicationDTO = new ApplicationDTO();
    roleFormMappingDTO: RoleFormMappingDTO = new RoleFormMappingDTO();
    @ViewChild("dynamicSpoc", { static: false }) dynamicSpoc: ElementRef;
    @Output() approvalEvent = new EventEmitter<boolean>();
    @Input("roleId") roleId: any;
    configCode: any;
    viewNeoConfig: boolean;
    detailedIcon: boolean = false;

    constructor(private http: HttpClient, private widgetService: WidgetService, private toastService: ToastService, private completerService: CompleterService, private sessionService: SessionService, private utilityService: UtilityService, private employeeService: EmployeeService) {
        this.currentClient = this.sessionService.getCurrentUser().additionalDetails.mdm.clientCode;
    }
    
    ngOnInit() {
        debugger
        //        this.showMailConfiguration = true;
        //        this.notification.approved = {};
        //        this.notification.approved.mails = [];
        //        this.notification.approved.mails[0] = {};
        //
        //        this.notification.rejected = {};
        //        this.notification.rejected.mails = [];
        //        this.notification.rejected.mails[0] = {};
        //
        //        this.notification.cancelled = {};
        //        this.notification.cancelled.mails = [];
        //        this.notification.cancelled.mails[0] = {};
        //
        //        this.inputVariableTo.push( [] );
        //        this.inputVariableCC.push( [] );

        //        this.fetchApplicationFromNeosuite();
        //        this.fetchNeosuiteRoles();
        //        this.fetchAllWidgetComponent();
        //        this.fetchEvent();
        this.fetchSpocRegion(this.roleId, false);
        this.fetchActionRoles();
        this.fetchEmployeeList();
        this.fetchApi();     

    }

    ngAfterViewInit() {
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {});
        });
        setTimeout(function () {
            M.AutoInit();
        }, 10);



        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("viewSpoc"), element => {
            this.onResizedEvent(element);
        });
    }



    //  ------------Refresh Functions---------------


    selectRefresh() {

        setTimeout(function () {
            this.spoc = new SpocRegionDTO();
            this.formList = undefined;
            this.roleCode = undefined;
            this.actionRoles = undefined
            this.spocList = new SpocRegionDTO();
            $('select').formSelect();
            M.updateTextFields();
        }, 10);
    }


    Refresh() {
        setTimeout(() => {
            $('select').formSelect();
            M.updateTextFields();
        }, 10);
    }

    eventStopProp(e) {
        e.stopPropagation();
    }


    //  ------------Responsive Functions---------------                              


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



    //  ------------Application Role And Form Methods For Form--------------- 



    fetchApplicationFromNeosuite() {
        this.http.get<any>("employeeMaster/fetchApplicationsFromNeosuite").subscribe(data => {
            this.listOfApplications = data.payload;
            this.selectRefresh();
        })

    }


    fetchRolesFromNeosuite() {
        this.spocList = [];
        this.listOfRoles = [];
        this.formsList = [];
        this.roleCode = null;
        this.formId = null;

        this.http.get<any>("employeeMaster/fetchApplicationRolesFromNeosuite?applicationName=" + this.applicationDTO.appName).subscribe(data => {
            this.listOfRoles = data.payload;
            this.selectRefresh();
        })

    }


    loadForm(roleFormId) {
        this.roleCodeId = roleFormId;
        if (this.roleCodeId != null || this.roleCodeId != undefined) {
            this.fetchSpocRegion(this.roleCodeId, this.spoc.eventConfig);
            this.toastService.success("Configuration loaded");
        } else {
            this.toastService.error("Configuration not found");
        }

    }


    //  ------------Role And EventForm Methods For EventConfiguration---------------



    //    fetchEvent() {
    //        this.http.get<any>( "employeeMaster/fetchEvents" ).subscribe( data => {
    //            this.events = data.payload;
    //            this.selectRefresh();
    //        } )
    //    }

    fetchNeosuiteRoles() {
        this.http.get<any>("employeeMaster/fetchApplicationsRolesNeosuite").subscribe(data => {

            this.neosuiteRoleList = data.payload;
            this.selectRefresh();
        })
    }

    /* Method Not used*/
    fetchFormList(roleCode) {
        this.formList = [];
        this.EventformList = [];
        this.spocList = [];
        if (this.spoc.eventConfig == true) {
            this.http.get<any>("employeeMaster/fetchEventFormByRole?roleCode=" + roleCode).subscribe(forms => {
                this.EventformList = forms.payload;
                this.Refresh();
            })

        } else {
            this.http.get<any>("employeeMaster/fetchFormsConfigurations?roleCode=" + roleCode).subscribe(forms => {
                this.formList = forms.payload;
                this.Refresh();
            })
        }
    }

    fetchActionRoles() {
        //fetchActionRole
        this.http.get<any>("primary-role").subscribe(data => {
            this.actionRoles = data.payload;
            this.selectRefresh();
        })
    }


    loadForm2(eventFormId) {
        this.eventRoleId = eventFormId;
        if (this.eventRoleId != null || this.eventRoleId != undefined) {
            this.fetchSpocRegion(this.eventRoleId, this.spoc.eventConfig);
            this.toastService.success("Configuration loaded");
        } else {
            this.toastService.success("Configuration not found");
        }

    }



    //  ------------Fetch Spoc Add Spoc Remove Spoc---------------


    fetchSpocRegion(id, eventConfig) {

        this.spocList = [];
        this.autoComplete = [];
        this.http.get<any>("spoc?id=" + id + "&eventConfig=" + eventConfig).subscribe(data => {
            debugger
            if(this.utilityService.isNotNullOrEmptyOrUndefined(data.payload) && 
             this.utilityService.isNotNullOrEmptyOrUndefined(data.payload[0].id))
                this.spocList = data.payload;

            if(this.utilityService.isNotNullOrEmptyOrUndefined(data.payload[0].neoConfigCode))
            this.configCode = data.payload[0].neoConfigCode;

            if(this.utilityService.isNotNullOrEmptyOrUndefined(this.configCode))
               this.detailedIcon = true;

            var spocname;
            this.spocList.forEach(spocname => {
                this.spocdemo.push(spocname.spoc)
            })

            this.fetchEmployeeName();

            $(".selectdis").addClass("selectdisclasss");
            document.addEventListener('DOMContentLoaded', function () {
                var elems = document.querySelectorAll('.collapsible');
                var instances = M.Collapsible.init(elems, {});
            });


            this.selectRefresh();

        })
    }


    fetchData(i) {
        var temp;

        if (i == 0) {
            var j = 0;
            while (j < this.actionRoles.length) {
                if (this.actionRoles[j].actionRoleName == "Assigner" || this.actionRoles[j].actionRoleName == "Assignee") {
                    this.actionRoles.splice(j, 1);
                    j = 0;
                }
                j++
            }
        } else {
            this.fetchActionRoles();
        }
        this.Refresh();
    }


    addSpoc() {
        let spoc = new SpocRegionDTO();

        spoc.eventRole = new RoleEventMappingDTO();
        spoc.formRole = new RoleFormMappingDTO();
        if (this.eventRoleId != null || this.eventRoleId != undefined) {
            spoc.eventRole.id = this.eventRoleId;
        } else {
            spoc.formRole.id = this.roleId;
        }



        this.spocList.push(spoc);

        $(".selectdis").addClass("selectdisclasss");
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {});
        });


        this.selectRefresh();


    }

    removeSpoc(i) {
        this.spocList.splice(i, 1);
        this.autoComplete.splice(i, 1);

        this.selectRefresh();
    }


    saveSpocConfig() {
        
        this.value = true;
        this.message = "";
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.roleId)) {

            for (var i = 0; i < this.spocList.length; i++) {

                if (this.spocList[i].staticConfig) {
                    if (this.utilityService.isNullOrEmptyOrUndefined(this.spocList[i].spoc)) {
                        this.value = false;
                        this.message = "Add spoc"
                        break;
                    }
                } else {
                    if (this.spocList[i].formControl) {
                        if (this.utilityService.isNullOrEmptyOrUndefined(this.spocList[i].fieldName)) {
                            this.value = false;
                            this.message = "Select FieldName"
                            break;
                        }
                    } else if (!this.spocList[i].formControl) {
                        if (this.utilityService.isNullOrEmptyOrUndefined(this.spocList[i].apiurl.id)) {
                            this.value = false;
                            this.message = "Select api"
                            break;
                        } else if (this.utilityService.isNullOrEmptyOrUndefined(this.spocList[i].primaryRole.id)) {
                            this.value = false;
                            this.message = "Select primary role"
                            break;
                        }
                    }
                }

                this.spocList[i].level = i + 1;
                if (i == this.spocList.length - 1) {
                    this.spocList[i].finalApproval = true;
                } else {
                    this.spocList[i].finalApproval = false;
                }


            }

            if (this.value) {

                var spocMapping = new SpocMappingDTO();
                //                spocMapping.eventRoleId = this.eventRoleId;
                spocMapping.formRoleId = this.roleId;
                spocMapping.spocs = this.spocList;
                if(this.utilityService.isNotNullOrEmptyOrUndefined(this.configCode))
                spocMapping.neoConfigCode = this.configCode;


                this.http.post<any>("spoc", spocMapping).subscribe(data => {
                    this.reset();
                    this.fetchSpocRegion(this.roleId, false);
                    this.toastService.success("waiting for Approval");
                });
            } else {
                this.toastService.error(this.message);
            }
        } else {
            this.toastService.error("Configuration not found");
            this.reset();
        }
        $(".selectdis").addClass("selectdisclasss");
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {});
        });
    }

    fetchEmployeeName() {
        this.employeeInfo = [];
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.spocdemo)) {
            this.employeeService.getEmployee(this.spocdemo).subscribe(data => {
                this.employeeInfo = data;
                for (var s in this.spocList) {
                    if (this.spocList[s].spoc != undefined || this.spocList[s].spoc != null) {
                        this.autoComplete[s] = this.employeeInfo[this.spocList[s].spoc].employeeId + " " + this.employeeInfo[this.spocList[s].spoc].preferredName;
                    }

                    this.selectRefresh();
                }
            })

        }
    }

    fetchEmployeeList() {
        this.autoComplete;
        //fetchEmployeeName
        this.suggestions2 = this.completerService.remote("employee/", 'employeeId,preferredName', "employeeId,preferredName");
        this.suggestions2
    }

    reset() {
        this.spocList = [];
        this.eventId = undefined;
        this.component = undefined;
        this.formList = null;
        this.roleCode = undefined;
        this.eventRoleId = undefined;
        this.selectRefresh();
        this.formId = null;
        this.applicationDTO = null;
    }

    onItemSelect(event, i) {
        if (event != null) {
            if (event.originalObject.employeeId != null) {
                if (this.utilityService.isNotNullOrEmptyOrUndefined(event.originalObject.employeeGlobalId)) {
                    this.spocList[i].spoc = event.originalObject.employeeGlobalId;
                } else {
                    this.spocList[i].spoc = event.originalObject.employeeId;
                }
            }

            this.selectRefresh();
        }

    }

    fetchApi() {
        this.http.get<any>("api").subscribe(data => {
            this.apiList = data.payload.apiList;
            this.suggestions = this.completerService.local(this.apiList, 'apiName', 'apiName');

            setTimeout(() => {
                this.selectRefresh();
            }, 100);

        })
    }


    selectApi(event, spoc) {
        if (event.originalObject != null) {
            spoc.apiurl.id = event.originalObject.id;
        }

    }

    onItemSelectfield(event, i) {
        if (event != null) {
            if (event.originalObject.employeeId != null) {
                this.spocList[i].fieldName = event.originalObject.fieldName;
            } else {
                this.spocList[i].fieldName = event.originalObject.fieldName;
            }

            this.selectRefresh();
        }

    }

    skipApproval(i, value) {
        if (value) {
            this.spocList[i].skip = false;
        } else {
            this.spocList[i].skip = true;
        }

    }

    back() {
        this.approvalSpocConfiguration = false;
        this.approvalEvent.emit(this.approvalSpocConfiguration);
    }

    initializeEmails() {
        this.notification.approved = {};
        this.notification.approved.mails = [];
        this.notification.approved.mails[0] = {};

        this.notification.rejected = {};
        this.notification.rejected.mails = [];
        this.notification.rejected.mails[0] = {};

        this.notification.cancelled = {};
        this.notification.cancelled.mails = [];
        this.notification.cancelled.mails[0] = {};
    }

    inputVariabledToAndCCInitialization() {
        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableTo.approved)) {
            this.inputVariableTo.approved = [];
        }
        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableCC.approved)) {
            this.inputVariableCC.approved = [];
        }
        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableBCC.approved)) {
            this.inputVariableBCC.approved = [];
        }
        this.inputVariableTo.approved.push([]);
        this.inputVariableCC.approved.push([]);
        this.inputVariableBCC.approved.push([]);

        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableTo.rejected)) {
            this.inputVariableTo.rejected = [];
        }
        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableCC.rejected)) {
            this.inputVariableCC.rejected = [];
        }
        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableBCC.rejected)) {
            this.inputVariableBCC.rejected = [];
        }

        this.inputVariableTo.rejected.push([]);
        this.inputVariableCC.rejected.push([]);
        this.inputVariableBCC.rejected.push([]);

        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableTo.cancelled)) {
            this.inputVariableTo.cancelled = [];
        }
        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableCC.cancelled)) {
            this.inputVariableCC.cancelled = [];
        }
        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableBCC.cancelled)) {
            this.inputVariableBCC.cancelled = [];
        }

        this.inputVariableTo.cancelled.push([]);
        this.inputVariableCC.cancelled.push([]);
        this.inputVariableBCC.cancelled.push([]);

    }

    openEmailModal(i) {
        if (i > 0) {
            this.allActionRoles.splice(2, 1);
        } else {
            this.allActionRoles = [{ "roleName": "Approved", "roleIdentifier": "approved" }, { "roleName": "Rejected", "roleIdentifier": "rejected" }, { "roleName": "Cancelled", "roleIdentifier": "cancelled" }]
        }
        this.showMailConfiguration = true;
        this.inputVariabledToAndCCInitialization();
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.spocList[i].notification)) {
            this.notification = JSON.parse(this.spocList[i].notification);
            if (this.utilityService.isNullOrEmptyOrUndefined(this.notification.approved)) {
                this.notification.approved = {};
            }
            if (this.utilityService.isNullOrEmptyOrUndefined(this.notification.approved.mails)) {
                this.notification.approved.mails = [];
            }
            if (this.utilityService.isNullOrEmptyOrUndefined(this.notification.approved.mails[0])) {
                this.notification.approved.mails[0] = {};
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.notification.rejected)) {
                this.notification.rejected = {};
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.notification.rejected.mails)) {
                this.notification.rejected.mails = [];
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.notification.rejected.mails[0])) {
                this.notification.rejected.mails[0] = {};
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.notification.cancelled)) {
                this.notification.cancelled = {};
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.notification.cancelled.mails)) {
                this.notification.cancelled.mails = [];
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.notification.cancelled.mails[0])) {
                this.notification.cancelled.mails[0] = {};
            }

            this.iterateNotification(this.notification);

        } else {
            this.initializeEmails();
        }
        this.currentSpocIndex = i;
        setTimeout(function () {
            var elemodal = document.getElementById('notificationModal');
            var modalInstance = M.Modal.init(elemodal, {});

            modalInstance.open();
        }, 10);
        setTimeout(function () {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {});
            M.updateTextFields();
        }, 10);
    }

    closeEmailModal() {
        var elemodal = document.getElementById('notificationModal');
        var modalInstance = M.Modal.init(elemodal, {});

        modalInstance.close();
        this.showMailConfiguration = false;
    }

    removeMail(actionRoleIndentifier, idx) {
        this.notification[actionRoleIndentifier].mails.splice(idx, 1);
    }

    addMail(actionRoleIndentifier, idx) {
        if (this.utilityService.isNullOrEmptyOrUndefined(this.notification[actionRoleIndentifier].mails[idx].to)) {
            this.toastService.error("Enter the Mail Recipient");
        } else if (this.utilityService.isNullOrEmptyOrUndefined(this.notification[actionRoleIndentifier].mails[idx].templateCode)) {
            this.toastService.error("Enter Template Code");
        } else {
            this.notification[actionRoleIndentifier].mails.push({});
            this.inputVariableTo[actionRoleIndentifier].push([]);
            this.inputVariableCC[actionRoleIndentifier].push([]);
            this.inputVariableBCC[actionRoleIndentifier].push([]);
        }
    }

    chipAdded(actionRoleIndentifier: any, idx, mailConnector, j) {
        if (this.utilityService.isNullOrEmptyOrUndefined(this.notification[actionRoleIndentifier].mails[idx][mailConnector])) {
            this.notification[actionRoleIndentifier].mails[idx][mailConnector] = []
        }

        if (mailConnector == 'to') {
            this.notification[actionRoleIndentifier].mails[idx][mailConnector].push(this.inputVariableTo[actionRoleIndentifier][idx][j]);
            this.inputVariableTo[actionRoleIndentifier][idx][j] = "";
        } else if (mailConnector == 'cc') {
            this.notification[actionRoleIndentifier].mails[idx][mailConnector].push(this.inputVariableCC[actionRoleIndentifier][idx][j]);
            this.inputVariableCC[actionRoleIndentifier][idx][j] = "";
        }
        else if (mailConnector == 'bcc') {
            this.notification[actionRoleIndentifier].mails[idx][mailConnector].push(this.inputVariableBCC[actionRoleIndentifier][idx][j]);
            this.inputVariableBCC[actionRoleIndentifier][idx][j] = "";
        }

        setTimeout(() => {
            $('select').formSelect();

        }, 10);
    }

    chipRemoved(actionRoleIndentifier: any, idx, mailConnector, j) {
        this.notification[actionRoleIndentifier].mails[idx][mailConnector].splice(j, 1);
    }

    saveEmailCOnfiguration() {
        this.spocList[this.currentSpocIndex].notification = JSON.stringify(this.notification);
        this.closeEmailModal();
    }

    iterateNotification(notification) {
        for (var status in notification) {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(notification[status].mails)) {
                for (var idx in notification[status].mails) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(notification[status].mails[idx])) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(notification[status].mails[idx].to)) {
                            this.inputVariableTo[status][idx] = notification[status].mails[idx].to;

                            if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableCC[status][idx])) {
                                this.inputVariableCC[status][idx] = []
                            }
                            if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableBCC[status][idx])) {
                                this.inputVariableBCC[status][idx] = []
                            }

                        }
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(notification[status].mails[idx].cc)) {
                            this.inputVariableCC[status][idx] = notification[status].mails[idx].cc;

                            if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableTo[status][idx])) {
                                this.inputVariableTo[status][idx] = []
                            }
                            if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableBCC[status][idx])) {
                                this.inputVariableBCC[status][idx] = []
                            }

                        }
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(notification[status].mails[idx].bcc)) {
                            this.inputVariableBCC[status][idx] = notification[status].mails[idx].bcc;

                            if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableCC[status][idx])) {
                                this.inputVariableCC[status][idx] = []
                            }
                            if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableTo[status][idx])) {
                                this.inputVariableTo[status][idx] = []
                            }

                        }
                    }
                }
            }
        }
    }

    changeEscalations(actionRoleIndentifier: any, idx) {
        if (this.notification[actionRoleIndentifier].mails[idx].escalation) {
            this.notification[actionRoleIndentifier].mails[idx].escalation = false;
        } else {
            this.notification[actionRoleIndentifier].mails[idx].escalation = true;
        }
    }

    initializeNeosuiteNotifications() {
        this.neosuiteNotifications.approved = {};
        this.neosuiteNotifications.approved.notifications = [];
        this.neosuiteNotifications.approved.notifications[0] = {};

        this.neosuiteNotifications.rejected = {};
        this.neosuiteNotifications.rejected.notifications = [];
        this.neosuiteNotifications.rejected.notifications[0] = {};

        this.neosuiteNotifications.cancelled = {};
        this.neosuiteNotifications.cancelled.notifications = [];
        this.neosuiteNotifications.cancelled.notifications[0] = {};

    }


    inputVariabledNotificationToInitialization() {
        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableNotificationTo.approved)) {
            this.inputVariableNotificationTo.approved = [];
        }
        this.inputVariableNotificationTo.approved.push([]);

        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableNotificationTo.rejected)) {
            this.inputVariableNotificationTo.rejected = [];
        }

        this.inputVariableNotificationTo.rejected.push([]);

        if (this.utilityService.isNullOrEmptyOrUndefined(this.inputVariableNotificationTo.cancelled)) {
            this.inputVariableNotificationTo.cancelled = [];
        }

        this.inputVariableNotificationTo.cancelled.push([]);

    }

    openNeosuiteNotificationModal(i) {
        if (i > 0) {
            this.allActionRoles.splice(2, 1);
        } else {
            this.allActionRoles = [{ "roleName": "Approved", "roleIdentifier": "approved" }, { "roleName": "Rejected", "roleIdentifier": "rejected" }, { "roleName": "Cancelled", "roleIdentifier": "cancelled" }]
        }

        this.showNeosuiteNotificationConfiguration = true;
        this.inputVariabledNotificationToInitialization();

        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.spocList[i].neosuiteNotifications)) {
            this.neosuiteNotifications = JSON.parse(this.spocList[i].neosuiteNotifications);
            if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications.approved)) {
                this.neosuiteNotifications.approved = {};
            }
            if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications.approved.notifications)) {
                this.neosuiteNotifications.approved.notifications = [];
            }
            if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications.approved.notifications[0])) {
                this.neosuiteNotifications.approved.notifications[0] = {};
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications.rejected)) {
                this.neosuiteNotifications.rejected = {};
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications.rejected.notifications)) {
                this.neosuiteNotifications.rejected.notifications = [];
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications.rejected.notifications[0])) {
                this.neosuiteNotifications.rejected.notifications[0] = {};
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications.cancelled)) {
                this.neosuiteNotifications.cancelled = {};
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications.cancelled.notifications)) {
                this.neosuiteNotifications.cancelled.notifications = [];
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications.cancelled.notifications[0])) {
                this.neosuiteNotifications.cancelled.notifications[0] = {};
            }

            this.iterateNeosuiteNotification(this.neosuiteNotifications);

        } else {
            this.initializeNeosuiteNotifications();
        }

        this.currentSpocIndex = i;

        setTimeout(function () {
            var elemodal = document.getElementById('neosuiteNotificationSpocModal');
            var modalInstance = M.Modal.init(elemodal, {});

            modalInstance.open();
        }, 10);

        setTimeout(function () {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {});
            M.updateTextFields();
        }, 10);
    }

    closeNeosuiteNotificationModal() {
        var elemodal = document.getElementById('neosuiteNotificationSpocModal');
        var modalInstance = M.Modal.init(elemodal, {});

        modalInstance.close();
        this.showNeosuiteNotificationConfiguration = false;
    }

    removeNeosuiteNotification(actionRoleIndentifier, idx) {
        this.neosuiteNotifications[actionRoleIndentifier].notifications.splice(idx, 1);
    }

    addNeosuiteNotification(actionRoleIndentifier, idx) {
        if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications[actionRoleIndentifier].notifications[idx].to)) {
            this.toastService.error("Enter Notification Recipient");
        } else if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications[actionRoleIndentifier].notifications[idx].notifyValue)) {
            this.toastService.error("Enter Notify Value");
        } else {
            this.neosuiteNotifications[actionRoleIndentifier].notifications.push({});
            this.inputVariableNotificationTo[actionRoleIndentifier].push([]);
        }
    }

    notificationChipAdded(actionRoleIndentifier: any, idx, mailConnector, j) {
        if (this.utilityService.isNullOrEmptyOrUndefined(this.neosuiteNotifications[actionRoleIndentifier].notifications[idx][mailConnector])) {
            this.neosuiteNotifications[actionRoleIndentifier].notifications[idx][mailConnector] = []
        }

        if (mailConnector == 'to') {
            this.neosuiteNotifications[actionRoleIndentifier].notifications[idx][mailConnector].push(this.inputVariableNotificationTo[actionRoleIndentifier][idx][j]);
            this.inputVariableNotificationTo[actionRoleIndentifier][idx][j] = "";
        }

        setTimeout(() => {
            $('select').formSelect();

        }, 10);
    }

    notificationChipRemoved(actionRoleIndentifier: any, idx, mailConnector, j) {
        this.neosuiteNotifications[actionRoleIndentifier].notifications[idx][mailConnector].splice(j, 1);
    }

    saveNeosuiteNotificationConfiguration() {
        this.spocList[this.currentSpocIndex].neosuiteNotifications = JSON.stringify(this.neosuiteNotifications);
        this.closeNeosuiteNotificationModal();
    }

    iterateNeosuiteNotification(neosuiteNotifications) {
        for (var status in neosuiteNotifications) {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(neosuiteNotifications[status].notifications)) {
                for (var idx in neosuiteNotifications[status].notifications) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(neosuiteNotifications[status].notifications[idx])) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(neosuiteNotifications[status].notifications[idx].to)) {
                            this.inputVariableNotificationTo[status][idx] = neosuiteNotifications[status].notifications[idx].to;

                        }
                    }
                }
            }
        }
    }

    //Triggering from neoConfig
    triggered($event){
        this.viewNeoConfig = $event;
    }

    viewNeoConfig1(){
        debugger
        this.viewNeoConfig = true;
    }
}
