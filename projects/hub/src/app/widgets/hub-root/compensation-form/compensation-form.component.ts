import { Component, OnInit, Input } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { ToastService } from '../../../services/toast.service';
import { SessionService, UtilityService, WidgetService } from '@nw-workspace/common-services';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-compensation-form',
    templateUrl: './compensation-form.component.html',
    styleUrls: ['./compensation-form.component.css']
})

export class CompensationFormComponent implements OnInit {
    countryCode: any;
    businessunitCode: any;

    constructor(private http: HttpClient, public widgetService: WidgetService,
        private toastService: ToastService, public utilityService: UtilityService, private sessionService: SessionService) {
        this.currentUser = this.sessionService.getCurrentUser().username;
        this.clientCode = this.sessionService.getCurrentUser().additionalDetails.mdm.clientCode;
        this.appCode = "ehub";
    }

    @Input("keyRestrictions") keyRestrictions: any = new Map();
    @Input("appCode") appCode: any;

    clientCode: any;
    currentUser: any;
    formCode: any;
    itemsPerPageToDisplay: number = 50;
    currentPage: number = 1;
    count: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    searchKey: string = '';
    widgetWidth: number;
    employeeListPage: boolean = true;
    compensationFormView: boolean = false;
    compensationListPage: boolean = false;
    employeeList: any = [];
    compensationList: any = [];
    createFlag: boolean = false;
    selectedEmployee: any = null;
    effectiveData: any = false;
    pickListCode: any = "ComNameCAM";
    picklistValues: any;
    employeeGlobalId: any;

    ngOnInit(): void {
        this.getEmployeeList();
        this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username
        //this.fetchPayComponentNames();

    }

    ngAfterViewInit() {
        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });

        erdUltraFast.listenTo(document.getElementById("hub_compensation_form"), element => {
            this.onResizedEvent(element);
        });

        document.addEventListener("DOMContentLoaded", function () {
            $('.preloader-background ').delay(5000).fadeOut(' slow');
            $('.preloader-wrapper ')
                .delay(5000)
                .fadeOut();
        });

        $('.dropdown-trigger').dropdown({
            closeOnClick: false
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

    pageRefresh() {
        setTimeout(function () {
            M.updateTextFields();
        }, 0);
    }

    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect()
        }, 0);
    }

    backToEmployeeList() {
        this.compensationListPage = false;
        this.employeeListPage = true;
        this.selectedEmployee = null;

        this.itemsPerPageToDisplay = 50;
        this.currentPage = 1;

        this.getEmployeeList();
    }

    effectiveDataClick() {
        setTimeout(() => {
            this.getCompensationList(this.selectedEmployee, this.effectiveData);
        }, 100);
    }

    getEmployeeList() {
        this.employeeList = [];
        this.count = 0;
        this.http.get<any>('employees?size=' + this.itemsPerPageToDisplay + '&page=' + this.currentPage + '&searchKey=' + this.searchKey).subscribe(response => {
            this.employeeList = response.payload.list;
            this.count = response.payload.totalItems;
            this.actionButtonsDisplay();
            this.pageRefresh();
        });
    }

    getCompensationList(employeeGlobalId, effectiveData) {
        this.compensationList = [];
        this.count = 0;
        this.http.get<any>('compensation?employeeGlobalId=' + employeeGlobalId + '&effectiveData=' + effectiveData).subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response)) {
                this.compensationList = response.payload.list;
                for (let compensationIndex in this.compensationList) {
                    for (let picklistIndex in this.picklistValues) {
                        if (this.compensationList[compensationIndex].payComponentId === this.picklistValues[picklistIndex].fieldCode) {
                            this.compensationList[compensationIndex]["payComponentName"] = null;
                            this.compensationList[compensationIndex].payComponentName = this.picklistValues[picklistIndex].fieldName;
                        }
                    }
                }
                this.employeeGlobalId = response.payload.list[0].employeeGlobalId;
                this.count = response.payload.totalItems;
                this.actionButtonsDisplay();
                this.pageRefresh();
            }
            this.employeeGlobalId = employeeGlobalId;
            this.count = response.payload.totalItems;
            this.actionButtonsDisplay();
            this.pageRefresh();
        });
    }

    updateCompensation(apiCode, updatedCode) {

        this.http.post<any>('compensation?apiCode=' + apiCode, updatedCode).subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response.payload)) {
                this.compensationListPage = true;
                this.compensationFormView = false;

                this.getCompensationList(this.selectedEmployee, this.effectiveData);
            } else if (this.utilityService.isNotNullOrEmptyOrUndefined(response.description)) {
                this.toastService.error(response.description);
            }
        });
    }

    deleteCompensation(updatedCode, employeeGlobalId) {

        this.http.delete<any>('compensation?id=' + updatedCode.id).subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response.payload)) {
                this.getCompensationList(employeeGlobalId, this.effectiveData);
            } else if (this.utilityService.isNotNullOrEmptyOrUndefined(response.description)) {
                this.toastService.error(response.description);
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
        if (this.employeeListPage) {
            for (var k in this.employeeList) {
                this.employeeList[k].actionButtonsList = [];
                this.employeeList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewCompensationListButton", "View Compensation List", environment.cdnPath + "/Hub/view"));
            }
        } else if (this.compensationListPage) {
            for (var k in this.compensationList) {
                this.compensationList[k].actionButtonsList = [];
                this.compensationList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewCompensationFormButton", "View Compensation", environment.cdnPath + "/Hub/view"));
                this.compensationList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteCompensationButton", "Delete Compensation", environment.cdnPath + "/Hub/delete"));
            }
        }
    }

    outputFromListView(outPutFromChild) {
        debugger
        if (outPutFromChild.selectedAction == "viewCompensationListButton") {
            let data = outPutFromChild.listDetails;
            let employeeGlobalId = data.employeeGlobalId;
            this.selectedEmployee = employeeGlobalId;
            this.countryCode = outPutFromChild.listDetails.countryCode;
            this.businessunitCode = outPutFromChild.listDetails.businessunitCode;

            this.compensationListPage = true;
            this.employeeListPage = false;
            this.effectiveData = false;
            this.fetchPayComponentNames();

            this.getCompensationList(employeeGlobalId, this.effectiveData);
        } else if (outPutFromChild.selectedAction == "viewCompensationFormButton") {
            let data = outPutFromChild.listDetails;
            let employeeGlobalId = data.employeeGlobalId;

            this.createFlag = false;
            this.compensationListPage = false;
            this.compensationFormView = true;

            this.formCode = "CPNUD";
            this.keyRestrictions['clientCode'] = this.clientCode;
            this.keyRestrictions['employeeGlobalId'] = employeeGlobalId;
            this.keyRestrictions['payComponentId'] = data.payComponentId;
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.countryCode))
                this.keyRestrictions["countryCode"] = this.countryCode;
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.businessunitCode))
                this.keyRestrictions["businessunitCode"] = this.businessunitCode;
        } else if (outPutFromChild.selectedAction == "deleteCompensationButton") {
            let data = outPutFromChild.listDetails;
            let employeeGlobalId = data.employeeGlobalId;

            this.deleteCompensation(data, employeeGlobalId);
        } else if (outPutFromChild.listDetails == 'add' && outPutFromChild.selectedAction == "applicationButton") {
            let data = outPutFromChild.listDetails;

            this.createFlag = true;
            this.compensationListPage = false;
            this.compensationFormView = true;

            this.formCode = "CPNCR";
            this.keyRestrictions = {};
            this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username
            this.keyRestrictions["employeeGlobalId"] = this.employeeGlobalId;
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.countryCode))
                this.keyRestrictions["countryCode"] = this.countryCode;
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.businessunitCode))
                this.keyRestrictions["businessunitCode"] = this.businessunitCode;
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                this.searchKey = outPutFromChild.textToSearch;
            }
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;

            this.getEmployeeList();
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchKey = outPutFromChild.listDetails
            this.getEmployeeList();
        }

    }

    outputFromFormView(outPutFromChild) {
        if (outPutFromChild.selectedAction == "saveButton") {
            let apiCode = outPutFromChild.data.updateAPICode;
            let updatedCode = outPutFromChild.data.data;
            updatedCode['eventType'] = "CDC";
            //updatedCode['eventReason'] = "CDC Triggered";
            updatedCode["endEffective"] = true;

            if (this.createFlag) {
                updatedCode.approval = 9;
                updatedCode.employeeGlobalId = this.selectedEmployee;
            } else {
                updatedCode.effectiveStartDate = this.getNowUTC(updatedCode.effectiveStartDate);
                updatedCode.effectiveEndDate = this.getNowUTC(updatedCode.effectiveEndDate);
            }

            this.updateCompensation(apiCode, updatedCode);

        } else if (outPutFromChild.selectedAction == "back") {
            this.compensationListPage = true;
            this.compensationFormView = false;
        }
    }

    private getNowUTC(date) {
        if (this.utilityService.isNotNullOrEmptyOrUndefined(date)) {
            const now = new Date(date);
            return formatDate(now.getTime() + (now.getTimezoneOffset() * 60000), 'yyyy-MM-dd HH:mm:ss', 'en_US');
        } else
            return null;
    }
    /****************************Fetching payComponentId's fieldName and fieldCode picklist ********************************/
    fetchPayComponentNames() {

        let url = "picklist?pickListCode=" + this.pickListCode;
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.countryCode))
            url = url.concat("&countryCode=" + this.countryCode);
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.businessunitCode))
            url = url.concat("&businessunitCode=" + this.businessunitCode)
            
        this.http.get<any>(url).subscribe(response => {
            this.picklistValues = response.payload;
            //this.pageRefresh();
        });
    }

}
