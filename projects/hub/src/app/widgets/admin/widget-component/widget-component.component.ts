import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from '@angular/common/http';
import { UtilityService, ToastService, WidgetService } from '@nw-workspace/common-services';
import { WidgetComponent } from '../../../model/WidgetComponent';
import { WidgetComponentMappingDTO } from '../../../model/WidgetComponentMappingDTO';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var require: any;
declare var $: any;

@Component({
    selector: 'app-widget-component',
    templateUrl: './widget-component.component.html',
    styleUrls: ['./widget-component.component.css']
})

export class WidgetComponentComponent implements OnInit {
    editWidgetCompoent: boolean = false;

    widgetComponentActiveList: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    widgetMappingComponentList: any;
    widgetComponentList: any;
    modalInstance2: any;
    itemsPerPageToDisplay: number = 50;

    widgetWidth: number;
    widgetComponent: WidgetComponent = new WidgetComponent();
    configPage: number = 0;
    widgetComponentView: boolean = true;
    widgetComponentMappingView: boolean;

    itemsPerPage: number = 10;
    currentPage: number = 1;
    pageSizeOption: any = [10, 20, 30];
    loader: boolean;
    searchKey: string = "";
    modalInstance: any;
    count: number;
    widgetMappingcount: number
    seriesList: any;
    widgetComponentValues: WidgetComponent = new WidgetComponent();
    widgetComponentMappingDTO: WidgetComponentMappingDTO = new WidgetComponentMappingDTO();
    widgetMappingComponentList1: boolean;
    cloneEventList: [];
    downloadJsonHref: any;
    jsonFlowFile: FormData;
    uploadFile: any;
    actionArray: any = [];
    configCode: any;
    newConfigObject: {};
    value: string;
    viewNeoConfig: boolean = false;



    componentTypeList: any = ["create", "update", "list"];
    widgetComponentArray: any;
    widgetMappingArray: any;

    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService, private utilityService: UtilityService) { }

    ngOnInit() {
        this.fetchWidgetComponent();
        this.fetchWidgetComponentEnabledTrue();
        //this.getCurrentWidgetCodeAppCode();
    }

    ngAfterViewInit() {
        setTimeout(function () {

            $('.modal').modal();
            $('select').formSelect();
            let dropDownEle: Element = document.getElementById("viewSeriesPageSizeDropdown")
            var instances = M.Dropdown.init(dropDownEle, { coverTrigger: false, closeOnClick: true });
            M.AutoInit();
        }, 10);



        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("pexWidgetComponent"), element => {
            this.onResizedEvent(element);
        });
    }

    onResizedEvent(event) {
        this.widgetWidth = this.widgetService.onResized(event);
        if (this.widgetWidth > 12) {
            this.widgetWidth = 12
        }
        else if (this.widgetWidth == 8) {
            setTimeout(function () {
                M.AutoInit();
            }, 10);
        }
    }

    getResponsiveClasses(widgetWidth, classSizeList, defaultClasses) {
        return this.widgetService.getResponsiveClasses(widgetWidth, classSizeList, defaultClasses);
    }

    getHideShow(className, widgetWidth, comparator, startSize, endSize) {
        return this.widgetService.getHideShow(className, widgetWidth, comparator, startSize, endSize);
    }

    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect();
            M.updateTextFields();
        }, 10);
    }

    setConfigPage(configPage) {
        if (configPage == 0) {
            this.widgetComponentView = true;
            this.widgetComponentMappingView = false;
            this.cloneEventList = [];
        } else if (configPage == 1) {
            this.fetchWidgetComponentMapping();
            this.widgetComponentView = false;
            this.widgetComponentMappingView = true;
            this.cloneEventList = [];
        }
    }

    openSideNav() {
        var instance = M.Sidenav.init(document.getElementById('pexWidgetSlideOut'), {
            onOpenStart: () => {
                $(".sidenav-overlay").addClass("view_noOverlay");
            },
            onCloseEnd: () => {
                $(".sidenav-overlay").removeClass("view_noOverlay");
            }
        });
        instance.open();

    }

    openDropdown() {
        let dropDownEle: Element = document.getElementById("viewSeriesPageSizeDropdown")
        var instance = M.Dropdown.init(dropDownEle, { coverTrigger: false, closeOnClick: true });
        instance.open();
    }

    setPageSize(size) {
        this.currentPage = 1;
        var fetchData = false;

        if (this.itemsPerPage < size)
            fetchData = true;
        this.itemsPerPage = size;
        if (fetchData) {
            //            this.fetchSeries();
        }
        else {
            //            this.seriesList = this.seriesList.slice( 0, size );
        }
        setTimeout(() => {
            M.AutoInit();
        }, 0);
    }

    closeModalWidgetComponentView() {
        var elemodal = document.getElementById('widgetComponent');
        this.modalInstance = M.Modal.init(elemodal, {});

        if (this.editWidgetCompoent) {
            this.editWidgetCompoent = false;
        }

        this.modalInstance.close();
        this.resetWidgetComponent();
    }

    openModalWidgetComponentView() {
        var elemodal = document.getElementById('widgetComponent');
        this.modalInstance = M.Modal.init(elemodal, {});
        this.modalInstance.open();

        setTimeout(() => {
            M.updateTextFields();
        }, 10);

    }

    closeModalWidgetMappingComponentView() {
        var elemodal = document.getElementById('widgetMappingComponent');
        this.modalInstance2 = M.Modal.init(elemodal, {});

        this.modalInstance2.close();
        this.resetWidgetMappingComponent();
    }

    openModalWidgetMappingComponentView() {
        var elemodal = document.getElementById('widgetMappingComponent');
        this.modalInstance2 = M.Modal.init(elemodal, {});

        this.modalInstance2.open();
        setTimeout(function () {
            M.updateTextFields();
            $('select').formSelect();
        }, 10);
    }

    resetWidgetComponent() {
        this.widgetComponentValues.id = null;
        this.widgetComponentValues.widgetComponentCode = null;
        this.widgetComponentValues.widgetComponentName = null;
        this.widgetComponentValues.listView = null;
    }

    resetWidgetMappingComponent() {
        this.widgetComponentMappingDTO.id = null;
        this.widgetComponentMappingDTO.widgetCode = null;
        this.widgetComponentMappingDTO.componentType = null;
        this.widgetComponentMappingDTO.widgetComponent = null;
        this.widgetComponentMappingDTO.listViewComponent = null;
        this.widgetComponentMappingDTO.keyCodes = null;
    }

    saveWidgetComponent() {
        if (this.widgetComponentValues.widgetComponentCode == null || this.widgetComponentValues.widgetComponentCode == undefined || this.widgetComponentValues.widgetComponentCode.trim() == "") {
            this.toastService.error("Enter WidgetComponent Code");
        } else if (this.widgetComponentValues.widgetComponentName == null || this.widgetComponentValues.widgetComponentName == undefined || this.widgetComponentValues.widgetComponentName.trim() == "") {
            this.toastService.error("Enter WidgetComponent Name");
        } else {

            this.widgetComponentValues.status = "save";
            this.http.post<any>("widget", this.widgetComponentValues).subscribe(data => {
                this.closeModalWidgetComponentView();
                this.fetchWidgetComponent();
                this.fetchWidgetComponentEnabledTrue();
            });
        }

    }

    fetchWidgetComponent() {
        this.http.get<any>("widget?searchKey=" + this.searchKey + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay + "&brief=true").subscribe(data => {
            this.widgetComponentList = data.payload.WidgetComponentList;
            this.count = data.payload.count
            this.actionButtonsDisplay();
            this.selectRefresh();
        });
    }

    editWidgetComponent(widgetComponent) {
        this.editWidgetCompoent = true;
        Object.assign(this.widgetComponentValues, widgetComponent);
        this.openModalWidgetComponentView();
    }

    updateWidgetComponent(widgetComponent) {
        if (widgetComponent.enabled) {
            widgetComponent.enabled = false;
        } else {
            widgetComponent.enabled = true;
        }

        this.widgetComponent = widgetComponent;
        this.widgetComponent.status = "delete";

        this.http.put<any>("widget", widgetComponent).subscribe(data => {
            this.fetchWidgetComponent();
            this.fetchWidgetComponentEnabledTrue();
        });

    }

    saveWidgetComponentMapping() {
        if (this.widgetComponentMappingDTO.widgetCode == null || this.widgetComponentMappingDTO.widgetCode == undefined || this.widgetComponentMappingDTO.widgetCode.trim() == "") {
            this.toastService.error("Enter widget code");
            return;
        } else if (this.widgetComponentMappingDTO.componentType == null || this.widgetComponentMappingDTO.componentType == undefined || this.widgetComponentMappingDTO.componentType == "") {
            this.toastService.error("Select component type");
            return;
        } else if (this.widgetComponentMappingDTO.widgetComponent == null || this.widgetComponentMappingDTO.widgetComponent == undefined || this.widgetComponentMappingDTO.widgetComponent == "") {
            this.toastService.error("Select widget component");
            return;
        } else if (this.widgetComponentMappingDTO.componentType != null || this.widgetComponentMappingDTO.componentType != undefined || this.widgetComponentMappingDTO.componentType != "") {
            if (this.widgetComponentMappingDTO.componentType == "list") {
                if (this.widgetComponentMappingDTO.listViewComponent == null || this.widgetComponentMappingDTO.listViewComponent == undefined || this.widgetComponentMappingDTO.listViewComponent.trim() == "") {
                    this.toastService.error("Enter list view component");
                    return;
                }
                if (this.widgetComponentMappingDTO.keyCodes == null || this.widgetComponentMappingDTO.keyCodes == undefined || this.widgetComponentMappingDTO.keyCodes.trim() == "") {
                    this.toastService.error("Enter KeyCodes");
                    return;
                }
            }
        }

        this.widgetComponentMappingDTO.status = "save";
        this.http.post<any>("widget/mapping", this.widgetComponentMappingDTO).subscribe(data => {
            this.closeModalWidgetMappingComponentView();
            this.fetchWidgetComponentMapping();
        });
    }

    fetchWidgetComponentMapping() {
        this.http.get<any>("widget/mapping?searchKey=" + this.searchKey + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(data => {
            this.widgetMappingComponentList = data.payload.widgetMappingList;
            this.widgetMappingcount = data.payload.count
            this.actionButtonsDisplay();

            for (var widgetMappingComponent of this.widgetMappingComponentList) {
                for (var widgetComponent of this.widgetComponentList) {
                    if (widgetComponent.widgetComponentCode == widgetMappingComponent.widgetComponent) {
                        widgetMappingComponent.widgetComponentName = widgetComponent.widgetComponentName;
                    }
                }
            }

        });

        this.selectRefresh();
    }

    fetchWidgetComponentEnabledTrue() {
        this.http.get<any>("widget").subscribe(data => {
            this.widgetComponentActiveList = data.payload.widgetMappingList;
            this.selectRefresh();
        });
    }

    editWidgetComponentMapping(widgetMappingComponent) {
        Object.assign(this.widgetComponentMappingDTO, widgetMappingComponent);
        this.openModalWidgetMappingComponentView();
    }

    updateWidgetMappingComponent(widgetMappingComponent) {
        if (widgetMappingComponent.enabled) {
            widgetMappingComponent.enabled = false;
        } else {
            widgetMappingComponent.enabled = true;
        }
        widgetMappingComponent.status = "delete";
        this.http.put<any>("widget/mapping", widgetMappingComponent).subscribe(data => {
            this.fetchWidgetComponentMapping();
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
        if (this.widgetComponentView) {
            for (var k in this.widgetComponentList) {
                this.widgetComponentList[k].actionButtonsList = [];
                this.widgetComponentList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
                if (this.widgetComponentList[k].enabled)
                    this.widgetComponentList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Deactive", "Deactive", environment.cdnPath + "/Hub/flash_off"));
                if (!this.widgetComponentList[k].enabled)
                    this.widgetComponentList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Active", "Active", environment.cdnPath + "/Hub/flash_on"));
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.widgetComponentList[k].neoConfigCode))
                    this.widgetComponentList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
            }
        } else if (this.widgetComponentMappingView) {
            for (var k in this.widgetMappingComponentList) {
                this.widgetMappingComponentList[k].actionButtonsList = [];
                this.widgetMappingComponentList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
                if (this.widgetMappingComponentList[k].enabled)
                    this.widgetMappingComponentList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Deactive", "Deactive", environment.cdnPath + "/Hub/flash_off"));
                if (!this.widgetMappingComponentList[k].enabled)
                    this.widgetMappingComponentList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Active", "Active", environment.cdnPath + "/Hub/flash_on"));
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.widgetMappingComponentList[k].neoConfigCode))
                    this.widgetMappingComponentList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
            }
        }
    }

    outputFromListView(outPutFromChild) {
        if (outPutFromChild.selectedAction == "viewButton") {
            if (this.widgetComponentView) {
                let widgetComponent = outPutFromChild.listDetails;
                this.editWidgetComponent(widgetComponent)
            } else {
                let widgetMappingComponent = outPutFromChild.listDetails;
                this.editWidgetComponentMapping(widgetMappingComponent);
                this.fetchWidgetComponentMapping()
            }
        } else if (outPutFromChild.selectedAction == "Deactive") {
            if (this.widgetComponentView) {
                let widgetComponent = outPutFromChild.listDetails;
                this.updateWidgetComponent(widgetComponent)
            } else {
                let widgetMappingComponent = outPutFromChild.listDetails;
                this.updateWidgetMappingComponent(widgetMappingComponent)
                this.fetchWidgetComponentMapping()
            }
        } else if (outPutFromChild.selectedAction == "Active") {
            if (this.widgetComponentView) {
                let widgetComponent = outPutFromChild.listDetails;
                this.updateWidgetComponent(widgetComponent)
                this.fetchWidgetComponent()
            } else {
                let widgetMappingComponent = outPutFromChild.listDetails;
                this.updateWidgetMappingComponent(widgetMappingComponent)
                this.fetchWidgetComponentMapping()
            }
        } else if (outPutFromChild.listDetails == 'add' && outPutFromChild.selectedAction == "applicationButton") {
            if (this.widgetComponentView)
                this.openModalWidgetComponentView();
            else
                this.openModalWidgetMappingComponentView();
        } else if (outPutFromChild.listDetails == "cloud_download") {
            var res = this.cloneEventList
            this.generateUrl(res)

        } else if (outPutFromChild.listDetails == "cloud_upload") {
            this.openUploadModal();

        } else if (outPutFromChild.selectedAction == "rowBasedCheckBoxSelection") {
            this.cloneEventList = outPutFromChild.listDetails;

        } else if (outPutFromChild.selectedAction == "globalSearch") {
            if (this.widgetComponentView) {
                this.searchKey = outPutFromChild.listDetails;
                this.fetchWidgetComponent()
            } else {
                this.searchKey = outPutFromChild.listDetails;
                this.fetchWidgetComponentMapping()
            }
        } else if (outPutFromChild.selectedAction == "listViewRowSize") {
            if (this.widgetComponentView) {
                this.itemsPerPageToDisplay = outPutFromChild.listDetails;
                this.fetchWidgetComponent()
            } else {
                this.itemsPerPageToDisplay = outPutFromChild.listDetails;
                this.fetchWidgetComponentMapping()
            }
        } else if (outPutFromChild.selectedAction == "viewNeoConfig") {
            this.configCode = outPutFromChild.listDetails.neoConfigCode;
            this.openNeoConfigModal(this.configCode);

        } else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.widgetComponentView) {
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                    this.searchKey = outPutFromChild.textToSearch;
                }
                this.currentPage = outPutFromChild.listDetails.page;
                this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
                this.fetchWidgetComponent()
            } else {
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                    this.searchKey = outPutFromChild.textToSearch;
                }
                this.currentPage = outPutFromChild.listDetails.page;
                this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
                this.fetchWidgetComponentMapping();
            }
        }
    }




    /*******************************Neoconfig Cloning starts********************************************/
    generateUrl(res) {
        if (this.widgetComponentView) {
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
                    fileName: 'WidgetComponent.json',
                    text: array
                });

            }
        } else {
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
                    fileName: 'WidgetComponentMapping.json',
                    text: array
                });

            }
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
        if (this.widgetComponentView)
            this.value = "Upload Widgets";
        else
            this.value = "Upload Widget Mappings";

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

    /*   getCurrentWidgetCodeAppCode() {
  
          return this.http.get<any>("neosuite/api/getMyAllWidgets")
              .subscribe(res => {
                  var widgetList = [];
                  widgetList = res.payload;
                  let currentWidgetInfo = widgetList.filter(widget => widget.widgetPath === 'HubWidgetComponentComponent');
                  this.currentAppCode = currentWidgetInfo[0].application.appCode;
                  this.widgetCode = currentWidgetInfo[0].widgetCode;
  
              })
  
      } */

    openNeoConfigModal(configCode) {
       this.viewNeoConfig = true;
    }
    triggered($event){
        this.viewNeoConfig = $event;
    }

    onUpload() {
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.uploadFile)) {
            try {
                if (this.widgetComponentView) {
                    this.widgetComponentArray = JSON.parse(this.uploadFile);

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.widgetComponentArray)) {
                        //saveJsonwidgetComponent
                        this.http.patch<any>("widget", this.widgetComponentArray).subscribe(data => {
                            this.closeUploadModal();
                            $(".file-upload").val("");
                            this.fetchWidgetComponent();
                            this.fetchWidgetComponentEnabledTrue();
                            this.widgetComponentArray = [];
                            this.uploadFile = null;
                        }, err => {
                            $(".file-upload").val("");
                            this.widgetComponentArray = [];
                            this.uploadFile = null;
                            this.closeUploadModal();
                        });
                    }
                }
                else {
                    /*********Widget component mapping */
                    this.widgetMappingArray = JSON.parse(this.uploadFile);

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.widgetMappingArray)) {
                        //saveJsonwidgetMappingComponent
                        this.http.patch<any>("widget/mapping", this.widgetMappingArray).subscribe(data => {

                            this.closeUploadModal();
                            $(".file-upload").val("");


                            this.fetchWidgetComponentMapping();
                            this.widgetMappingArray = [];
                            this.uploadFile = null;
                        }, err => {
                            $(".file-upload").val("");
                            this.widgetMappingArray = [];
                            this.uploadFile = null;
                            this.closeUploadModal();
                        });
                    }

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

}
