import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from "@angular/common/http";
import { ToastService } from 'projects/hub/src/app/services/toast.service';
import { WidgetService } from '@nw-workspace/common-services';
import { GenerationServiceDTO } from 'projects/hub/src/app/model/GenerationServiceDTO';
import { UtilityService } from 'projects/hub/src/app/services/utility.service';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-series',
    templateUrl: './series.component.html',
    styleUrls: ['./series.component.css']
})

export class SeriesComponent implements OnInit {
    modalInstance: any;
    count: any;
    seriesList: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    itemsPerPageToDisplay: number = 50;
    searchKey: string = "";
    generationServiceDTO: GenerationServiceDTO = new GenerationServiceDTO();
    generationServicesDTO: GenerationServiceDTO = new GenerationServiceDTO();
    itemsPerPage: number = 10;
    currentPage: number = 1;
    pageSizeOption: any = [10, 20, 30];
    widgetWidth: number;
    loader: boolean;
    cloneEventList: any;
    seriesArray: any = [];
    uploadFile: any;
    newConfigObject: {};
    configCode: any;
    viewNeoConfig: boolean = false;

    constructor(private http: HttpClient, private widgetService: WidgetService, private toastService: ToastService, private utilityService: UtilityService) { }

    ngOnInit() {
        this.fetchSeries();
        // this.getCurrentWidgetCodeAppCode();
    }


    ngAfterViewInit() {

        setTimeout(function () {

            $('.modal').modal();
            let dropDownEle: Element = document.getElementById("viewSeriesPageSizeDropdown")
            var instances = M.Dropdown.init(dropDownEle, { coverTrigger: false, closeOnClick: true });
            M.AutoInit();
        }, 10);

        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("seriesViewPage"), element => {
            this.onResizedEvent(element);
        });

    }



    //                             -------------------Pagination DropDown--------------------

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
            this.fetchSeries();
        }
        else {
            this.seriesList = this.seriesList.slice(0, size);
        }
        setTimeout(() => {
            M.AutoInit();
        }, 0);
    }


    closeModal() {
        var elemodal = document.getElementById('createSeries');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.close();
        this.generationServiceDTO = new GenerationServiceDTO();
    }



    //                                    ----------------Responsive------------------

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



    //                                      ----------------Refresh Function-----------------

    pageRefresh() {
        setTimeout(function () {
            M.AutoInit();
        }, 0);
    }




    saveSeries() {
        if (this.generationServiceDTO.series == null || this.generationServiceDTO.series == undefined || this.generationServiceDTO.series.trim() == "") {
            this.toastService.error("Enter Series Name");
        } else if (this.generationServiceDTO.value == null || this.generationServiceDTO.value == undefined || this.generationServiceDTO.value.trim() == "") {
            this.toastService.error("Enter Value");
        } else {
            //this.seriesArray = null;
            this.generationServiceDTO.status = "save";
            this.seriesArray.push(this.generationServiceDTO);

            if (this.utilityService.isNullOrEmptyOrUndefined(this.seriesArray)) {
                return this.toastService.error("Series is Empty");
            }
            //this.generationServiceDTO.widgetCode = this.widgetCode;
            this.http.post<any>("series", this.seriesArray).subscribe(data => {

                this.fetchSeries();
                this.generationServiceDTO = new GenerationServiceDTO();
                this.closeModal();
                this.seriesArray = [];

                /*    if (this.utilityService.isNotNullOrEmptyOrUndefined(data.payload[0].errmsg)) {
                       this.toastService.error(data.payload[0].errmsg);
                   }
                   else {
                       this.toastService.success(data.payload[0].successmsg);
                   } */

            });
        }
    }



    fetchSeries() {

        this.http.get<any>("series?searchKey=" + this.searchKey + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(data => {
            this.seriesList = data.payload.seriesList;
            this.count = data.payload.count;
            this.actionButtonsDisplay();
        });


    }


    editSeries(serie) {
        this.generationServicesDTO = Object.assign({}, serie);
        let elm = document.getElementById('updateSeries');
        let instance = M.Modal.init(elm, {});
        instance.open();

    }

    openModal() {
        let elm = document.getElementById('createSeries');
        let instance = M.Modal.init(elm, {});
        instance.open();

    }


    updateSeries() {
        this.generationServicesDTO.status = "save";
        this.seriesArray.push(this.generationServicesDTO);
        this.http.post<any>("series", this.seriesArray).subscribe(data => {
            this.fetchSeries();
            this.seriesArray = [];
        }, err => {
            this.seriesArray = [];
        });

    }

    deleteSeries(series) {
        this.generationServiceDTO = series;
        this.generationServiceDTO.status = "delete";
        this.http.put<any>("series", this.generationServiceDTO).subscribe(data => {
            this.fetchSeries();
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
        for (var k in this.seriesList) {
            this.seriesList[k].actionButtonsList = [];
            this.seriesList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
            this.seriesList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteButton", "Delete", environment.cdnPath + "/Hub/delete"));
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.seriesList[k].neoConfigCode)) {
                this.seriesList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
            }
        }
    }




    outputFromListView(outPutFromChild) {
        if (outPutFromChild.selectedAction == "viewButton") {
            var serie = outPutFromChild.listDetails
            this.editSeries(serie);
        } else if (outPutFromChild.listDetails == "add") {
            this.openModal();
        } else if (outPutFromChild.listDetails == "cloud_download") {
            var res = this.cloneEventList
            this.generateUrl(res)

        } else if (outPutFromChild.listDetails == "cloud_upload") {
            this.openUploadModal();
        } else if (outPutFromChild.selectedAction == "deleteButton") {
            var serie = outPutFromChild.listDetails
            this.deleteSeries(serie);
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                this.searchKey = outPutFromChild.textToSearch;
            }
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.fetchSeries();
        } else if (outPutFromChild.selectedAction == "rowBasedCheckBoxSelection") {
            this.cloneEventList = outPutFromChild.listDetails;
        }
        else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchKey = outPutFromChild.listDetails;
            this.fetchSeries();
        } else if (outPutFromChild.selectedAction == "viewNeoConfig") {
            this.configCode = outPutFromChild.listDetails.neoConfigCode;
            this.openNeoConfigModal(this.configCode);

        }
    }


    /*************************************Cloning Configuration starts************************* */
    /*   getCurrentWidgetCodeAppCode() {
  
          return this.http.get<any>("neosuite/api/getMyAllWidgets")
  
              .subscribe(res => {
  
                  var widgetList = [];
                  widgetList = res.payload;
                  let currentWidgetInfo = widgetList.filter(widget => widget.widgetPath === 'HubPrefrencesComponent');
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

    openUploadModal() {
        var elem = document.getElementById("uploadModal");
        var instance = M.Modal.init(elem, {});
        instance.open();
    }

    closeUploadModal() {
        var elemodal = document.getElementById('uploadModal');
        var instance = M.Modal.init(elemodal, {});
        instance.close();
    }

    onUpload() {
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.uploadFile)) {
            try {
                this.seriesArray = JSON.parse(this.uploadFile)
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.seriesArray)) {
                    this.http.post<any>("series", this.seriesArray).subscribe(data => {

                        this.closeUploadModal();

                        /* for (var singleSeries in data.payload) {
                            if (this.utilityService.isNotNullOrEmptyOrUndefined(data.payload[singleSeries].errmsg)) {
                                this.toastService.error(data.payload[singleSeries].errmsg);
                            }
                            else {
                                this.toastService.success(data.payload[singleSeries].successmsg);
                            }
                        } */
                        this.fetchSeries();
                        this.closeUploadModal();
                        $(".file-upload").val("");
                        this.seriesArray = [];
                        this.uploadFile = null;
                    }, err => {
                        $(".file-upload").val("");
                        this.seriesArray = [];
                        this.uploadFile = null;
                        this.closeUploadModal();
                    });
                }
            }
            catch {
                this.toastService.error("No JSON File Found");
            }
        }
        else {
            this.toastService.error("Choose File")
        }
    }


    fileChanged(event: any) {
        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
            this.uploadFile = reader.result;
        }
    }

    generateUrl(res) {
        if (this.utilityService.isNullOrEmptyOrUndefined(res)) {
            this.toastService.error("Please Select Records")
        } else {
            for (let log of res) {
                log.id = null;
                log.status = "save";
                this.seriesArray.push(log);
            }
            var array = JSON.stringify(this.seriesArray)
            this.dyanmicDownloadByHtmlTag({
                fileName: 'SeriesReport.json',
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
        this.seriesArray = [];
    }


    /*************************************Cloning Configuration Ends************************* */
}
