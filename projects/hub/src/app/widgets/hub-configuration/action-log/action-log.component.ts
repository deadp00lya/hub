import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from '@angular/common/http';
import { ToastService, WidgetService } from '@nw-workspace/common-services';
import { ActionDTO } from '../../../model/ActionDTO';
import { UtilityService } from '../../../services/utility.service';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var require: any;
declare var $: any;

@Component({
    selector: 'app-action-log',
    templateUrl: './action-log.component.html',
    styleUrls: ['./action-log.component.css']
})

export class ActionLogComponent implements OnInit {
    widgetWidth: number;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    actionLog: ActionDTO = new ActionDTO();
    itemsPerPageToDisplay: number = 50;
    currentPage: number = 1;
    searchAction: string = "";
    count: any;
    actionList: any;
    cloneEventList: [];
    downloadJsonHref: any;
    jsonFlowFile: FormData;
    uploadFile: any;
    actionArray: any = [];
    configCode: any;
    newConfigObject: {};
    modalInstance: any;
    viewNeoConfig: boolean;

    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService, private utilityService: UtilityService) { }

    ngOnInit() {
        this.fetchActionList();
        //this.getCurrentWidgetCodeAppCode();
    }

    ngAfterViewInit() {

        setTimeout(function () {
            M.AutoInit();
        }, 10);



        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("actionView"), element => {
            this.onResizedEvent(element);
        });
    }


    closeModal() {
        this.reset()
        var elemodal = document.getElementById('actionModal');
        var instance = M.Modal.init(elemodal, {});
        instance.close();
    }

    openDropdown() {

        let dropDownEle: Element = document.getElementById("eventDropdownbtn")
        var instance = M.Dropdown.init(dropDownEle, { coverTrigger: false, closeOnClick: true });
        instance.open();
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


    reset() {
        this.actionLog = new ActionDTO();

        var elems = document.getElementById('actionModal');
        var instance = M.Modal.init(elems, {});
        this.selectRefresh();
    }

    isJSON(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }


    saveAction() {

        if (this.actionLog.actionName == null || this.actionLog.actionName.trim() == "" || this.actionLog.actionName == undefined) {
            this.toastService.error("Enter Action Name");
            return false;
        }
        if (this.actionLog.actionCode == null || this.actionLog.actionCode.trim() == "" || this.actionLog.actionCode == undefined) {
            this.toastService.error("Enter Action Code");
            return false;
        }
        if (this.actionLog.dataInjection == null || this.actionLog.dataInjection.trim() == "" || this.actionLog.dataInjection == undefined) {
            return this.toastService.error("Enter Static Data Input");
        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.actionLog.dataInjection)) {
            if (!this.isJSON(this.actionLog.dataInjection)) {
                return this.toastService.error("Enter Static Data in correct JSON Format");
            }
        }

        //this.actionLog.widgetCode = this.widgetCode;
        this.actionLog.status = "save";
        this.actionArray.push(this.actionLog);
        if (this.utilityService.isNullOrEmptyOrUndefined(this.actionArray)) {
            return this.toastService.error("Empty Data");
        } else {
            this.actionLog.status = "save";
            this.http.post<any>("action", this.actionArray).subscribe(data => {
                this.reset();
                this.fetchActionList();
                this.selectRefresh();
                this.closeModal();
                this.actionArray = [];

                /* if (this.utilityService.isNotNullOrEmptyOrUndefined(data.payload[0].errmsg)) {
                    this.toastService.error(data.payload[0].errmsg);
                }
                else {
                    this.toastService.success(data.payload[0].successmsg);
                } */
            });
        }
    }
    updateAction(action) {
        if (this.utilityService.isNotNullOrEmptyOrUndefined(action)) {
            this.actionLog = action;
        }
        this.actionLog.status = "delete";
        this.http.put<any>("action", this.actionLog).subscribe(data => {

            this.fetchActionList();
            this.selectRefresh();

        });

    }





    fetchActionList() {

        this.http.get<any>("action?searchAction=" + this.searchAction + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(data => {
            this.actionList = data.payload.actionList;
            this.count = data.payload.count;
            this.actionButtonsDisplay();
            setTimeout(function () {
            }, 0);
        })
    }



    selectRefresh() {
        setTimeout(function () {
            $('select').formSelect();
            M.updateTextFields();
        }, 0);

    }

    openUpdateAction(action) {

        var elems = document.getElementById('actionModal');
        var instance = M.Modal.init(elems, {});

        if (this.utilityService.isNotNullOrEmptyOrUndefined(action))
            this.actionLog = Object.assign(action, {});

        instance.open();
        this.selectRefresh();
    }



    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.actionList) {
            this.actionList[k].actionButtonsList = [];
            this.actionList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
            if (this.actionList[k].enabled)
                this.actionList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Deactive", "Deactive", environment.cdnPath + "/Hub/flash_off"));
            if (!this.actionList[k].enabled)
                this.actionList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Active", "Active", environment.cdnPath + "/Hub/flash_on"));
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.actionList[k].neoConfigCode)) {
                this.actionList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
            }

        }
    }


    /*******************************Neoconfig Cloning starts********************************************/
    generateUrl(res) {

        if (this.utilityService.isNullOrEmptyOrUndefined(res)) {
            this.toastService.error("Please Select Records")
        }
        else {
            for (let log of res) {
                log.id = null;
                log.status = "save";
                this.actionArray.push(log);
            }
            var array = JSON.stringify(this.actionArray)
            this.dyanmicDownloadByHtmlTag({
                fileName: 'ActionReport.json',
                text: array
            });

        }
    }

    private setting = {
        element: {
            dynamicDownload: null as HTMLElement
        }
    }

    private dyanmicDownloadByHtmlTag(arg: {
        fileName: string,
        text: any
    }) {
        if (!this.setting.element.dynamicDownload) {
            this.setting.element.dynamicDownload = document.createElement('a');
        }
        const element = this.setting.element.dynamicDownload;
        element.setAttribute('href', `data:${'text/plain'};charset=utf-8,${encodeURIComponent(arg.text)}`);
        element.setAttribute('download', arg.fileName);
        var event = new MouseEvent("click");
        element.dispatchEvent(event);
        this.actionArray = [];
    }

    openUploadModal() {

        var elem = document.getElementById("uploadModal");
        var instance = M.Modal.init(elem, {});
        instance.open();
    }

    closeUploadModal() {
        var elemodal = document.getElementById('uploadModal');
        var instance = M.Modal.init(elemodal, {});
        instance.close();
        this.actionArray = [];
        $(".file-upload").val("");
    }

    fileChanged(event: any) {

        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
            this.uploadFile = reader.result;
        }
    }

    openNeoConfigModal() {
        this.viewNeoConfig = true;
    }

    triggered($event){
        this.viewNeoConfig = $event;
    }

    onUpload() {

        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.uploadFile)) {
            try {
                this.actionArray = JSON.parse(this.uploadFile);

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.actionArray)) {
                    this.http.post<any>("action", this.actionArray).subscribe(data => {

                        this.closeUploadModal();
                        $(".file-upload").val("");
                        /* for (var singleAction in data.payload) {
                            if (this.utilityService.isNotNullOrEmptyOrUndefined(data.payload[singleAction].errmsg)) {
                                this.toastService.error(data.payload[singleAction].errmsg);
                            }
                            else {
                                this.toastService.success(data.payload[singleAction].successmsg);
                            }
                        } */

                        this.fetchActionList();
                        this.actionArray = [];
                        this.uploadFile = null;
                    }, err => {
                        $(".file-upload").val("");
                        this.actionArray = [];
                        this.uploadFile = null;
                        this.closeUploadModal();
                    });
                }
            }
            catch {
                this.toastService.error("No JSON File Found");
                $(".file-upload").val("");
            }
        }
        else {
            this.toastService.error("Choose File")
        }


    }

    /*******************************Neoconfig Cloning Ends********************************************/

    outputFromListView(outPutFromChild) {

        if (outPutFromChild.selectedAction == "viewButton") {
            let events = outPutFromChild.listDetails;
            this.openUpdateAction(events)
        } else if (outPutFromChild.selectedAction == "Active") {
            var action = outPutFromChild.listDetails;
            action.enabled = true
            this.updateAction(action);
        } else if (outPutFromChild.selectedAction == "Deactive") {
            var action = outPutFromChild.listDetails;
            action.enabled = false
            this.updateAction(action);
        } else if (outPutFromChild.listDetails == "add") {
            this.reset();
            this.openUpdateAction(null)
        } else if (outPutFromChild.listDetails == "cloud_download") {
            var res = this.cloneEventList
            this.generateUrl(res)

        } else if (outPutFromChild.listDetails == "cloud_upload") {
            this.openUploadModal();
        } else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
            this.fetchActionList();
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchAction = outPutFromChild.listDetails;
            this.fetchActionList();
        } else if (outPutFromChild.selectedAction == "rowBasedCheckBoxSelection") {
            this.cloneEventList = outPutFromChild.listDetails;
        } else if (outPutFromChild.selectedAction == "viewNeoConfig") {
            this.configCode = outPutFromChild.listDetails.neoConfigCode;
            this.openNeoConfigModal();
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchAction)) {
                this.searchAction = outPutFromChild.textToSearch;
            }
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.fetchActionList();
        }

    }


}
