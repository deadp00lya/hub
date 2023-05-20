import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from "@angular/common/http";
import { UtilityService, WidgetService } from '@nw-workspace/common-services';
import { formatDate } from "@angular/common";
import { ToastService } from '../../../services/toast.service';
import { ActionLogDTO } from '../../../model/ActionLogDTO';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-hub-action-log',
    templateUrl: './hub-action-log.component.html',
    styleUrls: ['./hub-action-log.component.css']
})

export class HubActionLogComponent implements OnInit {
    constructor(private http: HttpClient, public widgetService: WidgetService,
        private toastService: ToastService, public utilityService: UtilityService) { }

    itemsPerPageToDisplay: number = 50;
    currentPage: number = 1;
    count: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    searchKey: string = '';
    widgetWidth: number;

    businessUnitList: any[] = [];
    actionLogsList: any[] = [];
    actionLogDataMdm: any;
    eventList: any[] = [{ eventCode: 'JDC' }];
    collapsibleValues: any;

    actionLogData: ActionLogDTO = new ActionLogDTO();
    actionLogListView: boolean = true;
    actionLogDataView: boolean = false;

    ngOnInit() {
        this.getBusinessUnitList();
        this.setDateData();

        this.selectRefresh();
        this.pageRefresh();
    }

    ngAfterViewInit() {
        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });

        erdUltraFast.listenTo(document.getElementById("hub_action_log"), element => {
            this.onResizedEvent(element);
        });

        document.addEventListener("DOMContentLoaded", function () {
            $('.preloader-background ').delay(5000).fadeOut(' slow');
            $('.preloader-wrapper ')
                .delay(5000)
                .fadeOut();
        });

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

    setDate(setValue: string) {
        return formatDate(setValue, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }

    collabsibleClick(item) {
        this.collapsibleValues = item.value;
        this.pageRefresh();
    }

    setDateData() {
        let currentDate = new Date();
        var dateOffset = (24 * 60 * 60 * 1000) * 7;

        this.actionLogData.toDate = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
        this.actionLogData.fromDate = formatDate(currentDate.getTime() - dateOffset, 'yyyy-MM-dd HH:mm:ss', 'en-US');

        this.pageRefresh();
    }

    viewLogData(data) {
        this.actionLogListView = false;
        this.actionLogDataView = true;

        this.actionLogData = new ActionLogDTO();
        this.actionLogData.rev = data.REV;
        this.actionLogData.eventType = data.eventType;
        this.actionLogData.employeeGlobalId = data.employeeGlobalId;

        this.fetchActionLogData();
        this.pageRefresh();
    }

    backToListView() {
        this.actionLogListView = true;
        this.actionLogDataView = false;

        this.setDateData();
        this.pageRefresh();
    }

    getBusinessUnitList() {
        this.businessUnitList = [];

        this.http.get<any>("businessunit").subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response)) {
                this.businessUnitList = response.payload.list;
            }
            this.pageRefresh();
        });
    }

    fetchActionLogList() {
        this.actionLogsList = [];
        this.actionLogData.page = this.currentPage - 1;
        this.actionLogData.size = this.itemsPerPageToDisplay;
        this.actionLogData.searchString = this.searchKey;

        this.http.post<any>("fetchActionLogsList", this.actionLogData).subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response)) {
                this.actionLogsList = response.payload.event;
                this.count = response.payload.totalItems;
                this.actionButtonsDisplay();
            }
            this.pageRefresh();
        });

    }

    fetchActionLogData() {
        this.actionLogDataMdm = null;

        this.http.post<any>("fetchActionLogData", this.actionLogData).subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response)) {
                this.actionLogDataMdm = response.payload;
                this.count = response.payload.totalItems;
                this.actionButtonsDisplay();
            }
            this.pageRefresh();
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
        for (var k in this.actionLogsList) {
            this.actionLogsList[k].actionButtonsList = [];
            this.actionLogsList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewLogButton", "View",environment.cdnPath+"/Hub/view"));
        }
    }

    outputFromListView(outPutFromChild) {
        if (outPutFromChild.selectedAction == "viewLogButton") {
            let audit = outPutFromChild.listDetails;
            this.viewLogData(audit);
        } else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
            this.fetchActionLogList();
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchKey = outPutFromChild.listDetails;
            this.fetchActionLogList();
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.fetchActionLogList();
        }

    }
}
