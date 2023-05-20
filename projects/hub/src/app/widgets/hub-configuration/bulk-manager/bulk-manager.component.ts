import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UtilityService, WidgetService } from '@nw-workspace/common-services';
import { formatDate } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, FormsModule, NgModel } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-bulk-manager',
    templateUrl: './bulk-manager.component.html',
    styleUrls: ['./bulk-manager.component.css']
})

export class BulkManagerComponent implements OnInit {
    form: FormGroup;
    

    constructor(private http: HttpClient, public widgetService: WidgetService,
        private toastService: ToastService, public utilityService: UtilityService, private fb: FormBuilder) {
    }

    itemsPerPageToDisplay: number;
    currentPage: number = 1;
    count: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    searchKey: string = '';

    effectiveDate: Date = new Date();
    widgetWidth: number;
    bDto: any;
    newManagerList: any[] = [];
    oldManagerList: any[] = [];
    employeeList: any[] = [];
    selectedEmployeeList: any[] = [];
    employeeListValues: any[] = []
    oldManagerId: any;
    newManagerId: any;
    selectedManagerType: any;
    selectedManagerTypeName: any = 'Manager';
    pickListCode: any = "MTL";
    managerTypeList: any[] = [];
    headers: HttpHeaders = new HttpHeaders();
    options: { headers: HttpHeaders; };
    eventReason: any;

    ngOnInit(): void {
        this.form = this.fb.group({
            example: ''
        })
        this.headers = this.headers.append('content-type', "application/json");
                this.options = { headers: this.headers };

        this.fetchManagerTypeList();
    }

    ngAfterViewInit() {
        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });

        erdUltraFast.listenTo(document.getElementById("bulk_manager"), element => {
            this.onResizedEvent(element);
        });

        document.addEventListener("DOMContentLoaded", function () {
            $('.preloader-background ').delay(5000).fadeOut(' slow');
            $('.preloader-wrapper ')
                .delay(5000)
                .fadeOut();
        });

        $(document).ready(function () {
            $('.timepicker').timepicker();
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

    fetchManagerTypeList() {
        debugger
        //pickListValues
        this.http.get<any>("picklist?pickListCode="+this.pickListCode, this.options).subscribe(response => {
            this.managerTypeList = response.payload;
            this.pageRefresh();
        });
    }

    selectedManagerTypeMethod(event) {
        this.resetData();
        if (this.utilityService.isNotNullOrEmptyOrUndefined(event)) {
            this.selectedManagerType = event.fieldCode;
            this.selectedManagerTypeName = event.fieldName;
        } else {
            this.selectedManagerType = null;
            this.selectedManagerTypeName = 'Manager';
        }
    }

    fetchReportingManager() {
        this.http.get<any>("manager").subscribe(response => {
            this.oldManagerList = response.payload.list;
            this.pageRefresh();
            this.selectRefresh();
        });
    }

    searchOldManager(searchString: string) {
        this.oldManagerList = [];

        if (this.utilityService.isNullOrEmptyOrUndefined(this.selectedManagerType)) {
            this.toastService.warning("Select any manager type");
            return false;
        }

        if (this.utilityService.isNotNullOrEmptyOrUndefined(searchString) && searchString != "") {
            this.http.get<any>("manager?searchString=" + searchString).subscribe(response => {
                this.oldManagerList = response.payload.list;
                this.oldManagerList.forEach(item => {
                    item.empIdAndName = item.reportingManagerFunctionalEmployeeGlobalId + " : " + item.reportingManagerFunctionalEmployeePreferredName;
                });
                this.pageRefresh();
            });
        }
    }

    searchNewManager(searchString: string) {
        this.newManagerList = [];

        if (this.utilityService.isNotNullOrEmptyOrUndefined(searchString) && searchString != "") {
            this.http.get<any>("manager?searchString=" + searchString).subscribe(response => {
                this.newManagerList = response.payload.list;
                this.newManagerList.forEach(item => {
                    item.empIdAndName = item.reportingManagerFunctionalEmployeeGlobalId + " : " + item.reportingManagerFunctionalEmployeePreferredName;
                });
                this.pageRefresh();
            });
        }
    }

    fetchEmployeeList() {
        this.employeeList = [];
        this.employeeListValues = [];
        this.selectedEmployeeList = [];
        this.newManagerId = null;

        this.http.get<any>("manager/" + this.oldManagerId + "?managerType=" + this.selectedManagerType).subscribe(response => {
            this.employeeList = response.payload.payload.list;
            this.pageRefresh();
            this.selectRefresh();
        });
    }

    onSelectAll(select: NgModel) {
        const selected = this.employeeList.map(item => item.employeeGlobalId);
        select.update.emit(selected);

        this.selectedEmployeeList = this.employeeList;
        this.itemsPerPageToDisplay = this.selectedEmployeeList.length;
        this.count = this.selectedEmployeeList.length;

        this.actionButtonsDisplay();
    }

    onClearAll(select: NgModel) {
        select.update.emit([]);

        this.selectedEmployeeList = [];
        this.itemsPerPageToDisplay = 0;
        this.count = 0;
    }

    selectedEmployee(event) {
        this.selectedEmployeeList = event;
        this.itemsPerPageToDisplay = this.selectedEmployeeList.length;
        this.count = this.selectedEmployeeList.length;
        this.actionButtonsDisplay();
    };

    resetData() {
        this.oldManagerList = [];
        this.newManagerList = [];
        this.employeeList = []
        this.selectedEmployeeList = [];
        this.employeeListValues = []
        this.newManagerId = null;
        this.effectiveDate = new Date();
        this.oldManagerId = null;
        this.selectedManagerType = null;
        this.selectedManagerTypeName = 'Manager';
        this.selectRefresh();
    }


    transferEmployee() {
        var updateInfo = {
            "employees": this.employeeListValues,
            "manager": this.newManagerId,
            "effectiveDate": this.effectiveDate,
            "managerType": this.selectedManagerType,
            "eventType": "JDC",
            "eventReason": this.eventReason
        }

        if (this.utilityService.isNullOrEmptyOrUndefined(this.selectedManagerType)) {
            this.toastService.warning("Select any manager type");
            return false;
        }
        if (this.utilityService.isNullOrEmptyOrUndefined(this.oldManagerId)) {
            this.toastService.warning("Old manager is null");
            return false;
        }
        if (this.utilityService.isNullOrEmptyOrUndefined(this.employeeListValues)) {
            this.toastService.warning("Employee List is Empty");
            return false;
        }
        if (this.utilityService.isNullOrEmptyOrUndefined(this.newManagerId)) {
            this.toastService.warning("new Manager is null");
            return false;
        }
        if (this.utilityService.isNullOrEmptyOrUndefined(this.eventReason)) {
            this.toastService.warning("Event Reason is null");
            return false;
        }

        this.http.put<any>("manager", updateInfo).subscribe(response => {
            this.toastService.success("Employees Transfered Sucessfully")
            this.resetData();
            this.pageRefresh();
        });
    }

    setDate(setValue: string) {
        return formatDate(setValue, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }

    customSearchFn(term: string, item: any) {
        term = term.toUpperCase();

        const list = Object.values<string>(item).filter(word => {
            if (word.toUpperCase() != null && word != undefined && word.toUpperCase().match(term) != null) {
                console.log(item)
                return item;
            }
        });
        return (list.length != 0);
    }

    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.selectedEmployeeList) {
            this.selectedEmployeeList[k].actionButtonsList = [];
            this.selectedEmployeeList[k].actionButtonsList.push(this.actionButtonsObjectCreation("removeButton", "Remove",environment.cdnPath+"/Hub/close"));
        }
    }

    outputFromListView(outPutFromChild) {
        if (outPutFromChild.selectedAction == "removeButton") {
            let data = outPutFromChild.listDetails;

            this.employeeListValues = this.employeeListValues.filter(item =>
                item !== data.employeeGlobalId);

            this.selectedEmployeeList = this.selectedEmployeeList.filter(item =>
                item.employeeGlobalId !== data.employeeGlobalId);

            this.itemsPerPageToDisplay = this.selectedEmployeeList.length;
            this.count = this.selectedEmployeeList.length;

        }
    }

}
