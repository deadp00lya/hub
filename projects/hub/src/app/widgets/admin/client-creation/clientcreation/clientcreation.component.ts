import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as M from "materialize-css/dist/js/materialize";
import { ToastService, UtilityService, WidgetService } from '@nw-workspace/common-services';
import { ClientDTO } from 'projects/hub/src/app/model/ClientDTO';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-clientcreation',
    templateUrl: './clientcreation.component.html',
    styleUrls: ['./clientcreation.component.css']
})

export class ClientcreationComponent implements OnInit {
    submitButtonDisabled: boolean = true;
    widgetWidth: number;

    clientListWithSearchKey: any;
    value: boolean;
    clientListMDM: any;
    clientList: any;
    modalInstance: any;
    itemsPerPage: number = 10;
    itemsPerPageToDisplay: number = 50;
    currentPage: number = 1;
    pageSizeOption: any = [10, 20, 30];
    count: any;
    searchKey: string = "";
    loader: boolean;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };

    clientDTO: ClientDTO = new ClientDTO();

    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService, private utilityService: UtilityService) { }

    ngOnInit() {
        this.fetchClientsWithSearchKey();
    }

    ngAfterViewInit() {
        setTimeout(function () {
            $('.modal').modal();
            let dropDownEle: Element = document.getElementById("viewClientPageSizeDropdown")
            var instance = M.Dropdown.init(dropDownEle, { coverTrigger: false, closeOnClick: true });
            $('select').formSelect();

            M.AutoInit();
        }, 10);


        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("ClientViewPage"), element => {
            this.onResizedEvent(element);
        });

        var elemodal = document.getElementById('createClient');
        this.modalInstance = M.Modal.init(elemodal, {});
    }

    openDropdown() {

        let dropDownEle: Element = document.getElementById("viewClientPageSizeDropdown")
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
            this.fetchClientsWithSearchKey();
        }
        else {
            this.clientListWithSearchKey = this.clientListWithSearchKey.slice(0, size);
        }
        setTimeout(() => {
            M.AutoInit();
        }, 0);
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

    selectRefresh() {
        setTimeout(function () {
            $('select').formSelect();
        }, 10);
    }

    openCreateClientModal() {
        this.fetchClients();
        var elemodal = document.getElementById('createClient');
        var modalInstance = M.Modal.init(elemodal, { dismissible: false });
        modalInstance.open();

    }

    closeCreateClientModal() {
        var elemodal = document.getElementById('createClient');
        var modalInstance = M.Modal.init(elemodal, { dismissible: false });
        modalInstance.close();
    }

    createClient(clientDTO) {
        if (this.clientDTO.clientCode != null && this.clientDTO.clientCode != "") {
            this.closeCreateClientModal();
            this.loader = true;
            this.http.post<any>("clients", this.clientDTO).subscribe(data => {
                this.fetchClients();
                this.fetchClientsWithSearchKey();
                this.loader = false;
            });
        } else {
            this.toastService.error("Enter Client");
        }
    }

    fetchClients() {
        this.clientList = [];
        this.http.get<any>("clients?list=" + true).subscribe(data => {
            this.clientList = data.payload;
            this.selectRefresh();
            this.clientDTO = new ClientDTO();
        });

    }

    //Method not used
    fetchClientsMDM() {
        this.http.get<any>("fetchClientsMDM").subscribe(data => {
            this.clientListMDM = data.payload.list;
            this.selectRefresh();

            for (var i = 0; i < this.clientList.length; i++) {
                for (var j = 0; j < this.clientListMDM.length; j++) {
                    if (this.clientListMDM[j].clientCode == this.clientList[i].clientCode) {
                        this.clientListMDM.splice(j, 1);
                        break;
                    }
                }
            }
        });
    }

    fetchClientsWithSearchKey() {
        this.http.get<any>("clients?searchKey=" + this.searchKey + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(data => {
            this.clientListWithSearchKey = data.payload.content;
            this.count = data.payload.totalElements;
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
        for (var k in this.clientListWithSearchKey) {
            this.clientListWithSearchKey[k].actionButtonsList = [];
        }
    }

    outputFromListView(outPutFromChild) {
        if (outPutFromChild.selectedAction == "applicationButton") {
            this.openCreateClientModal();
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                this.searchKey = outPutFromChild.textToSearch;
            }
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.fetchClientsWithSearchKey();
        } else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
            this.fetchClientsWithSearchKey();
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.searchKey = outPutFromChild.listDetails;
            this.fetchClientsWithSearchKey();
        }
    }
}
