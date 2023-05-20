import { Component, OnInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from '@angular/common/http';
import { WidgetService, ToastService } from '@nw-workspace/common-services';
import { EventsDTO } from 'projects/hub/src/app/model/EventsDTO';
import { UtilityService } from 'projects/hub/src/app/services/utility.service';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var require: any;
declare var $: any;

@Component({
    selector: 'app-hub-event',
    templateUrl: './hub-event.component.html',
    styleUrls: ['./hub-event.component.css']
})

export class PexEventComponent implements OnInit {
    modalInstance: any;

    events: EventsDTO = new EventsDTO();
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    widgetWidth: number;
    searchEvent: string = "";
    currentPage: number = 1;
    itemPerPage: number = 5;
    itemsPerPageToDisplay: number = 50;
    count: number;
    eventsList: EventsDTO[] = [];
    filename: string;
    downloadUrl: any;
    cloneEventList: any = [];
    duplicatEvents: EventsDTO = new EventsDTO()
    configCode: any;
    newConfigObject: any;
    viewNeoConfig: boolean;
    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService, private utilityService: UtilityService) { }






    ngOnInit() {

        this.fetchEventList();
        //this.getCurrentWidgetCodeAppCode();

    }


    ngAfterViewInit() {

        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, {});
        setTimeout(function () {
            M.AutoInit();
        }, 10);

        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("eventsView"), element => {
            this.onResizedEvent(element);
        });


    }


    setPageSize(size) {

        this.currentPage = 1;
        var fetchData = false;
        if (this.itemPerPage < size)
            fetchData = true;
        this.itemPerPage = size;
        if (fetchData) {
            this.fetchEventList();
        }
        else {
            this.eventsList = this.eventsList.slice(0, size);
        }
        setTimeout(() => {
            M.AutoInit();
        }, 0);
    }


    closeModal() {
        var elemodal = document.getElementById('EventList');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.close();
        this.events = new EventsDTO();
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
        this.events = new EventsDTO();

        var elems = document.getElementById('EventList');
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


    saveEventList() {

        if (this.events.eventName == null || this.events.eventName.trim() == "" || this.events.eventName == undefined) {
            return this.toastService.error("Enter Event Name");
            return false;
        }

        if (this.events.eventCode == null || this.events.eventCode.trim() == "" || this.events.eventCode == undefined) {
            return this.toastService.error("Enter Event code");
            return false;
        }
        if (this.events.dataInjection == null || this.events.dataInjection.trim() == "" || this.events.dataInjection == undefined) {
            return this.toastService.error("Enter Static Data Input");
            return false;

        }
        if (this.utilityService.isNotNullOrEmptyOrUndefined2(this.events.dataInjection)) {
            if (!this.isJSON(this.events.dataInjection)) {
                return this.toastService.error("Enter Static Data in correct JSON Format");
                return false
            }
        }
        this.events.status = "save";
        this.http.post<any>("event", this.events).subscribe(data => {

            this.reset()
            this.fetchEventList();
            this.selectRefresh();
            this.closeModal();
        })

    }

    fetchEventList() {
        this.http.get<any>("event?searchEvent=" + this.searchEvent + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(data => {
            this.eventsList = data.payload.eventList;
            this.count = data.payload.count;
            this.actionButtonsDisplay();
            setTimeout(function () {
            }, 10);
        })
    }

    removeEvent(event) {
        this.events = event;
        this.events.status = "delete";

        this.http.put<any>("event", this.events).subscribe(data => {

            this.fetchEventList();
        })
    }

    selectRefresh() {
        setTimeout(function () {
            $('select').formSelect();
            M.updateTextFields();
        }, 0);

    }

    openUpdateEvent(events) {

        var elems = document.getElementById('EventList');
        var instance = M.Modal.init(elems, { dismissible: false });
        this.events = Object.assign(events, {});
        this.selectRefresh();
        instance.open();

    }

    openCreateEventModel() {
        var elems = document.getElementById('EventList');
        var instance = M.Modal.init(elems, {});
        instance.open();
    }


    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.eventsList) {
            this.eventsList[k].actionButtonsList = [];
            this.eventsList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
            this.eventsList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteButton", "Delete", environment.cdnPath + "/Hub/delete"));
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.eventsList[k].neoConfigCode)) {
                this.eventsList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
            }
        }
    }




    outputFromListView(outPutFromChild) {

        if (outPutFromChild.selectedAction == "viewButton") {
            let events = outPutFromChild.listDetails;
            this.openUpdateEvent(events)
        } else if (outPutFromChild.selectedAction == "deleteButton") {
            let event = outPutFromChild.listDetails;
            //let eventCode = outPutFromChild.listDetails;
            this.removeEvent(event);
            this.fetchEventList();
        } else if (outPutFromChild.listDetails == "add") {
            this.openCreateEventModel()
        } else if (outPutFromChild.listDetails == "cloud_download") {
            var res = JSON.parse(JSON.stringify(this.cloneEventList));
            this.generateUrl(res)
        } else if (outPutFromChild.listDetails == "cloud_upload") {
            this.openModal()
        } else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
            this.fetchEventList();
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchEvent = outPutFromChild.listDetails;
            this.fetchEventList();
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchEvent)) {
                this.searchEvent = outPutFromChild.textToSearch;
            }
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.fetchEventList();
        } else if (outPutFromChild.selectedAction == "Download") {
            var res = this.cloneEventList;
            let events = JSON.parse(JSON.stringify(res));
            this.generateUrl(events);
        } else if (outPutFromChild.selectedAction == "rowBasedCheckBoxSelection") {
            this.cloneEventList = outPutFromChild.listDetails;
        } else if (outPutFromChild.selectedAction == "viewNeoConfig") {

            this.configCode = outPutFromChild.listDetails.neoConfigCode;

            this.openNeoConfigModal(this.configCode);

        }

    }


    /*****************Cloning Configuration***************** */
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
    openModal() {
        var elems = document.getElementById('eventModal');
        var instance = M.Modal.init(elems, { dismissible: false });
        this.selectRefresh();
        this.clearEmpFile()
        instance.open();
    }

    uploadJsonEvent() {
        this.http.patch<any>("event", this.duplicatEvents).subscribe(data => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(data.payload)) {
                /*  for (var evenyArray of data.payload) {
                     this.toastService.warning(evenyArray["eventName"] + "is present");
                 } */
            }
            this.fetchEventList();
            this.closeUploadModal();
        }, err => {
            this.closeUploadModal();
        })
    }

    generateUrl(res1) {

        if (this.utilityService.isNotNullOrEmptyOrUndefined(res1)) {
            for (var event of res1) {
                if (this.utilityService.isNotNullOrEmptyOrUndefined(event["eventCode"])) {
                    event["id"] = null;
                    event["status"] = "save";
                }

            }
            var sJson = JSON.stringify(res1);
            var element = document.createElement('a');
            element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
            element.setAttribute('download', "Event.json");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click(); // simulate click
            document.body.removeChild(element);

        }
        else {
            this.toastService.error("Please Select Records");
        }
    }


    clearEmpFile() {
        $("#configFile").val("");
    }


    closeUploadModal() {
        var elems = document.getElementById('eventModal');
        var instance = M.Modal.init(elems, {});
        this.selectRefresh();
        this.clearEmpFile()
        instance.close();
    }


    uploadFileDocument1(event) {

        let selectedFile: FileList = event.target.files;
        let file: File = selectedFile[0];
        if (file != undefined) {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = () => {

                this.duplicatEvents = JSON.parse(fileReader.result as string);
                console.log(this.duplicatEvents)
                this.uploadJsonEvent()
                M.updateTextFields();
            }
            this.selectRefresh()


            fileReader.onerror = (error) => {
                this.toastService.error("Not Uploaded");
                return;
            }

        }

    };


    openNeoConfigModal(configCode) {
        this.viewNeoConfig = true;

    }
    
    triggered($event){
        this.viewNeoConfig = $event;
    }



    /*****************Cloning Configuration Ends***************** */

}
