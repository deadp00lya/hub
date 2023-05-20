import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService, ToastService, WidgetService } from '@nw-workspace/common-services';
import { ApiRegistration } from '../../../model/ApiRegistration';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var require: any;
declare var $: any;

@Component({
    selector: 'app-apiregitsration',
    templateUrl: './apiregitsration.component.html',
    styleUrls: ['./apiregitsration.component.css']
})

export class ApiregitsrationComponent implements OnInit {
    currentPage: number = 1;
    searchKey: string = "";
    apiId: any;
    modalInstance: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    itemsPerPageToDisplay: number = 50;
    allHost: any;
    apiList: any;
    count: number;
    widgetWidth: number;
    api: ApiRegistration = new ApiRegistration();
    newConfigObject: {};
    configCode: any;
    apiListArray: any = [];
    uploadFile: any;
    cloneEventList: any;
    UploadBoxHeight: boolean;
    uploadModal: any;
    viewNeoConfig: boolean;



    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService, private utilityService: UtilityService) { }

    ngOnInit() {
        this.fetchApi();
        this.getAllHosts();
        //this.getCurrentWidgetCodeAppCode();
    }

    ngAfterViewInit() {

        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, {});

        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("apiView"), element => {
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


    refresh() {

        setTimeout(() => {
            $('select').formSelect();
            M.updateTextFields();
        }, 10);

    }

    reset() {

        this.api = new ApiRegistration();

        setTimeout(() => {
            $('select').formSelect();
            M.updateTextFields();
        }, 10);
    }

    saveApiList() {
        // this.api.widgetCode = this.widgetCode;
        if (!$('#saveModalIcon').hasClass('clicked')) {
            if (this.api.hosturlId.id == null || this.api.hosturlId.id == undefined) {
                this.toastService.error("Select host url");
            } else if (this.api.apiName == null || this.api.apiName == undefined || this.api.apiName.trim() == "") {
                this.toastService.error("Enter Api Name");
            } else if (this.api.apiCode == null || this.api.apiCode == undefined || this.api.apiCode.trim() == "") {
                this.toastService.error("Enter Api Code");
            } else if (this.api.api == null || this.api.api == undefined || this.api.api.trim() == "") {
                this.toastService.error("Enter Api");
            } else if (this.api.apiType == null || this.api.apiType == undefined || this.api.apiType.trim() == "") {
                this.toastService.error("Enter Api Type");
            } else {
                this.api.status = "save"
                this.apiListArray.push(this.api);
                $('#saveModalIcon').addClass('clicked');
                this.http.post("api", this.apiListArray).subscribe(data => {

                    setTimeout(() => {
                        $('#saveModalIcon').removeClass('clicked');
                    }, 0);

                    this.apiListArray = [];
                    this.reset();
                    this.refresh();
                    this.fetchApi();
                    this.closeModal();

                },
                    err => {
                        setTimeout(() => {
                            $('#saveModalIcon').removeClass('clicked');
                        }, 0);
                    })
            }
        } else {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.api.id)) {
                this.toastService.error("API Updation in Process");
            } else {
                this.toastService.error("API Creation in Process");
            }
        }
    }


    fetchApi() {

        this.http.get<any>("api?searchKey=" + this.searchKey + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(data => {
            this.apiList = data.payload.apiList;
            this.count = data.payload.count;
            this.actionButtonsDisplay();
            this.refresh();
        })
    }

    openUpdateapi(apis) {

        var elems = document.getElementById("apiList")
        var instance = M.Modal.init(elems, {});
        this.api = apis;
        this.refresh();
        instance.open();

    }
    removeApies(api) {
        this.api = api;
        this.api.status = "delete";
        this.http.put("api", this.api).subscribe(data => {
            this.fetchApi();
        })
    }

    getAllHosts() {

        this.http.get<any>("host").subscribe(data => {
            this.allHost = data.payload;
            this.refresh();
        })
    }


    closeModal() {
        var elemodal = document.getElementById('apiList');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.close();
    }

    openModal() {
        this.reset();
        var elemodal = document.getElementById('apiList');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.open();
    }

    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.apiList) {
            this.apiList[k].actionButtonsList = [];
            this.apiList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
            this.apiList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteButton", "Delete", environment.cdnPath + "/Hub/delete"));
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.apiList[k].neoConfigCode)) {
                this.apiList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
            }
        }
    }


    outputFromListView(outPutFromChild) {

        if (outPutFromChild.selectedAction == "viewButton") {
            this.apiId = outPutFromChild.listDetails;
            this.openUpdateapi(this.apiId);
        } else if (outPutFromChild.selectedAction == "deleteButton") {
            let api = outPutFromChild.listDetails;
            this.removeApies(api);
            this.fetchApi();
        } else if (outPutFromChild.selectedAction == "viewNeoConfig") {
            this.configCode = outPutFromChild.listDetails.neoConfigCode;
            this.openNeoConfigModal(this.configCode);
        } else if (outPutFromChild.listDetails == "add") {
            this.openModal();

        } else if (outPutFromChild.listDetails == "cloud_upload") {
            this.openUploadModal();

        } else if (outPutFromChild.listDetails == "cloud_download") {
            var res = this.cloneEventList;
            this.generateUrl(res);

        } else if (outPutFromChild.selectedAction == "rowBasedCheckBoxSelection") {
            this.cloneEventList = outPutFromChild.listDetails;

        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.currentPage = 1;
            this.searchKey = outPutFromChild.listDetails;
            this.fetchApi();
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                this.searchKey = outPutFromChild.textToSearch;
            }
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.fetchApi()
        }
    }

    /***********Download records**************** */
    generateUrl(res) {

        if (this.utilityService.isNullOrEmptyOrUndefined(res)) {
            this.toastService.error("Please Select Records")
        }
        else {
            for (let log of res) {
                log.id = null;
                log.status = "save";
                this.apiListArray.push(log);
            }
            var array = JSON.stringify(this.apiListArray)
            this.dyanmicDownloadByHtmlTag({
                fileName: 'ApiListReport.json',
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
        this.apiListArray = [];
    }

    fileChanged(event: any) {
        
        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
            this.uploadFile = reader.result;
            this.apiListArray = JSON.parse(this.uploadFile);
        }
        this.UploadBoxHeight = true;
        $(".uploadModal").css("margin-bottom", "60px");
        //$(".uploadModal").css("width", "90%");
        setTimeout(myGreeting, 5);
        function myGreeting() {
            document.getElementById("uploadModal").style.height = '500px';

        }
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
        this.apiListArray = [];
        $(".file-upload").val("");
        this.UploadBoxHeight = false;
    }

    //upload bulk files
    onUpload() {

        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.uploadFile)) {
            try {
                // this.apiListArray = JSON.parse(this.uploadFile);

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.apiListArray)) {
                    this.http.post<any>("api", this.apiListArray).subscribe(data => {

                        this.closeUploadModal();
                        $(".file-upload").val("");
                        for (var singleAction in data.payload) {
                            if (this.utilityService.isNotNullOrEmptyOrUndefined(data.payload[singleAction].errmsg)) {
                                this.toastService.error(data.payload[singleAction].errmsg);
                            }
                            else {
                                this.toastService.success(data.payload[singleAction].successmsg);
                            }
                        }


                        this.apiListArray = [];
                        this.uploadFile = null;
                        this.reset();
                        this.refresh();
                        this.fetchApi();
                        this.closeUploadModal();
                    }, err => {
                        $(".file-upload").val("");
                        this.apiListArray = [];
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




    /**************end of cloning ********************** */


    openNeoConfigModal(configCode) {
        this.viewNeoConfig = true;
    }

    validateClone(list) {
        
        for (let api of list) {
            if (api.hosturlId.id == null || api.hosturlId.id == undefined) {
                return this.toastService.error("Select host url");
            } else if (api.apiName == null || api.apiName == undefined || api.apiName.trim() == "") {
                return this.toastService.error("Enter Api Name");
            } else if (api.apiCode == null || api.apiCode == undefined || api.apiCode.trim() == "") {
                return this.toastService.error("Enter Api Code");
            } else if (api.api == null || api.api == undefined || api.api.trim() == "") {
                return this.toastService.error("Enter Api");
            } else if (api.apiType == null || api.apiType == undefined || api.apiType.trim() == "") {
                return this.toastService.error("Enter Api Type");
            }
        }
        this.onUpload();
    }

    triggered($event){
        this.viewNeoConfig = $event;
    }
}
