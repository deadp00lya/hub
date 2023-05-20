import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as M from "materialize-css/dist/js/materialize";
import { ComponentApiDTO } from '../../../model/ComponentApiDTO';
import { ToastService } from '../../../services/toast.service';
import { UtilityService } from '../../../services/utility.service';
import { environment } from 'projects/hub/src/environments/environment.prod';
import { SessionService } from '@nw-workspace/common-services';
declare var $: any;

@Component({
    selector: 'app-employee-effective-list',
    templateUrl: './employee-effective-list.component.html',
    styleUrls: ['./employee-effective-list.component.css']
})

export class EmployeeEffectiveListComponent implements OnInit {
    mapObject: any = {};
    actionName: string = "";
    instanceOfActiveDeactiveModal: any;
    employee: any;
    instanceOfEmployeeDetailModal: any;
    details: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    employeeEffectiveList: any = [];
    itemsPerPageToDisplay = 50;
    totalCount: number = 0;
    searchKey: any;
    loader: boolean = false;
    component: any;
    componentApiList: ComponentApiDTO[] = [];
    cdnUrl=environment.cdnPath;
    currentRole: string;
    listViewCode: string;
    constructor(private toast: ToastService, private http: HttpClient, private util: UtilityService, private sessionService: SessionService) { }
    @ViewChild('employeeDetailModal', { static: false }) employeeDetailModal: ElementRef;
    @ViewChild('activeDeactiveModal', { static: false }) activeDeactiveModal: ElementRef;

    ngAfterViewInit() {
        debugger
        var currentUserName = this.sessionService.getCurrentUser().preferred_username;

        if (this.util.isNotNullOrEmptyOrUndefined(this.employeeDetailModal))
            this.instanceOfEmployeeDetailModal = new M.Modal(this.employeeDetailModal.nativeElement, { dismissible: false })
        if (this.util.isNotNullOrEmptyOrUndefined(this.activeDeactiveModal))
            this.instanceOfActiveDeactiveModal = new M.Modal(this.activeDeactiveModal.nativeElement, { dismissible: false })

    }

    ngOnInit(): void {
        var roleCodes = this.sessionService.getCurrentUser().additionalDetails.neosuite.appRoles;

        roleCodes.forEach(role => {
         if(role.appCode == "ehub"){
            this.currentRole = role.roles[0].roleCode;
         }
       });
        
        this.checkRole(this.currentRole);
        this.fetchComponentApi();

        setTimeout(() => {
            $('select').formSelect();
        }, 10);

    }

    checkRole(currentRole)
    {
        if(currentRole == "hub_configurator"){
            this.listViewCode = "EmployeeEffectiveListView"
        } else{
            this.listViewCode = "EmployeeEffectiveListViewUserAccess"
        }

    }
    fetchComponentApi() {
debugger
        this.http.get<any>("component-api").subscribe(res => {
            this.componentApiList = res.payload.content;
            this.selectRefresh();
        });

    }
    fetchEffectiveEmployee() {
        this.loader = true; this.http.get<any>("employee-effective?searchKey=" + this.searchKey + "&fetchApi=" + this.component.fetchApi).subscribe(res => {
            this.employeeEffectiveList = [];
            if (this.util.isNotNullOrEmptyOrUndefined(res)) {
                this.employeeEffectiveList = res.payload.list;
                this.actionButtonsDisplay();
                this.totalCount = this.employeeEffectiveList.length;
            }
            this.loader = false;
        }, error => {
            this.loader = false;
        })
    }
    actionButtonsDisplay() {

        for (var k in this.employeeEffectiveList) {
            this.employeeEffectiveList[k].actionButtonsList = [];
            if (this.employeeEffectiveList[k].enabled && this.currentRole == "hub_configurator") {
                    this.employeeEffectiveList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deactivateButton", "De-activate",environment.cdnPath+"/Hub/flash_off"));
            
            } else if(this.currentRole == "hub_configurator")
                    this.employeeEffectiveList[k].actionButtonsList.push(this.actionButtonsObjectCreation("activateButton", "Activate",environment.cdnPath+"/Hub/flash_on"));
            this.employeeEffectiveList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View Details",environment.cdnPath+"/Hub/view"));

        }
    }
    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }
    outPutFromOrgConfig(outPutFromChild) {
        
        if (outPutFromChild.selectedAction == "globalSearch") {
            if (this.util.isNullOrEmptyOrUndefined(this.component))
                return this.toast.warning("Please select component");
            this.searchKey = outPutFromChild.listDetails
            if (this.util.isNotNullOrEmptyOrUndefined2(this.searchKey))
                this.fetchEffectiveEmployee();
            else
                this.employeeEffectiveList = [];
        } else if (outPutFromChild.selectedAction == "activateButton") {
            this.confirmAction(outPutFromChild.listDetails, "activate");

        }
        else if (outPutFromChild.selectedAction == "deactivateButton") {
            this.confirmAction(outPutFromChild.listDetails, "de-activate");

        } else if (outPutFromChild.selectedAction == "viewButton") {
            this.detailsView(outPutFromChild.listDetails);
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            this.employeeEffectiveList = [];
            this.totalCount = 0;

        } else if (outPutFromChild.selectedAction == "Bulk De-active") {
            this.bulkActiveDeactive(outPutFromChild.listDetails, "de-activate", false);
        } else if (outPutFromChild.selectedAction == "Bulk Activate") {
            this.bulkActiveDeactive(outPutFromChild.listDetails, "activate", true);
        }
    }
    confirmAction(listDetails, actionName) {
        this.employee = listDetails;
        this.actionName = actionName;
        this.mapObject = {
            "employeeList": [{
                "id": this.employee.id,
                "enabled": !this.employee.enabled
            }],
            "componentId": this.component.id,
            "updateApi": this.component.updateApi
        }
        this.instanceOfActiveDeactiveModal.open();

    }
    bulkActiveDeactive(listDetails, actionName, enabled) {
        
        this.mapObject = {
            "componentId": this.component.id,
            "updateApi": this.component.updateApi,
            "employeeList": []
        }
        this.employee = listDetails[0];
        this.employee["effectiveStartDate"] = null;

        this.employee["effectiveEndDate"] = null;
        for (var employee of listDetails) {

            if (!employee.enabled == enabled) {
                var map = {
                    "id": employee.id,
                    "enabled": enabled

                }
                this.mapObject.employeeList.push(map);
            }
        }
        if (this.util.isNullOrEmptyOrUndefined(this.mapObject.employeeList))
            return false;
        this.actionName = actionName;

        this.instanceOfActiveDeactiveModal.open();

    }

    yesNo(action) {
        if (action) {
            this.http.put<any>("employee-effective", this.mapObject).subscribe(res => {
                this.fetchEffectiveEmployee();
                this.instanceOfActiveDeactiveModal.close();
            })
        }
        this.instanceOfActiveDeactiveModal.close();
        this.resetYeNoModal();
        setTimeout(() => {
            this.employee = {};
            this.actionName = "";
        }, 50);
    }
    resetYeNoModal() {
        this.mapObject = {};
        this.employee = null;
        this.actionName = null;
    }
    detailsView(listDetails) {
        this.fetchdetails(listDetails);
        this.instanceOfEmployeeDetailModal.open();
    }
    fetchdetails(listDetails) {
        this.http.get<any>("employee-effective?id=" + listDetails.id + "&fetchApi=" + this.component.fetchDetailApi).subscribe(res => {
            if (this.util.isNotNullOrEmptyOrUndefined2(res)) {
                this.details = res.payload.list[0];

                var textedJson = JSON.stringify(this.details, undefined, 4);
                $('#myTextarea').text(textedJson);
            }
        });
    }
    closeeEployeeDetailModal() {
        this.instanceOfEmployeeDetailModal.close();
        this.details = null;
    }
    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect();
        }, 0);
    }

}
