import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from "@angular/common/http";
import { UtilityService, WidgetService } from '@nw-workspace/common-services';
import { formatDate } from "@angular/common";
import { ToastService } from '../../../services/toast.service';
import { AuditEventFieldDTO } from '../../../model/AuditEventFieldDTO';
import { AuditActionFieldDTO } from '../../../model/AuditActionFieldDTO';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-event-log-configuration',
    templateUrl: './event-log-configuration.component.html',
    styleUrls: ['./event-log-configuration.component.css']
})

export class EventLogConfigurationComponent implements OnInit {
    configCode: any;
    viewNeoConfig: boolean;
    constructor(private http: HttpClient, public widgetService: WidgetService,
        private toastService: ToastService, public utilityService: UtilityService) { }

    itemsPerPageToDisplay: number = 50;
    currentPage: number = 0;
    count: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    searchKey: string = "";
    widgetWidth: number;

    eventList: any[] = [];
    eventLogDto: AuditEventFieldDTO = new AuditEventFieldDTO();
    eventJsonList: AuditEventFieldDTO[] = [];
    eventPage: boolean = true;
    createEventJsonPage: boolean = false;
    eventJsonListPage: boolean = true;

    actionList: any[] = [];
    actionLogDto: AuditActionFieldDTO = new AuditActionFieldDTO();
    actionJsonList: AuditActionFieldDTO[] = [];
    actionPage: boolean = false;
    createActionJsonPage: boolean = false;
    actionJsonListPage: boolean = true;

    updateFlag: boolean = false;
    fieldType: string = "Event";

    ngOnInit(): void {
        this.getEventList();
        this.pageRefresh();
    }

    ngAfterViewInit() {
        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });

        erdUltraFast.listenTo(document.getElementById("hub_event_field"), element => {
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
            M.AutoInit();
        }, 0);
    }

    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect()
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

    fetchRecordFilter(event: any) {
        this.fieldType = event;

        if (this.fieldType == 'Event') {
            this.getEventList();
            this.eventJsonListPage = true;
            this.actionJsonListPage = false;
            this.eventPage = true;
        } else if (this.fieldType == 'Action') {
            this.getActionList();
            this.eventJsonListPage = false;
            this.actionJsonListPage = true;
            this.actionPage = true;
        }

        this.pageRefresh();
    }


    createButton() {
        if (this.fieldType == 'Event') {
            this.eventLogDto = new AuditEventFieldDTO();
            this.createEventJsonPage = true;
            this.eventJsonListPage = false;
        } else if (this.fieldType == 'Action') {
            this.actionLogDto = new AuditActionFieldDTO();
            this.createActionJsonPage = true;
            this.actionJsonListPage = false;
        }

        this.updateFlag = false;
        this.pageRefresh();
    }

    backButton() {
        if (this.fieldType == 'Event') {
            this.createEventJsonPage = false;
            this.eventJsonListPage = true;
        } else if (this.fieldType == 'Action') {
            this.createActionJsonPage = false;
            this.actionJsonListPage = true;
        }
        this.pageRefresh();
    }

    getEventList() {
        this.http.get<any>("event").subscribe(response => {
            let eventList = response.payload.eventList;
            this.eventList = [];

            if (this.utilityService.isNotNullOrEmptyOrUndefined(eventList)) {
                for (let eventData of eventList) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(JSON.parse(eventData.dataInjection).eventType)) {
                        eventData.eventType = JSON.parse(eventData.dataInjection).eventType;
                        this.eventList.push(eventData);
                    }
                }
            }

            this.getJsonList();
            this.pageRefresh();
        });
    }

    getActionList() {
        this.http.get<any>("action").subscribe(response => {
            let actionList = response.payload.actionList;
            this.actionList = [];

            if (this.utilityService.isNotNullOrEmptyOrUndefined(actionList)) {
                for (let actionData of actionList) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(JSON.parse(actionData.dataInjection).actionType)) {
                        actionData.actionType = JSON.parse(actionData.dataInjection).actionType;
                        this.actionList.push(actionData);
                    }
                }
            }

            this.getJsonList();
            this.pageRefresh();
        });
    }

    saveJsonData() {
        if (this.fieldType == 'Event') {

            if (this.utilityService.isNullOrEmptyOrUndefined(this.eventLogDto.eventType)) {
                this.toastService.warning("Event type is empty")
                return false
            }
            if (this.utilityService.isNullOrEmptyOrUndefined(this.eventLogDto.fieldJson)) {
                this.toastService.warning("Field Json is empty")
                return false
            }

            this.http.post<any>("json-configuration/event", this.eventLogDto).subscribe(response => {
                this.eventLogDto = response.payload.dto;
                this.getJsonList();

                if (!this.updateFlag)
                    this.toastService.success("waiting for Approval");
                else
                    this.toastService.success("waiting for Approval");

                this.createEventJsonPage = false;
                this.eventJsonListPage = true;
                this.updateFlag = false;
                this.pageRefresh();
            });
        } else if (this.fieldType == 'Action') {
            if (this.utilityService.isNullOrEmptyOrUndefined(this.actionLogDto.actionType)) {
                this.toastService.warning("Action type is empty")
                return false
            }

            if (this.utilityService.isNullOrEmptyOrUndefined(this.actionLogDto.fieldJson)) {
                this.toastService.warning("Field Json is empty")
                return false
            }

            this.http.post<any>("json-configuration/action", this.actionLogDto).subscribe(response => {
                this.actionLogDto = response.payload.dto;
                this.getJsonList();

                if (!this.updateFlag)
                    this.toastService.success("Saved");
                else
                    this.toastService.success("Updated");

                this.createActionJsonPage = false;
                this.actionJsonListPage = true;
                this.updateFlag = false;
                this.pageRefresh();
            });
        }

    }

    deleteJsonData(data) {
        if (this.fieldType == 'Event') {
            this.eventLogDto = new AuditEventFieldDTO();
            this.eventLogDto = Object.assign({}, data);

            this.http.put<any>("json-configuration/event", this.eventLogDto).subscribe(response => {
                this.eventLogDto = response.payload.dto;
                this.getJsonList();
                this.toastService.success("waiting for Approval");
                this.updateFlag = false;
                this.pageRefresh();
            });
        } else if (this.fieldType == 'Action') {
            this.actionLogDto = new AuditActionFieldDTO();
            this.actionLogDto = Object.assign({}, data);

            this.http.put<any>("json-configuration/action", this.actionLogDto).subscribe(response => {
                this.actionLogDto = response.payload.dto;
                this.getJsonList();
                this.toastService.success("waiting for Approval");
                this.updateFlag = false;
                this.pageRefresh();
            });
        }

    }

    getJsonList() {
        debugger
        if (this.fieldType == 'Event') {
            let url='';
            /* if(this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey))
                url = 'hub/json-configuration/event?searchKey=' + this.searchKey + '&size=' + this.itemsPerPageToDisplay + "&page=" + this.currentPage;
            else
                url = 'hub/json-configuration/event?size=' + this.itemsPerPageToDisplay + "&page=" + this.currentPage; */

            this.http.get<any>('json-configuration/event?searchKey=' + this.searchKey + '&size=' + this.itemsPerPageToDisplay + "&page=" + this.currentPage).subscribe(response => {
                this.eventJsonList = response.payload.list;

                for (let event of this.eventList) {
                    for (let json of this.eventJsonList) {
                        if (event.eventCode == json.eventType)
                            json.eventName = event.eventName;
                    }
                }

                this.count = response.payload.totalItems;
                this.actionButtonsDisplay();
                this.pageRefresh();
            });
        } else if (this.fieldType == 'Action') {
            this.http.get<any>('json-configuration/action?searchKey=' + this.searchKey + '&size=' + this.itemsPerPageToDisplay + "&page=" + this.currentPage).subscribe(response => {
                this.actionJsonList = response.payload.list;

                for (let action of this.actionList) {
                    for (let json of this.actionJsonList) {
                        if (action.actionCode == json.actionType)
                            json.actionName = action.actionName;
                    }
                }

                this.count = response.payload.totalItems;
                this.actionButtonsDisplay();
                this.pageRefresh();
            });
        }
    }

    updateJson(data) {
        if (this.fieldType == 'Event') {
            this.eventLogDto = new AuditEventFieldDTO();
            this.eventLogDto = Object.assign({}, data);

            this.createEventJsonPage = true;
            this.eventJsonListPage = false;

            this.updateFlag = true;
        } else if (this.fieldType == 'Action') {
            this.actionLogDto = new AuditActionFieldDTO();
            this.actionLogDto = Object.assign({}, data);

            this.createActionJsonPage = true;
            this.actionJsonListPage = false;

            this.updateFlag = true;
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
        
        if (this.fieldType == 'Event') {
            for (var k in this.eventJsonList) {
                this.eventJsonList[k].actionButtonsList = [];
                this.eventJsonList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewLogButton", "View",environment.cdnPath+"/Hub/view"));
                this.eventJsonList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteLogButton", "Delete",environment.cdnPath+"/Hub/close"));
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.eventJsonList[k].neoConfigCode)) {
                    this.eventJsonList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
                }
            }
        } else if (this.fieldType == 'Action') {
            for (var k in this.actionJsonList) {
                this.actionJsonList[k].actionButtonsList = [];
                this.actionJsonList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewLogButton", "View",environment.cdnPath+"/Hub/view"));
                this.actionJsonList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteLogButton", "Delete",environment.cdnPath+"/Hub/close"));
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.actionJsonList[k].neoConfigCode)) {
                    this.actionJsonList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
                }
            }
        }
    }

    outputFromListView(outPutFromChild) {
        if (outPutFromChild.selectedAction == "viewLogButton") {
            let json = outPutFromChild.listDetails;
            this.updateJson(json);
        } else if (outPutFromChild.selectedAction == "deleteLogButton") {
            let json = outPutFromChild.listDetails;
            this.deleteJsonData(json);
        } else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
            this.getJsonList();
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchKey = outPutFromChild.listDetails;
            this.getJsonList();
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.getJsonList();
        } else if (outPutFromChild.listDetails == 'add' && outPutFromChild.selectedAction == "applicationButton") {
            this.createButton();
        } else if (outPutFromChild.selectedAction == "viewNeoConfig") {
            this.configCode = outPutFromChild.listDetails.neoConfigCode;
            this.openNeoConfigModal();
        }

    }

    openNeoConfigModal() {
        this.viewNeoConfig = true;
    }

}
