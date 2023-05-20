import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { ToastService } from '../../../services/toast.service';
import { WidgetService, UtilityService } from '@nw-workspace/common-services';
import { JsonFieldDTO } from '../../../model/JsonFieldDTO';
import { LogFieldDTO } from '../../../model/LogFieldDTO';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-log-field-configurator',
    templateUrl: './log-field-configurator.component.html',
    styleUrls: ['./log-field-configurator.component.css']
})

export class LogFieldConfiguratorComponent implements OnInit {
    constructor(private http: HttpClient, public widgetService: WidgetService,
        private toastService: ToastService, public utilityService: UtilityService) { }

    itemsPerPageToDisplay: number = 50;
    currentPage: number = 1;
    count: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    widgetWidth: number;
    sectionPage: boolean = true;
    fieldPage: boolean = false;
    createFieldFlag: boolean = false;
    updateFieldFlag: boolean = false;
    updateSectionFlag: boolean = false;
    loader: boolean = false;
    fieldDisplayFlag: boolean = true;

    apiList: any[] = [];
    eventList: any[] = [];
    sectionList: any[] = [];
    fieldList: any[] = [];
    fieldSourceList: any[] = [{ "sourceName": "MDM" }, { "sourceName": "PickList" }];
    fieldTypeList: any[] = [{ "fieldType": "Input" }, { "fieldType": "DateTime" }, { "fieldType": "Bit" }, { "fieldType": "Date" }, { "fieldType": "Select" }, { "fieldType": "Json" }, { "fieldType": "Autocomplete" }];

    logFieldDto: LogFieldDTO = new LogFieldDTO();
    fieldDto: JsonFieldDTO = new JsonFieldDTO();
    fieldDataList: JsonFieldDTO[] = [];
    logFieldList: JsonFieldDTO[] = [];
    oldLogField: any;
    selectedSecton: any;
    instances: any;
    cdnUrl = environment.cdnPath;

    ngOnInit(): void {
        this.getEventList();
    }

    ngAfterViewInit() {
        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });

        erdUltraFast.listenTo(document.getElementById("log_fields"), element => {
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

    onFieldTypeSelect(fieldType) {
        if (fieldType == 'Select' || fieldType == 'DateTime')
            this.fieldDisplayFlag = false;
        else
            this.fieldDisplayFlag = true;
    }

    resetData() {
        this.logFieldDto.sectionName = null;
        this.logFieldDto.sectionCode = null;
        this.sectionList = [];
        this.updateSectionFlag = false;
        this.updateFieldFlag = false;
        this.pageRefresh();
        this.selectRefresh();
    }

    openFieldModal(data) {
        var elems = document.getElementById("section_field_modal");
        this.instances = M.Modal.init(elems, {
            dismissible: false
        });

        this.instances.open();
        this.logFieldDto = Object.assign({}, data);
        this.logFieldDto.fields = [];

        if (this.fieldDataList.length == 0)
            this.fieldDataList.push(new JsonFieldDTO());
    }

    addNewField() {
        if (this.fieldDataList.length == 0)
            this.fieldDataList.push(new JsonFieldDTO());

        if (this.fieldDataList.length > 0 && this.fieldDataList[this.fieldDataList.length - 1].fieldTitle != null)
            this.fieldDataList.push(new JsonFieldDTO());

        this.pageRefresh();
    }

    openFieldPage(sectionCode) {
        this.loader = true;
        this.fieldPage = true;
        this.sectionPage = false;

        let field = this.fieldList[this.logFieldDto.sectionCode];
        if (field.length != 0)
            this.logFieldDto.fields = field;
        else
            this.logFieldDto.fields = [];

        this.count = this.logFieldDto.fields.length;
        this.logFieldList = this.logFieldDto.fields;
        this.actionButtonsDisplay();

        this.loaderOff(700);
    }

    closeFieldPage() {
        this.loader = true;
        this.sectionPage = true;
        this.fieldPage = false;
        this.createFieldFlag = false;
        this.fieldDataList = [];
        this.count = this.sectionList.length;
        this.logFieldDto.sectionName = null;
        this.logFieldDto.sectionCode = null;
        this.logFieldDto.fields = [];
        this.loaderOff(1000);
        this.pageRefresh();
    }

    removeField(index) {
        this.fieldDataList.splice(index, 1);
        this.pageRefresh();
    }

    addFields(button) {
        this.loader = true;
        if (button == 'Save') {
            this.logFieldDto.fields.push(...this.fieldDataList);

            this.logFieldDto.fields = this.logFieldDto.fields.filter(item => {
                return item.fieldName != null || item.fieldTitle != null;
            });

            this.logFieldDto.fields = this.logFieldDto.fields.filter((v, i, a) => a.findIndex(t =>
                (t.fieldName === v.fieldName)) === i);

            if (this.createFieldFlag)
                this.saveField();

        } else {
            this.fieldDataList = [];
            this.updateFieldFlag = false;
            this.instances.close();
            this.pageRefresh();
        }

        this.loaderOff(1000);
    }

    getEventList() {
        this.eventList = [];
        this.http.get<any>("json-configuration/event").subscribe(response => {
            this.eventList = response.payload.list;
            this.pageRefresh();
        });
    }

    saveField() {
        this.logFieldDto.status="save";
        this.http.post<any>("section", this.logFieldDto).subscribe(response => {
            this.fieldDataList = [];
            this.logFieldDto.fields = [];
            this.toastService.success("Saved");
            this.updateFieldFlag = false;
            this.getSectionList();
            this.pageRefresh();
        });
    }

    updateFields() {
        this.loader = true;
        this.logFieldDto.fields = this.logFieldDto.fields.filter(item => item.fieldName !== this.fieldDataList[0].fieldName);
        this.logFieldDto.fields.push(...this.fieldDataList);
        this.saveField();
    }

    saveSection() {
        if (this.utilityService.isNullOrEmptyOrUndefined(this.logFieldDto.sectionName) || this.utilityService.isNullOrEmptyOrUndefined(this.logFieldDto.sectionName.trim())) {
            this.toastService.error("Section Name is Empty");
            return;
        } else if (this.utilityService.isNullOrEmptyOrUndefined(this.logFieldDto.sectionCode) || this.utilityService.isNullOrEmptyOrUndefined(this.logFieldDto.sectionCode.trim())) {
            this.toastService.error("Section Code is Empty");
            return;
        }

        this.logFieldDto.sectionName = this.logFieldDto.sectionName.trim();
        this.logFieldDto.sectionCode = this.logFieldDto.sectionCode.trim();
        this.logFieldDto.status="save";
        
        this.http.post<any>("section", this.logFieldDto).subscribe(response => {
            this.logFieldDto = response.payload;
            this.fieldDataList = [];
            if (!this.updateSectionFlag)
                this.toastService.success("Saved");
            else
                this.toastService.success("Updated");

            this.getSectionList();
            this.resetData();
            this.pageRefresh();
        });
    }

    getSectionList() {
        if (!this.fieldPage)
            this.resetData();

        this.fieldList = [];
        this.loader = true;

        this.http.get<any>("section?eventType=" + this.logFieldDto.eventType).subscribe(response => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(response.payload)) {
                this.sectionList = response.payload.sectionList;
                this.fieldList = response.payload.fieldMap;
                this.count = this.sectionList.length;
                this.actionButtonsDisplay();

                if (this.fieldPage)
                    this.openFieldPage(this.logFieldDto.sectionCode);

                this.loaderOff(500);
                this.pageRefresh();
            } else {
                this.loader = false;
                this.toastService.warning("Record Not Found");
            }
        });

    }

    deleteSection() {
        this.loader = true;
        this.logFieldDto.status = "delete"
        this.http.put<any>("section", this.logFieldDto).subscribe(response => {
            this.logFieldDto = response.payload;
            this.toastService.success("Deleted");
            this.logFieldDto.sectionName = null;
            this.logFieldDto.sectionCode = null;
            this.getSectionList();
            this.pageRefresh();
        });
        this.loaderOff(1000);
    }

    deleteField(fieldName) {
        this.loader = true;
        this.logFieldDto.fields = this.logFieldDto.fields.filter(item => item.fieldName !== fieldName)

        this.http.put<any>("section", this.logFieldDto).subscribe(response => {
            this.toastService.success("delete");
            this.getSectionList();
            this.pageRefresh();
        });
    }


    openUpdateFieldModal(sectionCode) {
        this.loader = true;
        var elems = document.getElementById("section_field_modal");
        this.instances = M.Modal.init(elems, {
            dismissible: false
        });

        this.instances.open();
        let field = this.fieldList[sectionCode];

        if (field.length != 0)
            this.logFieldDto.fields = field;
        else
            this.logFieldDto.fields.push(new JsonFieldDTO());

        this.loaderOff(500);
        this.pageRefresh();
    }

    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.sectionList) {
            this.sectionList[k].actionButtonsList = [];
            this.sectionList[k].actionButtonsList.push(this.actionButtonsObjectCreation("editSection", "Edit Section", this.cdnUrl + "/Hub/edit"));
            this.sectionList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewFieldButton", "View Fields", this.cdnUrl + "/Hub/view"));
            this.sectionList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteSection", "Delete Section", this.cdnUrl + "/Hub/close"));
        }

        if (this.fieldPage) {
            for (var k in this.logFieldDto.fields) {
                this.logFieldDto.fields[k].actionButtonsList = [];
                this.logFieldDto.fields[k].actionButtonsList.push(this.actionButtonsObjectCreation("editField", "Edit Field", this.cdnUrl + "/Hub/view"));
                this.logFieldDto.fields[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteField", "Delete Field", this.cdnUrl + "/Hub/close"));
            }
        }
    }

    outputFromListView(outPutFromChild) {
        debugger
        if (outPutFromChild.selectedAction == "viewFieldButton") {
            let section = outPutFromChild.listDetails;
            this.logFieldDto.sectionName = section.sectionName;
            this.logFieldDto.sectionCode = section.sectionCode;
            this.openFieldPage(this.logFieldDto.sectionCode);
        } else if (outPutFromChild.selectedAction == "editSection") {
            let section = outPutFromChild.listDetails;
            this.logFieldDto.sectionName = section.sectionName;
            this.logFieldDto.sectionCode = section.sectionCode;
            this.logFieldDto.fields = this.fieldList[this.logFieldDto.sectionCode];
            this.updateSectionFlag = true;
        } else if (outPutFromChild.selectedAction == "deleteSection") {
            let section = outPutFromChild.listDetails;
            this.logFieldDto.sectionName = section.sectionName;
            this.logFieldDto.sectionCode = section.sectionCode;
            this.deleteSection();
        } else if (outPutFromChild.selectedAction == "editField") {
            let field = outPutFromChild.listDetails;
            this.fieldDto = new JsonFieldDTO();
            this.fieldDto = Object.assign({}, field);

            var elems = document.getElementById("section_field_modal");
            this.instances = M.Modal.init(elems, {
                dismissible: false
            });

            this.updateFieldFlag = true;
            this.instances.open();
            this.fieldDataList.push(this.fieldDto);
        } else if (outPutFromChild.selectedAction == "deleteField") {
            let field = outPutFromChild.listDetails;
            this.deleteField(field.fieldName);
        } else if (outPutFromChild.listDetails == 'add' && outPutFromChild.selectedAction == "applicationButton") {
            var elems = document.getElementById("section_field_modal");
            this.instances = M.Modal.init(elems, {
                dismissible: false
            });

            this.createFieldFlag = true;
            this.instances.open();
            this.addNewField();
        }
    }

}
