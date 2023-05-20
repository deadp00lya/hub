import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { ToastService } from '../../../services/toast.service';
import { WidgetService, UtilityService } from '@nw-workspace/common-services';
import { RoutineDTO } from '../../../model/RoutineDTO';
import { RoutineFieldDTO } from '../../../model/RoutineFieldDTO';
import { environment } from 'projects/hub/src/environments/environment.prod';


declare var $: any;
declare var require: any;

@Component({
    selector: 'app-hub-routine',
    templateUrl: './hub-routine.component.html',
    styleUrls: ['./hub-routine.component.css']
})

export class HubRoutineComponent implements OnInit {
    configCode: any;
    viewNeoConfig: boolean;
    constructor(private http: HttpClient, public widgetService: WidgetService,
        private toastService: ToastService, public utilityService: UtilityService) { }

    itemsPerPageToDisplayRoutine: number = 50;
    currentPageRoutine: number = 1;
    countRoutine: any;
    itemsPerPageToDisplayField: number = 50;
    currentPageField: number = 1;
    countField: any;

    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    searchKey: string = '';
    widgetWidth: number;

    routineDto: RoutineDTO = new RoutineDTO();
    routineList: RoutineDTO[] = [];

    routineFieldDto: RoutineDTO = new RoutineDTO();
    routineFieldList: RoutineFieldDTO[] = [];

    createRoutinePage: boolean = true;
    createRoutineFieldPage: boolean = false;
    updateRoutineFieldFlag: boolean = false;

    ngOnInit(): void {
        this.getRoutineList();
        this.pageRefresh();
    }

    ngAfterViewInit() {
        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });

        erdUltraFast.listenTo(document.getElementById("hub_routine"), element => {
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

    resetRoutineData() {
        this.routineDto = new RoutineDTO();
        this.pageRefresh();
    }

    resetRoutineFieldData() {
        this.routineDto.fieldDto = new RoutineFieldDTO();
        this.pageRefresh();
    }

    createFieldButton(data) {
        this.routineDto = new RoutineDTO();
        this.routineDto = Object.assign({}, data);
        this.routineDto.fieldDto = new RoutineFieldDTO();
        this.routineFieldList = [];

        this.getRoutineFieldList();

        this.createRoutinePage = false;
        this.createRoutineFieldPage = true;
        this.updateRoutineFieldFlag = false;

        this.pageRefresh();
    }

    backButton() {
        this.routineDto = new RoutineDTO();
        this.createRoutineFieldPage = false;
        this.createRoutinePage = true;

        this.pageRefresh();
    }

    saveRoutineData() {
        if (this.utilityService.isNullOrEmptyOrUndefined(this.routineDto.routineName)) {
            this.toastService.error("Routine Name Empty");
            return;
        } else if (this.utilityService.isNullOrEmptyOrUndefined(this.routineDto.routineCode)) {
            this.toastService.error("Routine Code Empty");
            return;
        } else {
            this.routineDto.routineCode = this.routineDto.routineCode.trim();
            this.routineDto.routineName = this.routineDto.routineName.trim();
        }

        this.http.post<any>("routine", this.routineDto).subscribe(response => {
            this.routineDto = response.payload.dto;
            this.resetRoutineData();
            this.getRoutineList();
            this.toastService.success("waiting for Approval");

            this.pageRefresh();
        });
    }

    deleteRoutine(data) {
        this.routineDto = new RoutineDTO();
        this.routineDto = Object.assign({}, data);

        this.http.put<any>("routine", this.routineDto).subscribe(response => {
            this.routineDto = new RoutineDTO();
            this.getRoutineList();
            this.toastService.error("Deleted");
            this.pageRefresh();
        });
    }

    getRoutineList() {
        this.http.get<any>('routine?searchKey=' + this.searchKey + '&size=' + this.itemsPerPageToDisplayRoutine + "&page=" + this.currentPageRoutine).subscribe(response => {
            this.routineList = response.payload.list;
            this.countRoutine = response.payload.totalItems;
            this.actionButtonsDisplay();
            this.pageRefresh();
        });
    }

    updateRoutine(data) {
        this.routineDto = new RoutineDTO();
        this.routineDto = Object.assign({}, data);

        var domElement = document.getElementById("hub_routine") as HTMLElement;
        domElement.scrollTop = 0;
    }

    saveRoutineFieldData() {
        if (this.utilityService.isNullOrEmptyOrUndefined(this.routineDto.fieldDto.name)) {
            this.toastService.error("Field Name Empty");
            return;
        } else if (this.utilityService.isNullOrEmptyOrUndefined(this.routineDto.fieldDto.iD)) {
            this.toastService.error("Field Id Empty");
            return;
        } else {
            this.routineDto.fieldDto.name = this.routineDto.fieldDto.name.trim();
            this.routineDto.fieldDto.iD = this.routineDto.fieldDto.iD.trim();
        }

        this.http.post<any>("routine/field", this.routineDto).subscribe(response => {
            this.routineDto.fieldDto = new RoutineFieldDTO();
            this.getRoutineFieldList();

            if (!this.updateRoutineFieldFlag)
                this.toastService.success("Saved");
            else
                this.toastService.success("Updated");

            this.updateRoutineFieldFlag = false;
            this.pageRefresh();
        });
    }

    deleteRoutineField(data) {
        this.routineDto = new RoutineDTO();
        this.routineDto = Object.assign({}, data);

        this.http.put<any>("routine/field", this.routineDto).subscribe(response => {
            this.routineDto.fieldDto = new RoutineFieldDTO();
            this.getRoutineFieldList();
            this.toastService.error("Deleted");
            this.updateRoutineFieldFlag = false;
            this.pageRefresh();
        });
    }

    getRoutineFieldList() {
        this.http.get<any>('routine/field?searchKey=' + this.searchKey + '&size=' + this.itemsPerPageToDisplayField + "&page=" + this.currentPageField + "&routineCode=" + this.routineDto.routineCode).subscribe(response => {
            this.routineFieldList = response.payload.list;
            this.countField = response.payload.totalItems;
            this.actionButtonsDisplay();
            this.pageRefresh();
        });
    }

    updateRoutineField(data) {
        this.routineDto = new RoutineDTO();
        this.routineDto = Object.assign({}, data);

        this.updateRoutineFieldFlag = true;

        var domElement = document.getElementById("hub_routine") as HTMLElement;
        domElement.scrollTop = 0;
    }

    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.routineList) {
            if (this.createRoutinePage) {
                this.routineList[k].actionButtonsList = [];
                this.routineList[k].actionButtonsList.push(this.actionButtonsObjectCreation("createFieldButton", "View/Create Field",environment.cdnPath+"/Hub/view"));
                this.routineList[k].actionButtonsList.push(this.actionButtonsObjectCreation("routineUpdateButton", "Update Routine",environment.cdnPath+"/Hub/edit"));
                this.routineList[k].actionButtonsList.push(this.actionButtonsObjectCreation("routineDeleteButton", "Delete",environment.cdnPath+"/Hub/close"));
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.routineList[k].neoConfigCode)) {
                    this.routineList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
                }
            }
        }

        for (var k in this.routineFieldList) {
            if (this.createRoutineFieldPage) {
                this.routineFieldList[k].actionButtonsList = [];
                this.routineFieldList[k].actionButtonsList.push(this.actionButtonsObjectCreation("updateFieldButton", "Update Field",environment.cdnPath+"/Hub/edit"));
                this.routineFieldList[k].actionButtonsList.push(this.actionButtonsObjectCreation("fieldDeleteButton", "Delete",environment.cdnPath+"/Hub/close"));
            }
        }
    }

    outputFromListView(outPutFromChild) {
        if (outPutFromChild.selectedAction == "createFieldButton") {
            let routine = outPutFromChild.listDetails;
            this.createFieldButton(routine);
        } else if (outPutFromChild.selectedAction == "routineUpdateButton") {
            let routine = outPutFromChild.listDetails;
            this.updateRoutine(routine);
        } else if (outPutFromChild.selectedAction == "routineDeleteButton") {
            let routine = outPutFromChild.listDetails;
            this.deleteRoutine(routine);
        } else if (outPutFromChild.selectedAction == "updateFieldButton") {
            let routine = outPutFromChild.listDetails;
            this.routineDto.fieldDto.iD = routine.iD;
            this.routineDto.fieldDto.name = routine.name;
            this.updateRoutineField(this.routineDto);
        } else if (outPutFromChild.selectedAction == "fieldDeleteButton") {
            let routine = outPutFromChild.listDetails;
            this.routineDto.fieldDto.iD = routine.iD;
            this.routineDto.fieldDto.name = routine.name;
            this.deleteRoutineField(this.routineDto);
        } else if (outPutFromChild.selectedAction == "listViewRowSize") {
            if (this.createRoutinePage) {
                this.itemsPerPageToDisplayRoutine = outPutFromChild.listDetails;
                this.getRoutineList();
            }

            if (this.createRoutineFieldPage) {
                this.itemsPerPageToDisplayField = outPutFromChild.listDetails;
                this.getRoutineFieldList();
            }
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchKey = outPutFromChild.listDetails;

            if (this.createRoutinePage) {
                this.getRoutineList();
            }

            if (this.createRoutineFieldPage) {
                this.getRoutineFieldList();
            }
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.createRoutinePage) {
                this.currentPageRoutine = outPutFromChild.listDetails.page;
                this.itemsPerPageToDisplayRoutine = outPutFromChild.listDetails.size;
                this.getRoutineList();
            }

            if (this.createRoutineFieldPage) {
                this.currentPageField = outPutFromChild.listDetails.page;
                this.itemsPerPageToDisplayField = outPutFromChild.listDetails.size;
                this.getRoutineFieldList();
            }

        } else if (outPutFromChild.selectedAction == "viewNeoConfig") {
            this.configCode = outPutFromChild.listDetails.neoConfigCode;
            this.openNeoConfigModal();
        }
    }

    openNeoConfigModal() {
        this.viewNeoConfig = true;
    }
    
    triggered($event){
        this.viewNeoConfig = $event;
    }

}
