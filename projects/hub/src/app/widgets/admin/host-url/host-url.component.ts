import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as M from "materialize-css/dist/js/materialize";
import { ToastService, UtilityService, WidgetService } from '@nw-workspace/common-services';
declare var require: any;
declare var $: any;
import { HostUrlDTO } from '../../../model/HostUrlDTO';
import { environment } from 'projects/hub/src/environments/environment.prod';


@Component({
    selector: 'app-host-url',
    templateUrl: './host-url.component.html',
    styleUrls: ['./host-url.component.css']
})

export class HostUrlComponent implements OnInit {
    currentPage: number = 0;
    modalInstance: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    allHost: any;
    searchKey: string = "";
    widgetWidth: number;
    count: number;
    itemsPerPageToDisplay: number = 50;
    hosts: HostUrlDTO = new HostUrlDTO();
    newConfigObject: any;
    version: any;
    configCode: any;
    hostListArray: any = [];
    cloneEventList: [];
    uploadFile: any;
    UploadBoxHeight: boolean = false;
    uploadModal: any
    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService, private utilityService: UtilityService) { }

    ngOnInit() {
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
        erdUltraFast.listenTo(document.getElementById("host"), element => {
            this.onResizedEvent(element);
        });
    }

    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect();
            M.updateTextFields();
        }, 10);
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
        this.hosts = new HostUrlDTO();
        this.selectRefresh();
    }

    /* AddHosts() {
        if (this.hosts.hosturl == null || this.hosts.hosturl == undefined || this.hosts.hosturl.trim() == "") {
            this.toastService.error("Enter host url");
        } else if (this.hosts.hostName == null || this.hosts.hostName == undefined || this.hosts.hostName.trim() == "") {
            this.toastService.error("Enter host name");
        } else if (this.hosts.headers == null || this.hosts.headers == undefined || this.hosts.headers.trim() == "") {
            this.toastService.error("Enter headers");
        } else {
            // this.hosts.widgetCode = this.widgetCode;
            this.hosts.status = "save";
            this.hostListArray.push(this.hosts);

            this.http.post<any>("addHost", this.hostListArray).subscribe(data => {
                this.getAllHosts();
                this.closeModal();
                this.hostListArray = [];
                for (var singleAction in data.payload) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(data.payload[singleAction].errmsg)) {
                        this.toastService.error(data.payload[singleAction].errmsg);
                    }
                    else {
                        this.toastService.success(data.payload[singleAction].successmsg);
                    }
                }

            })
        }
    } */


    getAllHosts() {
        this.http.get<any>("host?searchKey=" + this.searchKey + "&page=" + this.currentPage + "&size=" + this.itemsPerPageToDisplay).subscribe(data => {
            this.allHost = data.payload;
            this.count = data.payload.length;
            this.actionButtonsDisplay();

            setTimeout(() => {
            }, 10);
        })
    }

    /* openUpdatehost(host) {
        var elems = document.getElementById("hostUrl")
        var instances = M.Modal.init(elems, {});
        this.hosts = host;
        this.selectRefresh();

        instances.open();
    } */

    removeHost(host) {
        this.hosts=host;
        this.hosts.status="delete";
        this.http.put<any>("host", this.hosts).subscribe(data => {
            this.getAllHosts();
            this.selectRefresh();
        })
    }


    /* closeModal() {
        var elemodal = document.getElementById('hostUrl');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.close();
        this.reset();
    } */



    /* openModal() {
        var elemodal = document.getElementById('hostUrl');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.open();
        this.reset();
    }
 */
    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.allHost) {
            this.allHost[k].actionButtonsList = [];
            //            this.employeeViewList[k].showViewButton = true;
            //            this.employeeViewList[k].showEventButton = true;
            //this.allHost[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View",environment.cdnPath+"/Hub/view"));
            this.allHost[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteButton", "Delete",environment.cdnPath+"/Hub/delete"));
        }
    }

    outputFromListView(outPutFromChild) {
       /*if (outPutFromChild.selectedAction == "viewButton") {
            let host = outPutFromChild.listDetails;
            this.openUpdatehost(host)
        } else */if (outPutFromChild.selectedAction == "deleteButton") {
            this.removeHost(outPutFromChild.listDetails);
        } /* else if (outPutFromChild.selectedAction == "applicationButton") {
            this.openModal();
        } */ else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                this.searchKey = outPutFromChild.textToSearch;
            }
            this.searchKey = outPutFromChild.textToSearch;
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.getAllHosts()
        } else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
            this.getAllHosts();
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchKey = outPutFromChild.listDetails;
            this.getAllHosts();
        }
    }


    /***********Cloning Configuration Starts**************** */
    generateUrl(res) {
        
        if (this.utilityService.isNullOrEmptyOrUndefined(res)) {
            this.toastService.error("Please Select Records")
        }
        else {
            for (let log of res) {
                log.id = null;
                log.status = "save";
                this.hostListArray.push(log);
            }
            var array = JSON.stringify(this.hostListArray)
            this.dyanmicDownloadByHtmlTag({
                fileName: 'HostReport.json',
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
        this.hostListArray = [];
    }

    fileChanged(event: any) {
        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
            this.uploadFile = reader.result;
            this.hostListArray = JSON.parse(this.uploadFile);
        }
        this.UploadBoxHeight = true;
        $(".uploadModal").css("margin-bottom", "60px");
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
        this.hostListArray = [];
        $(".file-upload").val("");
    }

    ////upload bulk files
    onUpload() {
        
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.uploadFile)) {
            try {
                // this.hostListArray = JSON.parse(this.uploadFile);

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.hostListArray)) {
                    this.http.post<any>("addHost", this.hostListArray).subscribe(data => {
                        
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

                        this.getAllHosts();
                        this.hostListArray = [];
                        this.uploadFile = null;
                    }, err => {
                        $(".file-upload").val("");
                        this.hostListArray = [];
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

 /*    getCurrentWidgetCodeAppCode() {
        return this.http.get<any>("neosuite/api/getMyAllWidgets")
            .subscribe(res => {
                var widgetList = [];
                widgetList = res.payload;
                let currentWidgetInfo = widgetList.filter(widget => widget.widgetPath === 'HubHostUrlComponent');
                this.currentAppCode = currentWidgetInfo[0].application.appCode;
                this.widgetCode = currentWidgetInfo[0].widgetCode;
            })
    } */

    openNeoConfigModal(configCode) {
        
        this.newConfigObject = {};

        if (this.utilityService.isNullOrEmptyOrUndefined(configCode)) {
            this.toastService.error("Config Code Empty");
            return false;
        }

        this.http.get<any>("getLatestConfiguration?configCode=" + configCode).subscribe(data => {
            this.newConfigObject = data.payload;
            setTimeout(() => {
                var elemodal = document.getElementById('neoConfigModal');
                this.modalInstance = M.Modal.init(elemodal, {});
                this.modalInstance.open();

                var textedJson = JSON.stringify(this.newConfigObject, undefined, 4);
                $('#myTextarea').text(textedJson);
            }, 10);
        })
    }


    validateClone(list) {
        for (let hosts of list) {
            if (hosts.hosturl == null || this.hosts.hosturl == undefined || this.hosts.hosturl.trim() == "") {
                return this.toastService.error("Enter host url");
            } else if (hosts.hostName == null || this.hosts.hostName == undefined || this.hosts.hostName.trim() == "") {
                return this.toastService.error("Enter host name");
            } else if (hosts.headers == null || this.hosts.headers == undefined || this.hosts.headers.trim() == "") {
                return this.toastService.error("Enter headers");
            }
        }
        this.onUpload();
    }

    /**************end of cloning ********************** */




}
