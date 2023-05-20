import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from "@angular/common/http";
import { ToastService } from '@nw-workspace/common-services';
import { ComponentApiDTO } from '../../../model/ComponentApiDTO';
import { ComponentDTO } from '../../../model/ComponentDTO';
import { UtilityService } from '../../../services/utility.service';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;

@Component({
    selector: 'app-api-map',
    templateUrl: './api-map.component.html',
    styleUrls: ['./api-map.component.css']
})

export class ApiMapComponent implements OnInit {
    fetchApi: any = null;
    updateApi: any = null;
    detailApi: any = null; buttonTitle: string = "Save";
    currentPage: number = 1;
    searchKey: string = "";
    componentList: ComponentDTO[] = [];
    apiList: any[] = [];
    apiMappingList: ComponentApiDTO[] = [];
    componentApiDTO: ComponentApiDTO = new ComponentApiDTO();
    instanceOfApiMappingModal: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    itemsPerPageToDisplay = 50;
    totalCount: number = 0;
    loader: boolean = false;
    cdnUrl=environment.cdnPath;
    configCode: any;
    viewNeoConfig: boolean;
    constructor(private http: HttpClient, private toast: ToastService, private util: UtilityService) { }
    @ViewChild('addApiMapModal', { static: false }) addApiMapModal: ElementRef;

    ngOnInit(): void {
        this.fetchComponentApiMapping();
    }
    ngAfterViewInit() {

        if (this.util.isNotNullOrEmptyOrUndefined(this.addApiMapModal))
            this.instanceOfApiMappingModal = new M.Modal(this.addApiMapModal.nativeElement, { dismissible: false })
        this.refreshAll();
    }

    fetchComponentApiMapping() {
        this.apiMappingList = [];
        
        this.http.get<any>("component-api?searchKey=" + this.searchKey + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(res => {
            this.apiMappingList = res.payload.content;
            this.totalCount = res.payload.totalElements;
            this.actionButtonsDisplay();

        })
    }
    saveApiMapping() {
        
        if (this.util.isNullOrEmptyOrUndefined(this.componentApiDTO.componentName) || this.util.isNullOrEmptyOrUndefined(this.componentApiDTO.componentName.trim()))
            return this.toast.error("Please enter component name");
        if (this.util.isNullOrEmptyOrUndefined(this.componentApiDTO.fetchApi))
            return this.toast.error("Please select fetch api");
        if (this.util.isNullOrEmptyOrUndefined(this.componentApiDTO.updateApi))
            return this.toast.error("Please select update api");
        if (this.util.isNullOrEmptyOrUndefined(this.componentApiDTO.fetchDetailApi))
            return this.toast.error("Please select fetch detail api");

        this.componentApiDTO.enabled = true;    
        this.http.post<any>("component-api", this.componentApiDTO).subscribe(res => {
            //           this.apiMappingList.push(res.payload);
            //           this.actionButtonsDisplay();
            this.closeApiMapModal();
            this.fetchComponentApiMapping();
            this.selectRefresh();
            this.resetApiModal();
           /*  if (this.buttonTitle == "Save")
                this.toast.success("Component Api Mapped Succefully");
            else
                this.toast.success("Component Api Updated Succefully");
 */
        }, error => {
        })
    }
    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        
        for (var k in this.apiMappingList) {
            this.apiMappingList[k].actionButtonsList = [];
            this.apiMappingList[k].actionButtonsList.push(this.actionButtonsObjectCreation("editButton", "Update",environment.cdnPath+"/Hub/edit"));
            if (this.apiMappingList[k].enabled)
                this.apiMappingList[k].actionButtonsList.push(this.actionButtonsObjectCreation("activateButton", "Active",environment.cdnPath+"/Hub/flash_off"));
            else
                this.apiMappingList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deactivateButton", "Delete",environment.cdnPath+"/Hub/flash_on"));

            if (this.util.isNotNullOrEmptyOrUndefined(this.apiMappingList[k].neoConfigCode)) {
                this.apiMappingList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
            }

        }
    }
    outPutFromOrgConfig(outPutFromChild) {
        
        if (outPutFromChild.selectedAction == "applicationButton") {
            this.buttonTitle = "Save"
            this.openApiMappingModal(new ComponentApiDTO());
        }
        else if (outPutFromChild.selectedAction == "globalSearch") {

            this.searchKey = outPutFromChild.listDetails
            this.fetchComponentApiMapping();
        } else if (outPutFromChild.selectedAction == "editButton") {
            this.buttonTitle = "Update"
            this.openApiMappingModal(outPutFromChild.listDetails);
        }
        else if (outPutFromChild.selectedAction == "activateButton") {
            outPutFromChild.listDetails.enabled = false;
            this.activateRecord(outPutFromChild.listDetails);
        }
        else if (outPutFromChild.selectedAction == "deactivateButton") {
            outPutFromChild.listDetails.enabled = true;
            this.activateRecord(outPutFromChild.listDetails);
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            this.apiMappingList = [];
            this.totalCount = 0;
            this.fetchComponentApiMapping();

        } else if (outPutFromChild.selectedAction == "viewNeoConfig") {
            this.configCode = outPutFromChild.listDetails.neoConfigCode;
            this.openNeoConfigModal();
        }

    }

    openApiMappingModal(listDetails) {
        
        if (this.buttonTitle == "Update")
            this.componentApiDTO = Object.assign(this.componentApiDTO, listDetails);
        this.fetchApiList();
        this.instanceOfApiMappingModal.open();
    }
    fetchApiList() {
        this.http.get<any>("api").subscribe(res => {
            this.apiList = res.payload.apiList;
            
            if (this.util.isNotNullOrEmptyOrUndefined2(this.componentApiDTO.fetchApi) && this.util.isNotNullOrEmptyOrUndefined2(this.componentApiDTO.fetchDetailApi) && this.util.isNotNullOrEmptyOrUndefined2(this.componentApiDTO.updateApi)) {
                var apiDTO = this.apiList.filter(
                    api => api.apiCode === this.componentApiDTO.fetchApi);
                this.fetchApi = apiDTO[0];
                var apiDTO = this.apiList.filter(
                    api => api.apiCode === this.componentApiDTO.fetchDetailApi);
                this.detailApi = apiDTO[0];
                var apiDTO = this.apiList.filter(
                    api => api.apiCode === this.componentApiDTO.updateApi);
                this.updateApi = apiDTO[0];
            }
            this.selectRefresh();
        })
    }

    /*Activate Deactivate api*/
    activateRecord(listDetails) {
       
        this.http.put<any>("component-api", listDetails).subscribe(res => {
            this.fetchComponentApiMapping();
        })
    }
    setApi(api) {
        if (api == 'fetchApi')
            this.componentApiDTO.fetchApi = this.fetchApi.apiCode;
        else if (api == 'updateApi')
            this.componentApiDTO.updateApi = this.updateApi.apiCode;
        else if (api == 'detailApi')
            this.componentApiDTO.fetchDetailApi = this.detailApi.apiCode;
    }
    resetUpdateApi() {
        this.componentApiDTO.updateApi = null;
        this.updateApi = null;

    } resetDetailApi() {
        this.componentApiDTO.fetchDetailApi = null;
        this.detailApi = null;
    }
    resetFetchApi() {
        this.componentApiDTO.fetchApi = null;
        this.fetchApi = null;
    }
    closeApiMapModal() {
        this.instanceOfApiMappingModal.close();
        this.resetDetailApi();
        this.resetFetchApi();
        this.resetUpdateApi()
        this.selectRefresh();
        this.resetApiModal();
    }
    resetApiModal() {
        this.componentApiDTO.componentName = null;
        this.componentApiDTO.id = null;
        this.componentApiDTO.fetchApi = null;
        this.componentApiDTO.fetchDetailApi = null;
        this.componentApiDTO.updateApi = null;
        this.selectRefresh();
    }
    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect();
        }, 50);
    }
    refreshAll() {
        $('select').formSelect();
        $('.modal').modal();
    }

    openNeoConfigModal() {
        this.viewNeoConfig = true;
    }
    
    triggered($event){
        this.viewNeoConfig = $event;
    }

}

