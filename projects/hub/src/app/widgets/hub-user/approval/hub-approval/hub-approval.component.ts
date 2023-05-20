import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as M from "materialize-css/dist/js/materialize";
import { CompleterService, CompleterData, RemoteData, CompleterItem } from 'ng2-completer';
declare var $: any;
declare var require: any;
import { NgModule } from "@angular/core";
import { formatDate } from "@angular/common";
import { Input } from "@angular/core";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { UtilityService } from 'projects/hub/src/app/services/utility.service';
import { SessionService, WidgetService } from '@nw-workspace/common-services';
import { EmployeeService } from 'projects/hub/src/app/services/employee.service';
import { MdmService } from 'projects/hub/src/app/services/mdm.service';
import { SdmService } from 'projects/hub/src/app/services/sdm.service';
import { ToastService } from 'projects/hub/src/app/services/toast.service';
import { environment } from 'projects/hub/src/environments/environment.prod';

@Component({
    selector: 'app-hub-approval',
    templateUrl: './hub-approval.component.html',
    styleUrls: ['./hub-approval.component.css']
})

export class HubApprovalComponent implements OnInit {
    finalApproval: any;
    filePathOnetomany: boolean = false;
    fileNotFound1: boolean;
    fileNotFound: boolean;
    currentFilePath: any;
    allFieldDetails: any = {};
    newDataDisplayNames: any = {};
    oldDataDisplayNames: any = {};
    removedAttachments: boolean = false;
    addedAttachments: boolean = false;
    formId: any;
    allFieldTitlesByFieldCode: any = {};
    allFieldTitles: any = {};
    allFieldTypes: any = {}
    totalFields: any = [];
    responseField: any;
    businessunitCode: any;
    countryCode: any;
    newFileFlag: boolean = false;
    oldFileFlag: boolean = false;
    addedAttachmentModalFlag: boolean = false;
    removedAttachmentModalFlag: boolean = false;
    listOfRemovedDocumentsByFields: any = {};
    listOfRemovedAttachmentFields: any = [];
    loadingForNewFile: boolean = false;
    loadingForOldFile: boolean = false;
    oldUrl: any;
    newUrl: any;
    newContentType: string;
    oldContentType: string;
    newFile: any = {};
    oldPath: any;
    newPath: any;
    path: any;
    formCode: any;
    approvalId: any;
    employeeGlobalId: any;
    url: any;
    imgsrc: string;
    contentType: string;
    loading: boolean = false;
    oldFile: any = {};
    fetchfiles: any;
    currentDocument: any;
    listOfCurrentDocumentsByFields: any = {};
    listOfCurrentAttachmentFields: any = [];
    fileView: boolean = false;
    attachmentView: boolean = false;
    fieldView: boolean = false;
    currentField: any;
    attachmentViewFlag: boolean = false;
    listOfAddedDocumentsByFields: any = {};
    fieldCode: any;
    listOfAddedAttachmentFields: any = [];
    listOfAttachmentFields: any = [];
    fileData: any = {};
    o2mMdmNewValues: any = {};
    o2mMdmOldValues: any = {};
    o2mAutoCompleteOld: any = {};
    o2mAutoCompleteNew: any = {};
    oneToMany: boolean = false;
    autoCompleteNew: any = {};
    autoCompleteOld: any = {};
    mdmOldValues: any = {};
    mdmNewValues: any = {};
    fields: any;
    allFields: any = [];
    data: any = {}
    one2ManyChangedFields: any[] = [];
    changedFields: any = [];
    configuration: any;
    modalType: string;
    modalInstance: any;
    note: string;

    employeeIds: string[] = [];
    employeeInfo: any = {};
    selectData: any = {}
    selectMDMData: any = {};

    suggestions: any = [];
    autoComplete: any = [];
    autoCompleteDB: any = [];
    mdmFields: any = [];
    sdmValue: any;
    fieldSdmMap: Map<string, string> = new Map();
    sdmCodes: any = [];

    approvalHistory: any = [];
    personalDetailDB: any = {};
    personalDetail: any = {};
    appRole: string;
    dateFields: any;
    eventConfig: any = [];
    approvalRequestData: any = {};
    widgetWidth: number;
    loader: boolean = true;
    company: string = this.sessionService.getCurrentUser().additionalDetails.clientName;
    cdnUrl=environment.cdnPath;

    @Input("approvalData") approvalData: any;
    @Input("onMe") onMe: any;
    @Input("appCode") appCode: any;

    @Output() backApprovalEvent = new EventEmitter<boolean>();
    presignedUrl: any;

    constructor(private sanitizer: DomSanitizer, private http: HttpClient, private employeeService: EmployeeService, private widgetService: WidgetService, private toastService: ToastService, private sessionService: SessionService, private mdmService: MdmService, private sdmService: SdmService, private completerService: CompleterService, private utilityService: UtilityService) { }

    ngOnInit() {
        
        this.approvalId = this.approvalData.tbMasApproval.id;
        this.finalApproval = this.approvalData.tbMasApproval.status.statusName
        this.approvalRequestData = JSON.parse(this.approvalData.tbMasApproval.request);
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.approvalRequestData.totalFields)) {
            this.totalFields = this.approvalRequestData.totalFields;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.approvalRequestData.oldDataDisplayNames)) {
            this.oldDataDisplayNames = this.approvalRequestData.oldDataDisplayNames;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.approvalRequestData.newDataDisplayNames)) {
            this.newDataDisplayNames = this.approvalRequestData.newDataDisplayNames;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.approvalRequestData.formFileData)) {
            this.fileData = this.approvalRequestData.formFileData;
            this.attachmentViewFlag = true;
        }
        this.formCode = this.approvalRequestData.formCode;
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.approvalRequestData.formId)) {
            this.formId = this.approvalRequestData.formId;
        }
        this.personalDetail = this.approvalRequestData.data;
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail.countryCode)) {
            this.countryCode = this.personalDetail.countryCode;
        }
        this.employeeGlobalId = this.personalDetail.employeeGlobalId;
        this.personalDetailDB = JSON.parse(this.approvalData.tbMasApproval.prerequest);
        this.employeeIds.push(this.approvalData.updatedBy);
        this.employeeIds.push(this.approvalData.tbMasApproval.createdBy);
        this.employeeIds.push(this.approvalData.assignedBy);
        this.employeeIds.push(this.approvalData.assignedTo);
        this.employeeIds.push(this.approvalData.tbMasApproval.approvalFor);
        this.employeeIds.push(this.approvalData.proxyBy);
        this.employeeIds.push(this.personalDetailDB['employeeId']);
        this.findAllFieldTitlesByFieldName().then(() => { this.fetchEventConfiguration() });
        //        this.fetchConfigurationByFormId();
    }

    ngAfterViewInit() {

        $('.modal').modal();
        $('.collapsible').collapsible();
        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("pexApprovalPage"), element => {
            this.onResizedEvent(element);
        });
    }

    back() {

        this.backApprovalEvent.emit(true);

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

    approve() {
        this.http.get<any>("approvals/approve?approvalAssignmentId=" + this.approvalData.id + "&note=" + this.note).subscribe(data => {
            this.back();
        });
    }

    rejectApproval() {
        this.http.get<any>("approvals/reject?approvalAssignmentId=" + this.approvalData.id + "&note=" + this.note).subscribe(data => {
            this.back();
        });
    }


    extractFilePath(jsonData, document, file) {
        var key = "";
        for (var e in jsonData) {
            key = key + this.allFieldTitles[e] + " : " + jsonData[e];
        }
        return key;
    }

    fetchEventConfiguration() {
        
        this.allFieldDetails;
        var filePathData;
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.fileData)) {
            for (var singleFieldDocument in this.fileData) {
                var singleDocumentSplit = singleFieldDocument.split("-", 2);
                var fieldCode = singleDocumentSplit[0];
                var documentName = singleDocumentSplit[1];
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.fileData[singleFieldDocument].newFiles)) {
                    filePathData = this.fileData[singleFieldDocument].newFiles
                }


                if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.fileData[singleFieldDocument].newFiles)) {
                    if (!this.listOfAddedAttachmentFields.includes(fieldCode)) {
                        this.listOfAddedAttachmentFields.push(fieldCode);
                    }
                    if (this.utilityService.isNullOrEmptyOrUndefined(this.listOfAddedDocumentsByFields[fieldCode])) {
                        this.listOfAddedDocumentsByFields[fieldCode] = [];
                    }
                    if (!this.listOfAddedDocumentsByFields[fieldCode].includes(documentName)) {
                        this.listOfAddedDocumentsByFields[fieldCode].push(documentName);
                    }

                    if (this.listOfAddedDocumentsByFields[fieldCode]["filePathData"] == undefined)
                        this.listOfAddedDocumentsByFields[fieldCode]["filePathData"] = filePathData
                    else {
                        var len = this.listOfAddedDocumentsByFields[fieldCode]["filePathData"].length
                        this.listOfAddedDocumentsByFields[fieldCode]["filePathData"][len] = filePathData[0]
                    }
                }

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.fileData[singleFieldDocument].deletedFiles)) {
                    filePathData = this.fileData[singleFieldDocument].deletedFiles
                }

                if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.fileData[singleFieldDocument].deletedFiles)) {
                    if (!this.listOfRemovedAttachmentFields.includes(fieldCode)) {
                        this.listOfRemovedAttachmentFields.push(fieldCode);
                    }
                    if (this.utilityService.isNullOrEmptyOrUndefined(this.listOfRemovedDocumentsByFields[fieldCode])) {
                        this.listOfRemovedDocumentsByFields[fieldCode] = [];
                    }
                    if (!this.listOfRemovedDocumentsByFields[fieldCode].includes(documentName)) {
                        this.listOfRemovedDocumentsByFields[fieldCode].push(documentName);
                    }
                    if (this.listOfRemovedDocumentsByFields[fieldCode]["filePathData"] == undefined) {
                        this.listOfRemovedDocumentsByFields[fieldCode]["filePathData"] = {}
                    }
                    
                    if (this.listOfRemovedDocumentsByFields[fieldCode]["filePathData"] == undefined)
                        this.listOfRemovedDocumentsByFields[fieldCode]["filePathData"] = filePathData
                    else {
                        var len = this.listOfRemovedDocumentsByFields[fieldCode]["filePathData"].length
                        if (len == undefined) {
                            len = 0;
                        }
                        this.listOfRemovedDocumentsByFields[fieldCode]["filePathData"][len] = filePathData[0];
                    }

                }
                if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.listOfAddedDocumentsByFields)) {
                    this.addedAttachments = true;
                }
                if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.listOfRemovedDocumentsByFields)) {
                    this.removedAttachments = true;
                }
            }
        }

        var normalFields = [];
        var one2ManyAllFields = [];

        for (var field in this.personalDetail) {

            if (typeof (this.personalDetail[field]) == "object") {

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field])) {

                    if (this.personalDetail[field].length > 0) {

                        var i = 0;
                        while (i < this.personalDetail[field].length) {
                            if (this.utilityService.isNullOrEmptyOrUndefined(this.personalDetail[field][i])) {
                                this.personalDetail[field].splice(i, 1);
                                i = 0;
                            } else {
                                i++;
                            }
                        }
                    }
                }

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field])) {

                    if (this.personalDetailDB[field].length > 0) {
                        var j = 0;
                        while (j < this.personalDetailDB[field].length) {
                            if (this.utilityService.isNullOrEmptyOrUndefined(this.personalDetailDB[field][j])) {
                                this.personalDetailDB[field].splice(j, 1);
                                j = 0;
                            } else {
                                j++;
                            }
                        }
                    }
                }
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field])) {

                    var O2MDataSource = field
                    var changedValue = [];
                    var addedValues = [];
                    for (var fieldIndex in this.personalDetail[field]) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field][fieldIndex])) {
                            var changedValue1 = [];
                            var addedValues1 = [];
                            var jsonChangedValues1 = [];
                            var jsonAddedValues1 = [];
                            var isJson = false
                            var json = null
                            for (var fieldValue in this.personalDetail[field][fieldIndex]) {

                                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field][fieldIndex][fieldValue] || this.personalDetail[field][fieldIndex][fieldValue] == false)) {

                                    if (typeof this.personalDetail[field][fieldIndex][fieldValue] == 'object') {
                                        for (var jsonField in this.personalDetail[field][fieldIndex][fieldValue]) {
                                            if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.personalDetail[field][fieldIndex][fieldValue][jsonField])) {

                                                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field])) {
                                                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field][fieldIndex])) {
                                                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field][fieldIndex][fieldValue])) {
                                                            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field][fieldIndex][fieldValue][jsonField]) || this.personalDetailDB[field][fieldIndex][fieldValue][jsonField] == false) {
                                                                if (this.personalDetail[field][fieldIndex][fieldValue][jsonField] != this.personalDetailDB[field][fieldIndex][fieldValue][jsonField]) {
                                                                    jsonChangedValues1.push(jsonField);
                                                                    if (!isJson) {
                                                                        isJson = true
                                                                        json = fieldValue
                                                                    }

                                                                    if (!one2ManyAllFields.includes(jsonField)) {
                                                                        one2ManyAllFields.push(jsonField);
                                                                    }
                                                                }
                                                            } else {
                                                                jsonChangedValues1.push(jsonField);
                                                                if (!isJson) {
                                                                    isJson = true
                                                                    json = fieldValue
                                                                }
                                                                if (!one2ManyAllFields.includes(jsonField)) {
                                                                    one2ManyAllFields.push(jsonField);
                                                                }
                                                                this.personalDetailDB[field][fieldIndex][fieldValue][jsonField] = null;
                                                            }
                                                        } else {
                                                            jsonAddedValues1.push(jsonField);
                                                            if (!isJson) {
                                                                isJson = true
                                                                json = fieldValue
                                                            }
                                                            if (!one2ManyAllFields.includes(jsonField)) {
                                                                one2ManyAllFields.push(jsonField);
                                                            }
                                                        }
                                                    } else {
                                                        jsonAddedValues1.push(jsonField);
                                                        if (!isJson) {
                                                            isJson = true
                                                            json = fieldValue
                                                        }
                                                        if (!one2ManyAllFields.includes(jsonField)) {
                                                            one2ManyAllFields.push(jsonField);
                                                        }
                                                    }
                                                } else {
                                                    jsonAddedValues1.push(jsonField);
                                                    if (!isJson) {
                                                        isJson = true
                                                        json = fieldValue
                                                    }
                                                    if (!one2ManyAllFields.includes(jsonField)) {
                                                        one2ManyAllFields.push(jsonField);
                                                    }
                                                }

                                            }

                                        }
                                    } else {

                                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field])) {
                                            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field][fieldIndex])) {
                                                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field][fieldIndex][fieldValue]) || this.personalDetailDB[field][fieldIndex][fieldValue] == false) {
                                                    if (this.personalDetail[field][fieldIndex][fieldValue] != this.personalDetailDB[field][fieldIndex][fieldValue]) {
                                                        changedValue1.push(fieldValue);
                                                        if (!one2ManyAllFields.includes(fieldValue)) {
                                                            one2ManyAllFields.push(fieldValue);
                                                        }
                                                    }
                                                } else {
                                                    changedValue1.push(fieldValue);
                                                    if (!one2ManyAllFields.includes(fieldValue)) {
                                                        one2ManyAllFields.push(fieldValue);
                                                    }
                                                    this.personalDetailDB[field][fieldIndex][fieldValue] = null;
                                                }
                                            } else {
                                                addedValues1.push(fieldValue);
                                                if (!one2ManyAllFields.includes(fieldValue)) {
                                                    one2ManyAllFields.push(fieldValue);
                                                }
                                            }
                                        } else {
                                            addedValues1.push(fieldValue);
                                            if (!one2ManyAllFields.includes(fieldValue)) {
                                                one2ManyAllFields.push(fieldValue);
                                            }
                                        }
                                    }
                                }

                            }
                            if (this.utilityService.isNotNullOrEmptyOrUndefined(changedValue1) || this.utilityService.isNotNullOrEmptyOrUndefined(jsonChangedValues1)) {
                                //                                changedValue1.push( fieldIndex );
                                var singleObj: any = {}
                                singleObj.index = Number(fieldIndex);
                                if (this.utilityService.isNotNullOrEmptyOrUndefined(changedValue1)) {
                                    singleObj.values = changedValue1
                                }
                                if (this.utilityService.isNotNullOrEmptyOrUndefined(jsonChangedValues1)) {
                                    singleObj.isJson = isJson
                                    singleObj.json = json
                                    singleObj.jsonValues = jsonChangedValues1

                                }
                                changedValue.push(singleObj);
                            }
                            if (this.utilityService.isNotNullOrEmptyOrUndefined(addedValues1) || this.utilityService.isNotNullOrEmptyOrUndefined(jsonAddedValues1)) {
                                //                                addedValues1.push( fieldIndex );
                                var singleObj1: any = {}
                                singleObj1.index = Number(fieldIndex);
                                if (this.utilityService.isNotNullOrEmptyOrUndefined(addedValues1)) {
                                    singleObj1.values = addedValues1
                                }
                                if (this.utilityService.isNotNullOrEmptyOrUndefined(jsonAddedValues1)) {
                                    singleObj1.isJson = isJson
                                    singleObj1.json = json
                                    singleObj1.jsonValues = jsonAddedValues1

                                }

                                addedValues.push(singleObj1);
                            }
                        }
                        if (this.utilityService.isNullOrEmptyOrUndefined(this.personalDetailDB[field])) {
                            this.personalDetailDB[field] = {};
                        }
                        if (this.utilityService.isNullOrEmptyOrUndefined(this.personalDetailDB[field][fieldIndex])) {
                            this.personalDetailDB[field][fieldIndex] = {};
                        }
                    }
                    if (this.utilityService.isNullOrEmptyOrUndefined(this.personalDetailDB[field])) {
                        this.personalDetailDB[field] = {};
                    }
                }

                if (this.utilityService.isNotNullOrEmptyOrUndefined(changedValue)) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(O2MDataSource)) {
                        var data: any = {};
                        data.one2ManyDataSource = O2MDataSource;
                    }
                    data.changedValues = changedValue;
                    data.changedValueEnabled = true;
                    changedValue = [];
                }

                if (this.utilityService.isNotNullOrEmptyOrUndefined(addedValues)) {
                    for (var value in addedValues) {
                        var currentaddedValue = addedValues[value].values;
                        if (currentaddedValue.includes("PexNewIteam")) {
                            var removalIndex = currentaddedValue.indexOf("PexNewIteam");
                            currentaddedValue.splice(removalIndex, 1);
                        }
                        if (currentaddedValue.includes("NewIteam")) {
                            var removalIndex = currentaddedValue.indexOf("NewIteam");
                            currentaddedValue.splice(removalIndex, 1);
                        }
                        if (currentaddedValue.includes("approval")) {
                            var removalIndex = currentaddedValue.indexOf("approval");
                            currentaddedValue.splice(removalIndex, 1);
                        }
                        if (currentaddedValue.includes("enabled")) {
                            var removalIndex = currentaddedValue.indexOf("enabled");
                            currentaddedValue.splice(removalIndex, 1);
                        }
                        if (currentaddedValue.length == 1) {
                            currentaddedValue.splice(0, 1);
                        }
                        addedValues[value].values = currentaddedValue;
                    }

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(addedValues)) {
                        if (this.utilityService.isNullOrEmptyOrUndefined(data)) {
                            data = {};
                            data.one2ManyDataSource = O2MDataSource;
                        }
                        data.addedValues = addedValues;
                        data.addedValueEnabled = true;
                    }
                    addedValues = [];

                }

                if (this.utilityService.isNotNullOrEmptyOrUndefined(data)) {
                    this.one2ManyChangedFields.push(Object.assign({}, data));
                    data = null;
                }

            } else {
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field])) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field])) {
                        if (this.personalDetail[field] != this.personalDetailDB[field]) {
                            this.changedFields.push(field);
                            if (!normalFields.includes(field)) {
                                normalFields.push(field);
                            }
                        }
                    } else {
                        this.changedFields.push(field);
                        this.personalDetailDB[field] = null;
                        if (!normalFields.includes(field)) {
                            normalFields.push(field);
                        }
                    }
                } else {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field])) {
                        this.changedFields.push(field);
                        this.personalDetail[field] = null;
                        if (!normalFields.includes(field)) {
                            normalFields.push(field);
                        }
                    }
                }
            }
        }


        if (one2ManyAllFields.includes("PexNewIteam") || one2ManyAllFields.includes("approval")) {
            one2ManyAllFields.splice(one2ManyAllFields.indexOf("PexNewIteam"), 1);
        }

        this.allFields = this.allFields.concat(normalFields);
        this.allFields = this.allFields.concat(one2ManyAllFields);

        
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.one2ManyChangedFields)) {
            this.oneToMany = true;
        }

        try {
            this.fetchEmployeeName(this.employeeIds);
        } catch (e) { }
    }

    fetchFieldDetails() {
        
        this.http.post<any>("fetchFieldsByFieldName", this.allFields).subscribe(data2 => {

            this.fields = data2.payload;


            for (var field in this.personalDetail) {

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field])) {

                    if (typeof (this.personalDetail[field]) == "object") {
                        for (var fieldIndex in this.personalDetail[field]) {
                            for (var innerField in this.personalDetail[field][fieldIndex]) {

                                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.fields[innerField])) {
                                    if (this.fields[innerField].fieldType == "date") {
                                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field][fieldIndex][innerField])) {
                                            this.personalDetail[field][fieldIndex][innerField] = formatDate(this.personalDetail[field][fieldIndex][innerField], 'yyyy-MM-dd', 'en-US');
                                        }
                                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field][fieldIndex][innerField])) {
                                            this.personalDetailDB[field][fieldIndex][innerField] = formatDate(this.personalDetailDB[field][innerField], 'yyyy-MM-dd', 'en-US');
                                        } else {
                                            this.personalDetailDB[field][fieldIndex][innerField] = null;
                                        }
                                    }

                                    if (this.fields[innerField].fieldType == "select" && !this.fields[innerField].sdmValue) {
                                        this.mdmFields.push(this.fields[innerField].fieldCode);

                                        this.fields[innerField].fieldDisplay = this.fields[innerField].fieldDisplay.replace("{", "");
                                        this.fields[innerField].fieldDisplay = this.fields[innerField].fieldDisplay.replace("}", "");
                                    }

                                    if (this.fields[innerField].fieldType == "autocomplete") {
                                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field][fieldIndex][innerField])) {
                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mAutoCompleteNew[field])) {
                                                this.o2mAutoCompleteNew[field] = {}
                                            }
                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mAutoCompleteNew[field][fieldIndex])) {
                                                this.o2mAutoCompleteNew[field][fieldIndex] = {}
                                            }
                                            this.o2mAutoCompleteNew[field][fieldIndex][innerField] = this.resolvePattern(this.personalDetail[field][fieldIndex], this.fields[innerField].fieldDisplay);

                                        } else {
                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mAutoCompleteNew[field])) {
                                                this.o2mAutoCompleteNew[field] = {}
                                            }
                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mAutoCompleteNew[field][fieldIndex])) {
                                                this.o2mAutoCompleteNew[field][fieldIndex] = {}
                                            }
                                            this.o2mAutoCompleteNew[field][fieldIndex][innerField] = null;
                                        }
                                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field][fieldIndex][innerField])) {
                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mAutoCompleteOld[field])) {
                                                this.o2mAutoCompleteOld[field] = {}
                                            }
                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mAutoCompleteOld[field][fieldIndex])) {
                                                this.o2mAutoCompleteOld[field][fieldIndex] = {}
                                            }
                                            this.o2mAutoCompleteOld[field][fieldIndex][innerField] = this.resolvePattern(this.personalDetailDB[field][fieldIndex], this.fields[innerField].fieldDisplay);
                                        } else {
                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mAutoCompleteOld[field])) {
                                                this.o2mAutoCompleteOld[field] = {}
                                            }
                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mAutoCompleteOld[field][fieldIndex])) {
                                                this.o2mAutoCompleteOld[field][fieldIndex] = {}
                                            }
                                            this.o2mAutoCompleteOld[field][fieldIndex][innerField] = null;
                                        }
                                        for (var sectionIndex in this.one2ManyChangedFields) {
                                            if (this.one2ManyChangedFields[sectionIndex].one2ManyDataSource == field) {
                                                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.one2ManyChangedFields[sectionIndex].changedValues)) {
                                                    for (var index in this.one2ManyChangedFields[sectionIndex].changedValues) {
                                                        this.fields[innerField].fieldDisplay = this.fields[innerField].fieldDisplay.replace("{", "");
                                                        this.fields[innerField].fieldDisplay = this.fields[innerField].fieldDisplay.replace("}", "");
                                                        if (this.one2ManyChangedFields[sectionIndex].changedValues[index].includes(this.fields[innerField].fieldDisplay)) {
                                                            this.one2ManyChangedFields[sectionIndex].changedValues[index].splice(this.one2ManyChangedFields[sectionIndex].changedValues[index].indexOf(this.fields[innerField].fieldDisplay), 1);
                                                        }
                                                    }

                                                }
                                                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.one2ManyChangedFields[sectionIndex].addedValues)) {
                                                    for (var index in this.one2ManyChangedFields[sectionIndex].addedValues) {
                                                        this.fields[innerField].fieldDisplay = this.fields[innerField].fieldDisplay.replace("{", "");
                                                        this.fields[innerField].fieldDisplay = this.fields[innerField].fieldDisplay.replace("}", "");
                                                        if (this.one2ManyChangedFields[sectionIndex].addedValues[index].includes(this.fields[innerField].fieldDisplay)) {
                                                            this.one2ManyChangedFields[sectionIndex].addedValues[index].splice(this.one2ManyChangedFields[sectionIndex].addedValues[index].indexOf(this.fields[innerField].fieldDisplay), 1);
                                                        }
                                                    }

                                                }
                                            }
                                        }

                                    }

                                }
                            }

                        }
                    } else {

                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.fields[field])) {
                            if (this.fields[field].fieldType == "date") {
                                this.personalDetail[field] = formatDate(this.personalDetail[field], 'yyyy-MM-dd', 'en-US');
                                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field])) {
                                    this.personalDetailDB[field] = formatDate(this.personalDetailDB[field], 'yyyy-MM-dd', 'en-US');
                                } else {
                                    this.personalDetailDB[field] = null;
                                }
                            }

                            //                            if ( this.fields[field].fieldType == "datetime" ) {
                            //                                this.personalDetail[field] = new Date( formatDate( this.personalDetail[field], 'yyyy-MM-ddTHH:mm:ssZ', 'en-US', '+0000' ) );
                            //                                if ( this.utilityService.isNotNullOrEmptyOrUndefined( this.personalDetailDB[field] ) ) {
                            //                                    this.personalDetailDB[field] = new Date( formatDate( this.personalDetail[field], 'yyyy-MM-ddTHH:mm:ssZ', 'en-US', '+0000' ) );
                            //                                } else {
                            //                                    this.personalDetailDB[field] = null;
                            //                                }
                            //                            }

                            if (this.fields[field].fieldType == "select" && !this.fields[field].sdmValue) {
                                this.mdmFields.push(this.fields[field].fieldCode);

                                this.fields[field].fieldDisplay = this.fields[field].fieldDisplay.replace("{", "");
                                this.fields[field].fieldDisplay = this.fields[field].fieldDisplay.replace("}", "");
                            }

                            if (this.fields[field].fieldType == "autocomplete") {
                                this.autoCompleteNew[field] = this.resolvePattern(this.personalDetail, this.fields[field].fieldDisplay);
                                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field])) {
                                    this.autoCompleteOld[field] = this.resolvePattern(this.personalDetailDB, this.fields[field].fieldDisplay);
                                } else {
                                    this.autoCompleteOld[field] = null;
                                }
                            }

                        }
                    }

                }

            }

            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.mdmFields)) {
                this.getMDMData();
            } else {
                this.fetchEmployeeName(this.employeeIds);
            }

        });

    }


    sdmValues() {
        if (this.sdmCodes != null && this.sdmCodes != undefined && this.sdmCodes.length != 0) {

            this.sdmService.getSDM(this.sdmCodes, this.appCode).subscribe(data => {
                this.sdmValue = data;
                for (var i = 0; i < this.sdmCodes.length; i++) {
                    this.selectData[this.fieldSdmMap.get(this.sdmCodes[i])] = this.sdmValue[this.sdmCodes[i]];
                }
                this.selectRefresh();
            });
        }
    }

    getMDMData() {


        this.mdmNewValues = {};
        this.mdmOldValues = {};

        this.http.post<any>("mdmValues", this.mdmFields).subscribe(data => {
            this.selectMDMData = data.payload;

            for (var field in this.personalDetail) {
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field])) {
                    if (typeof (this.personalDetail[field]) == "object") {
                        for (var fieldIndex in this.personalDetail[field]) {
                            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field][fieldIndex])) {
                                for (var innerField in this.personalDetail[field][fieldIndex]) {
                                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.fields[innerField])) {
                                        if (this.fields[innerField].fieldType == "select" && !this.fields[innerField].sdmValue) {

                                            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.selectMDMData[this.fields[innerField].fieldCode])) {
                                                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field][fieldIndex][innerField]) || this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field][fieldIndex][innerField])) {
                                                    for (var value of this.selectMDMData[this.fields[innerField].fieldCode]) {
                                                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field][fieldIndex][innerField])) {
                                                            if (value[innerField] == this.personalDetail[field][fieldIndex][innerField]) {
                                                                if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmNewValues[field])) {
                                                                    this.o2mMdmNewValues[field] = {};
                                                                }
                                                                if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmNewValues[field][fieldIndex])) {
                                                                    this.o2mMdmNewValues[field][fieldIndex] = {};
                                                                }
                                                                if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmNewValues[field][fieldIndex][innerField])) {
                                                                    this.o2mMdmNewValues[field][fieldIndex][innerField] = {};
                                                                }
                                                                this.o2mMdmNewValues[field][fieldIndex][innerField][this.fields[innerField].fieldDisplay] = value[this.fields[innerField].fieldDisplay];
                                                            }
                                                        } else {
                                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmNewValues[field])) {
                                                                this.o2mMdmNewValues[field] = {};
                                                            }
                                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmNewValues[field][fieldIndex])) {
                                                                this.o2mMdmNewValues[field][fieldIndex] = {};
                                                            }
                                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmNewValues[field][fieldIndex][innerField])) {
                                                                this.o2mMdmNewValues[field][fieldIndex][innerField] = {};
                                                            }
                                                            this.o2mMdmNewValues[field][fieldIndex][innerField][this.fields[innerField].fieldDisplay] = null;
                                                        }
                                                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field][fieldIndex][innerField])) {
                                                            if (value[innerField] == this.personalDetailDB[field][fieldIndex][innerField]) {
                                                                if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmOldValues[field])) {
                                                                    this.o2mMdmOldValues[field] = {};
                                                                }
                                                                if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmOldValues[field][fieldIndex])) {
                                                                    this.o2mMdmOldValues[field][fieldIndex] = {};
                                                                }
                                                                if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmOldValues[field][fieldIndex][innerField])) {
                                                                    this.o2mMdmOldValues[field][fieldIndex][innerField] = {};
                                                                }
                                                                this.o2mMdmOldValues[field][fieldIndex][innerField][this.fields[innerField].fieldDisplay] = value[this.fields[innerField].fieldDisplay];
                                                            }
                                                        } else {
                                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmOldValues[field])) {
                                                                this.o2mMdmOldValues[field] = {};
                                                            }
                                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmOldValues[field][fieldIndex])) {
                                                                this.o2mMdmOldValues[field][fieldIndex] = {};
                                                            }
                                                            if (this.utilityService.isNullOrEmptyOrUndefined(this.o2mMdmOldValues[field][fieldIndex][innerField])) {
                                                                this.o2mMdmOldValues[field][fieldIndex][innerField] = {};
                                                            }
                                                            this.o2mMdmOldValues[field][fieldIndex][innerField][this.fields[innerField].fieldDisplay] = null;
                                                        }
                                                    }
                                                }
                                            }

                                        }

                                    }
                                }
                            }
                        }
                    } else {

                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.fields[field])) {
                            if (this.fields[field].fieldType == "select" && !this.fields[field].sdmValue) {

                                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.selectMDMData[this.fields[field].fieldCode])) {
                                    for (var value of this.selectMDMData[this.fields[field].fieldCode]) {
                                        if (this.utilityService.isNotNullOrEmptyOrUndefined(value[field])) {
                                            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetail[field])) {
                                                if (value[field] == this.personalDetail[field]) {
                                                    this.mdmNewValues[field] = {};
                                                    this.mdmNewValues[field][this.fields[field].fieldDisplay] = value[this.fields[field].fieldDisplay];
                                                }
                                            } else {
                                                if (this.utilityService.isNullOrEmptyOrUndefined(this.mdmNewValues[field])) {
                                                    this.mdmNewValues[field] = {};
                                                }
                                                this.mdmNewValues[field][this.fields[field].fieldDisplay] = null;
                                            }
                                            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.personalDetailDB[field])) {
                                                if (value[field] == this.personalDetailDB[field]) {
                                                    this.mdmOldValues[field] = {};
                                                    this.mdmOldValues[field][this.fields[field].fieldDisplay] = value[this.fields[field].fieldDisplay];
                                                }
                                            } else {
                                                if (this.utilityService.isNullOrEmptyOrUndefined(this.mdmOldValues[field])) {
                                                    this.mdmOldValues[field] = {};
                                                }
                                                this.mdmOldValues[field][this.fields[field].fieldDisplay] = null;
                                            }
                                        }
                                    }
                                }

                            }

                        }
                    }

                }

            }
            this.fetchEmployeeName(this.employeeIds);
        })
    }


    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect();
            M.updateTextFields();
        }, 100);
    }

    resolvePattern(data, pattern) {

        var j = 0;
        let result = pattern.replace(/\{\S+?\}/g, function (str, offset, input) {
            var key = str.replace('{', '');
            key = key.replace('}', '');
            return data[key];
        });

        var ext = pattern.split('-')[1];
        if (this.utilityService.isNotNullOrEmptyOrUndefined(ext)) {
            var key = ext.replace('{', '');
            key = key.replace('}', '');

            if (this.changedFields.includes(key)) {
                for (var fieldName of this.changedFields) {
                    if (fieldName == key) {
                        this.changedFields.splice(j, 1);
                        break;
                    }
                    j++;
                }
            }

        }
        //        delete person.age;
        if (result == pattern) {
            return data[pattern];
        }
        return result;

    }


    cancelApproval() {
        this.http.get<any>("approvals/cancel?approvalAssignmentId=" + this.approvalData.id + "&note=" + this.note).subscribe(data => {
            this.back();
        });
    }


    fetchApprovalHistory() {
        if (this.approvalHistory.length == 0) {
            this.http.get<any>("approvals/history?approvalId=" + this.approvalData.tbMasApproval.id).subscribe(data => {
                this.approvalHistory = data.payload;
                var empIds = [];
                for (var history in this.approvalHistory) {
                    empIds.push(this.approvalHistory[history].spoc);
                }
                this.fetchEmployeeName(empIds);
                this.openPexApprovalHistoryModal();
            });
        }
    }


    fetchEmployeeName(empIds) {
        if (this.utilityService.isNotNullOrEmptyOrUndefined(empIds)) {
            this.employeeService.getEmployee(empIds).subscribe(data => {
                this.employeeInfo = data;
            })
        }
        this.loader = false;
    }


    closeModal() {
        var elemodal = document.getElementById('approval');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.close();
        this.note = null;
    }

    openModal(modalType) {

        this.modalType = modalType;

        var elemodal = document.getElementById('approval');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.open();
        this.note = null;
    }

    openPexApprovalHistoryModal() {
        var elemodal = document.getElementById('pexApprovalHistory');
        var instance = M.Modal.init(elemodal, {});

        instance.open();
    }

    save() {
        if (this.modalType == "approve") {
            this.approve();
        }
        else if (this.modalType == "reject") {
            if (this.note == null || this.note == "" || this.note == undefined) {
                this.toastService.error("Please Enter Comments");
            } else {
                this.rejectApproval();
            }
        }
        else if (this.modalType == "cancel") {
            this.cancelApproval();
        }

    }

    resolveDisplayPattern(pattern) {
        var field = [];
        if (pattern && pattern.fieldDisplay) {
            var patt = pattern.fieldDisplay;

            let result = patt.replace(/\{\S+?\}/g, function (str, offset, input) {
                var key = str.replace('{', '');
                key = key.replace('}', '');
                field.push(key);
                return key;
            });

        }

        return field.join(",");
    }

    initializeCollapse() {
        setTimeout(() => {
            $('.collapsible').collapsible();
        }, 10);
    }

    openAddedAttachmnetView() {
        this.listOfCurrentAttachmentFields = this.listOfAddedAttachmentFields;
        this.addedAttachmentModalFlag = true;
        this.openAttachmentModal();
    }

    openRemovedAttachmnetView() {
        this.listOfCurrentAttachmentFields = this.listOfRemovedAttachmentFields;
        this.removedAttachmentModalFlag = true;
        this.openAttachmentModal();
    }

    openAttachmentModal() {
        var elem = document.getElementById("attachmentModal");
        var instance = M.Modal.getInstance(elem);
        if (instance == undefined) {
            instance = M.Modal.init(elem, { dismissible: false });
        }
        instance.open();
        this.fieldView = true;
    }

    closeAttachmentModal() {
        var elem = document.getElementById("attachmentModal");
        var instance = M.Modal.getInstance(elem);
        if (instance == undefined) {
            instance = M.Modal.init(elem, { dismissible: false });
        }
        instance.close();
        this.fieldView = false;
        this.attachmentView = false;
        this.fileView = false;
        if (this.addedAttachmentModalFlag) {
            this.addedAttachmentModalFlag = false;
        }
        if (this.removedAttachmentModalFlag) {
            this.removedAttachmentModalFlag = false;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.oldFileFlag)) {
            this.oldFileFlag = false;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.newFileFlag)) {
            this.newFileFlag = false;
        }
    }

    backToApprovalView() {
        var elem = document.getElementById("attachmentModal");
        var instance = M.Modal.getInstance(elem);
        if (instance == undefined) {
            instance = M.Modal.init(elem, { dismissible: false });
        }
        instance.close();
        this.fieldView = false;
        if (this.addedAttachmentModalFlag) {
            this.addedAttachmentModalFlag = false;
        }
        if (this.removedAttachmentModalFlag) {
            this.removedAttachmentModalFlag = false;
        }
    }

    backToFieldView() {
        this.attachmentView = false;
        this.fieldView = true;
    }

    backToDocumentView() {
        this.fileView = false;
        this.attachmentView = true;
        if (this.loadingForNewFile) {
            this.loadingForNewFile = false;
        }
        if (this.loadingForOldFile) {
            this.loadingForOldFile = false;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.oldFileFlag)) {
            this.oldFileFlag = false;
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.newFileFlag)) {
            this.newFileFlag = false;
        }
        this.oldUrl = null;
        this.newUrl = null;
        this.oldFile = null;
        this.newFile = null;
    }

    openDocumnetByField(field) {
        
        if (this.addedAttachmentModalFlag) {
            this.listOfCurrentDocumentsByFields = this.listOfAddedDocumentsByFields;
            var i = 0;
            for (var fieldValue of this.listOfCurrentDocumentsByFields[field]) {

                this.listOfCurrentDocumentsByFields[field][i] = this.listOfCurrentDocumentsByFields[field][i].split(':')[0];

                var file = this.listOfCurrentDocumentsByFields[field]["filePathData"][i]["filePathData"];

                if (Object.keys(file).length > 0) {
                    this.filePathOnetomany = true;
                } else {
                    this.filePathOnetomany = false;
                }

                i++;

            }


        }
        if (this.removedAttachmentModalFlag) {
            this.listOfCurrentDocumentsByFields = this.listOfRemovedDocumentsByFields;
            var i = 0;
            for (var fieldValue of this.listOfCurrentDocumentsByFields[field]) {
                var file = this.listOfCurrentDocumentsByFields[field]["filePathData"][i]["filePathData"];
                if (Object.keys(file).length > 0) {
                    this.filePathOnetomany = true;
                } else {
                    this.filePathOnetomany = false;
                }

                i++;

            }

        }
        this.fieldView = false;
        this.attachmentView = true;
        this.currentField = field;
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.listOfCurrentDocumentsByFields[field]["filePathData"]))


            this.currentFilePath = this.listOfCurrentDocumentsByFields[field]["filePathData"]
    }

    openFileByDocumentAndField(file, document) {
        
        this.currentDocument = document;
        var filePath;
        if (Object.keys(file["filePathData"]).length == 0) {
            filePath = {
                "filePathData": {
                    "fileName": file["fileName"]
                }

            }
        }
        else {
            filePath = {
                filePathData: file["filePathData"]
            }
        }


        this.getPath(this.currentField, this.currentDocument, filePath).then(() => {

            this.fetchFileName(this.currentField, this.currentDocument, this.employeeGlobalId, filePath, this.newPath, "newValue").then(() => {
                this.fetchFileName(this.currentField, this.currentDocument, this.employeeGlobalId, filePath, this.oldPath, "oldValue").then(() => {
                    this.attachmentView = false;
                    this.fileView = true;
                    if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.oldFile)) {
                        this.oldFileFlag = true;
                    }
                    if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.newFile)) {
                        this.newFileFlag = true;
                    }
                });
            });
        });
    }

    fetchFileName(field, documentName, employeeId, filepathData, path, fileType) {

        this.fileNotFound = false;
        this.fileNotFound1 = false;
        return new Promise((resolve, reject) => {
            if (this.finalApproval == "Approved" && fileType == "oldValue") {
                if (fileType == "oldValue") {
                    path = this.oldPath;
                    path = "OldFileApproved/approval/" + this.approvalId + "/" + this.oldPath;
                } else {
                    path = this.oldPath;
                }

            }

            var data = {
                field: field,
                documentName: documentName,
                employeeId: employeeId,
                filepathData: filepathData,
                path: path
            }

            //fetchFilesByPath
            this.http.post<any>("files", data).subscribe(data => {
                


                if (data.payload != undefined) {
                    if (data.payload[0] != null && data.payload[0] != undefined) {
                        this.fetchfiles = data.payload[0];
                        this.fetchPresignUrl(path, this.fetchfiles["fileName"]);
                    }
                    else {
                        this.fetchfiles = data.payload;
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.fetchfiles["fileName"])) {
                            this.fetchPresignUrl(path, this.fetchfiles["fileName"]);
                        }
                    }
                    if (fileType == "oldValue") {
                        this.oldFile = this.fetchfiles;
                        return resolve(1);
                        //                        this.allAttachments[field][index].fileName = this.fetchfiles.fileName;
                        //                        this.allAttachments[field][index].filePath = this.fetchfiles.filePath;
                        //                        this.allAttachments[field][index].documentName = documentName;
                    }
                    if (fileType == "newValue") {
                        this.newFile = this.fetchfiles;
                        return resolve(1);
                    }


                }
                setTimeout(() => {
                    M.updateTextFields();
                }, 10);
                return resolve(1);
            })
        });


    }

    fetchPresignUrl(path, fileName) {

     //fetchpresignURL
        this.http.get<any>('presigned?fileName=' + fileName + '&path=' + path).subscribe(res => {
            console.log(res)
            this.presignedUrl = res.payload;
            console.log(this.presignedUrl)
        })
    }


    fetchFile(fileType) {

        var fileName = null;
        var path = null;
        if (fileType == "oldValue") {
            path = this.oldPath;
            this.loadingForOldFile = true;
            if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.oldFile)) {
                fileName = this.oldFile.fileName;
                if (this.finalApproval == "Approved") {
                    path = "OldFileApproved/approval/" + this.approvalId + "/" + this.oldPath;

                }
            } else {
                this.fileNotFound = true
                this.toastService.error("File Not Found");
            }
        } else if (fileType == "newValue") {
            this.loadingForNewFile = true;
            fileName = this.newFile.fileName;
            path = this.newPath;
        }
        if (fileName == "" || fileName == undefined) {
            this.toastService.success("File Not Found")
            this.loading = false;
        } else {

            var ext = "";
            ext = fileName.split('.')[1];
            if (fileType == "oldValue") {
                this.oldContentType = this.identifyContentType(ext);
            } else {
                this.newContentType = this.identifyContentType(ext);
            }
            var httpOptions = {
                //                headers: new HttpHeaders( {
                //                    'Accept': 'multipart/formdata',
                //                    'Authorization': 'Basic YWRtaW46YWRtaW4=',
                //                } )

            };

            this.http.get(this.presignedUrl, { responseType: 'blob' }).subscribe(data => {


                if (fileType == "oldValue") {
                    var blob = new Blob([data], { type: this.oldContentType });
                    const blobUrl = URL.createObjectURL(blob);

                    if (this.oldContentType != 'application/octet-stream') {
                        this.oldUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                    } else {
                        this.fileNotFound1 = true;
                        this.toastService.success("Preview Not Found")
                        //                    document.getElementById( "delete" ).setAttribute( "disabled", "true" );

                    }

                } else {
                    var blob = new Blob([data], { type: this.newContentType });
                    const blobUrl = URL.createObjectURL(blob);

                    if (this.newContentType != 'application/octet-stream') {
                        this.newUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                    } else {
                        this.fileNotFound = true;
                        this.toastService.success("Preview Not Found")
                    }

                }
                //                for ( var i in this.allAttachments[fieldCode] ) {
                //                    if ( this.allAttachments[fieldCode][i].documentName == documentName ) {
                //                        if ( this.allAttachments[fieldCode][i].fileName == fileName ) {
                //                            this.allAttachments[fieldCode][i].imgsrc = this.imgsrc;
                //                        }
                //                    }
                //                }

                this.loadingForNewFile = false;
                this.loadingForOldFile = false;
            }, err => {
                this.loading = false;
            })
        }

    }



    identifyContentType(ext) {

        if (ext.includes("png") || ext.includes("PNG")) {
            return "image/png";
        }
        else if (ext.includes("jpg") || ext.includes("JPG")) {
            return "image/jpg";
        }
        else if (ext.includes("jpeg") || ext.includes("JPEG")) {
            return "image/jpeg";
        }
        else if (ext.includes("pdf") || ext.includes("PDF")) {
            return "application/pdf";
        }
        else if (ext.includes("txt") || ext.includes("TXT")) {
            return "text/plain";
        }
        else {
            return "application/octet-stream";
        }

    }

    getPath(field, documentName, filePath) {

        return new Promise((resolve, reject) => {
            var map = {
                employeeGLobalId: this.employeeGlobalId,
                field: field,
                document: documentName,
                approvalId: this.approvalId,
                filePath: filePath,
                formId: this.formId
            }

            this.http.post<any>('path', map).subscribe(res => {

                if (this.utilityService.isNotNullOrEmptyOrUndefined(res.payload)) {
                    this.newPath = res.payload.path;
                    this.oldPath = res.payload.newPath;
                    return resolve(1);
                }


            });
        });

    }

    findAllFieldTitlesByFieldName() {

        return new Promise((resolve, reject) => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.totalFields)) {
                for (var field of this.totalFields) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(field.fieldName)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(field.fieldTitle)) {
                            this.allFieldTitles[field.fieldName] = field.fieldTitle;
                            this.allFieldTypes[field.fieldName] = field.fieldType;
                        }
                    }
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(field.fieldCode)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(field.fieldTitle)) {
                            this.allFieldTitlesByFieldCode[field.fieldCode] = field.fieldTitle;
                        }
                    }
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(field.fieldName)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(field.fieldTitle)) {
                            this.allFieldDetails[field.fieldName] = field;
                        }
                    }
                }
            }
            return resolve(1);
        });

    }

    getLocalDate(input) {

        if (this.utilityService.isNotNullOrEmptyOrUndefined(input)) {
            var newD = this.convertUTCDateToLocalDate2(new Date(input));
            return newD;
        }
        return null;
    }

    convertUTCDateToLocalDate(date) {

        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();

        newDate.setHours(hours - offset);

        return newDate;
    }

    convertUTCDateToLocalDate2(date) {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }

    fetchdownloadFile(fileType) {

        var fileName = null;
        var path = null;
        if (fileType == "oldValue") {
            path = this.oldPath;
            if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.oldFile)) {
                fileName = this.oldFile.fileName;
                if (this.finalApproval == "Approved") {
                    path = "OldFileApproved/approval/" + this.approvalId + "/" + path
                }
            } else {
                this.toastService.error("File Not Found");
            }
        } else if (fileType == "newValue") {
            fileName = this.newFile.fileName;
            path = this.newPath;
        }
        if (fileName == "" || fileName == undefined) {
            this.toastService.success("File Not Found")
        } else {

            var ext = "";
            ext = fileName.split('.')[1];
            if (fileType == "oldValue") {
                this.oldContentType = this.identifyContentType(ext);
            } else {
                this.newContentType = this.identifyContentType(ext);
            }
            var httpOptions = {
                //                headers: new HttpHeaders( {
                //                    'Accept': 'multipart/formdata',
                //                    'Authorization': 'Basic YWRtaW46YWRtaW4=',
                //                } )

            };

            //fetchFile
            /* this.http.post('download/files?fileName=' + fileName + '&path=' + path, httpOptions, { responseType: 'blob' }).subscribe(res => {

                var blob = new Blob([res], { type: this.contentType });

                let url = window.URL.createObjectURL(res);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.setAttribute('style', 'display: none');
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            }, err => {
                this.loading = false;
            }) */

            this.http.get(this.presignedUrl, { responseType: 'blob' }).subscribe(data => {
                var blob = new Blob([data], { type: this.contentType });
                let url = window.URL.createObjectURL(data);
                let a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display: none');
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
             

            }, err => {
            });

        }

    }

}