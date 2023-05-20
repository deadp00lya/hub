import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from '@angular/common/http';
import { CompleterService, CompleterData } from 'ng2-completer';
import { WidgetService } from '@nw-workspace/common-services';
import { ListConfigDTO } from 'projects/hub/src/app/model/ListConfigDTO';
import { ToastService } from 'projects/hub/src/app/services/toast.service';
import { UtilityService } from 'projects/hub/src/app/services/utility.service';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var require: any;
declare var $: any;

@Component({
    selector: 'app-hub-list',
    templateUrl: './hub-list.component.html',
    styleUrls: ['./hub-list.component.css']
})

export class HubListComponent implements OnInit {
    picklistList: any = [];
    countryBusinessUnitList: any[];
    countryList: any;
    apiList: any;
    modalInstance: any;
    currentConfigListId: number;
    dataService: CompleterData;
    newConfigObject: any;
    cloneList: any = [];
    configCode: any;
    viewNeoConfig: boolean;
    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService, private completerService: CompleterService, private utilityService: UtilityService) { }

    listconfig: any = {};
    listConfiguration: ListConfigDTO = new ListConfigDTO();
    listConfigurationsCopy: ListConfigDTO = new ListConfigDTO();
    configPexMapping = new ListConfigDTO();
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    widgetWidth: number;
    currentPage: number = 1;
    // pageSizeOptions: any = [10, 20, 30];
    serachkeyListconfig: string = "";
    listNameConfiguration: ListConfigDTO[] = [];
    configListName = new ListConfigDTO();
    count: number;
    configListMapping: boolean = false;
    configId: number;
    cdnUrl=environment.cdnPath;

    itemsPerPageToDisplay: number = 50;
    ngOnInit() {
        this.fetchListNameConfiguration();
        this.fetchApi();
        //this.getCurrentWidgetCodeAppCode();
    }



    ngAfterViewInit() {
        $('.modal').modal();
        setTimeout(function () {
            M.AutoInit();
        }, 10);



        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("configListView"), element => {
            this.onResizedEvent(element);
        });
    }


    selectRefresh() {
        setTimeout(function () {
            $('select').formSelect();
            M.updateTextFields()
        }, 0);
    }


    listViewDetails(configPexMapping) {

        this.currentConfigListId = configPexMapping.id;
        this.configPexMapping.id = configPexMapping.id;
        this.configListMapping = true;
    }

    nameEventHandler($event: any) {
        this.configListMapping = $event;
        this.fetchListNameConfiguration();
    }


    closeModal() {
        var elemodal = document.getElementById('configList');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.close();
        this.listConfiguration = new ListConfigDTO();
    }


    //    ******************************************widget************************************************

    openDropdown() {

        let dropDownEle: Element = document.getElementById("dropdownBtn1")
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
        this.listConfigurationsCopy = new ListConfigDTO();

        var elems = document.getElementById('configList');
        var instance = M.Modal.init(elems, {});


        this.selectRefresh();
    }


    saveConfigurationList() {

        if (this.listConfigurationsCopy.listConfigName == null || this.listConfigurationsCopy.listConfigName.trim() == "" || this.listConfigurationsCopy.listConfigName == undefined) {
            this.toastService.error("Enter List Name");
        } else if (this.listConfigurationsCopy.api.id == null || this.listConfigurationsCopy.api.id == undefined) {
            this.toastService.error("Enter Api");
        } else {


            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.picklistList)) {
                for (var pick in this.picklistList) {

                    if (this.utilityService.isNullOrEmptyOrUndefined(this.picklistList[pick].fieldName)) {
                        this.toastService.error(" Enter picklist Field name  ");
                        return false;
                    }

                    if (this.utilityService.isNullOrEmptyOrUndefined(this.picklistList[pick].picklistCode)) {
                        let index = pick + 1
                        this.toastService.error("Enter picklist ");
                        return false;
                    }

                    if (this.utilityService.isNullOrEmptyOrUndefined(this.picklistList[pick].fieldTitle)) {

                        this.toastService.error("Enter picklist Field Title ");
                        return false;
                    }

                }
            }


            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.picklistList)) {
                this.listConfigurationsCopy.picklistinfo = JSON.stringify(this.picklistList)
            } else {
                this.toastService.error("Picklist field is null")
            }


            this.listConfigurationsCopy.status = "save";
            this.http.post<any>("list", this.listConfigurationsCopy).subscribe(data => {
                this.reset();
                this.selectRefresh();
                this.fetchListNameConfiguration();
                this.closeModal();
            })
        }
    }

    fetchListNameConfiguration() {
        this.http.get<any>("list?serachkeyListconfig=" + this.serachkeyListconfig + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(data => {
            this.listNameConfiguration = data.payload.ConfigurationList;
            this.count = data.payload.count;
            this.actionButtonsDisplay();
            this.selectRefresh();
        })
    }


    updateListConfiguration(listconfig) {

        this.listConfiguration = listconfig;
        this.listConfigurationsCopy = $.extend(true, {}, this.listConfiguration)

        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.listConfigurationsCopy.picklistinfo)) {
            this.picklistList = JSON.parse(this.listConfigurationsCopy.picklistinfo);
        }

        setTimeout(() => {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {});

            M.updateTextFields();
        }, 10);


        var elems = document.getElementById('configList');
        var instance = M.Modal.init(elems, { dismissible: false });
        this.selectRefresh();
        instance.open();

    }
    fetchApi() {

        this.http.get<any>("api").subscribe(data => {
            this.apiList = data.payload.apiList;
            this.dataService = this.completerService.local(this.apiList, 'apiName', 'apiName');
            setTimeout(() => {
                this.selectRefresh();
            }, 100);

        })
    }

    selectApi(event) {

        if (event.originalObject != null) {
            this.listConfigurationsCopy.api.id = event.originalObject.id;
        }


    }

    openModal() {

        this.reset();
        var elemodal = document.getElementById('configList');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.open();
    }

    removeListConfig(listConfig) {
        this.listConfiguration = listConfig;
        this.listConfiguration.status = "delete";

        this.http.put<any>("list", this.listConfiguration).subscribe(data => {

            this.fetchListNameConfiguration();
        })
    }

    addPicklist(i) {

        var obj = {
            fieldName: "",
            fieldTitle: "",
            picklistCode: "",
        }
        this.picklistList.push(obj)
        setTimeout(() => {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {});

            M.updateTextFields();
        }, 10);

    }

    removePicklist(i) {
        this.picklistList.splice(i)
        setTimeout(() => {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {});

            M.updateTextFields();
        }, 10);
    }


    /*fetchCountryList() {
        this.http.get<any>( "hub/countries" ).subscribe( data => {
            this.countryList = data.payload.list;
            this.selectRefresh();
        } )
    }

    onCountrySelect( countryCode ) {
        this.countryBusinessUnitList = [];
        this.listConfiguration.businessunitCode = null;

        this.http.get<any>( "hub/fetchBusinessunitByCountry?countryCode='" + countryCode + "'" ).subscribe( data => {
            this.countryBusinessUnitList = data.payload.list;
            this.selectRefresh();
        } );

        this.selectRefresh();
    }*/


    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.listNameConfiguration) {
            this.listNameConfiguration[k].actionButtonsList = [];
            this.listNameConfiguration[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
            this.listNameConfiguration[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteButton", "Delete", environment.cdnPath + "/Hub/delete"));
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.listNameConfiguration[k].neoConfigCode)) {
                this.listNameConfiguration[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
            }
        }
    }




    outputFromListView(outPutFromChild) {
        if (outPutFromChild.selectedAction == "viewButton") {
            var listconfig = outPutFromChild.listDetails;
            this.updateListConfiguration(listconfig);
        } else if (outPutFromChild.selectedAction == "deleteButton") {
            var listconfig = outPutFromChild.listDetails;
            this.removeListConfig(listconfig);
        }
        else if (outPutFromChild.listDetails == "add") {
            this.openModal()
        } else if (outPutFromChild.listDetails == "cloud_download") {
            var res = JSON.parse(JSON.stringify(this.cloneList));
            this.generateUrl(res)
        } else if (outPutFromChild.listDetails == "cloud_upload") {
            this.openListModal()
        } else if (outPutFromChild.selectedAction == "rowBasedCheckBoxSelection") {
            this.cloneList = outPutFromChild.listDetails;
        } else if (outPutFromChild.selectedAction == "viewNeoConfig") {
            this.configCode = outPutFromChild.listDetails.neoConfigCode;
            this.openNeoConfigModal(this.configCode);

        } else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.serachkeyListconfig)) {
                this.serachkeyListconfig = outPutFromChild.textToSearch;
            }
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.fetchListNameConfiguration()
        } else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
            this.fetchListNameConfiguration();
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.serachkeyListconfig = outPutFromChild.listDetails;
            this.fetchListNameConfiguration();
        }
    }

    /************************Cloning Configuration Starts************************* */
    generateUrl(res1) {

        if (this.utilityService.isNotNullOrEmptyOrUndefined(res1)) {
            for (var list of res1) {
                if (this.utilityService.isNotNullOrEmptyOrUndefined(list["id"])) {
                    list["id"] = ""
                    list["status"] = "save"
                }
            }
            var sJson = JSON.stringify(res1);
            var element = document.createElement('a');
            element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
            element.setAttribute('download', "List.json");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click(); // simulate click
            document.body.removeChild(element);
        } else {
            this.toastService.warning("No row selected");
        }
    }

    clearEmpFile() {

        $("#configFile").val("");

    }

    closeUploadModal() {
        var elems = document.getElementById('listModal');
        var instance = M.Modal.init(elems, {});
        this.selectRefresh();
        this.clearEmpFile()
        instance.close();
    }

    uploadFileDocument1(event) {

        let selectedFile: FileList = event.target.files;
        let file: File = selectedFile[0];
        if (file !== undefined) {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = () => {

                this.duplicatList = JSON.parse(fileReader.result as string);
                console.log(this.duplicatList)
                this.uploadJsonList()
                M.updateTextFields();
            }
            this.selectRefresh()

            fileReader.onerror = (error) => {
                this.toastService.error("Not Uploaded");
                return;
            }

        }

    } duplicatList(duplicatList: any) {
        throw new Error('Method not implemented.');
    }

    /*  getCurrentWidgetCodeAppCode() {
         return this.http.get<any>("neosuite/api/getMyAllWidgets")
             .subscribe(res => {
 
                 var widgetList = [];
                 widgetList = res.payload;
                 let currentWidgetInfo = widgetList.filter(widget => widget.widgetPath === 'HubPrefrencesComponent');
                 this.currentAppCode = currentWidgetInfo[0].application.appCode;
                 this.widgetCode = currentWidgetInfo[0].widgetCode;
 
             })
 
     } */


    openListModal() {
        var elems = document.getElementById('listModal');
        var instance = M.Modal.init(elems, { dismissible: false });
        this.selectRefresh();
        this.clearEmpFile()
        instance.open();
    }

    uploadJsonList() {

        //saveJsonPexList
        this.http.patch<any>("list", this.duplicatList).subscribe(data => {

            if (this.utilityService.isNotNullOrEmptyOrUndefined(data.payload)) {
                for (var listArray of data.payload) {

                    this.toastService.warning(listArray["listConfigName"] + "is duplicate or" + listArray.api["apiName"] + " api is not present");
                }
            }
            this.fetchListNameConfiguration();
            this.closeUploadModal();

        }, err => {
            this.closeUploadModal();
        })
    }

    openNeoConfigModal(configCode) {
        this.viewNeoConfig = true
    }
    
    triggered($event){
        this.viewNeoConfig = $event;
    }
    
    /************************Cloning Configuration Ends************************* */
}
