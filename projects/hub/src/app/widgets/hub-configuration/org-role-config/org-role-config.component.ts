import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from "@angular/forms";
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '../../../services/utility.service';
import { ToastService, WidgetService } from '@nw-workspace/common-services';
import { ApplicationDTO } from 'projects/neosuite/src/app/models/ApplicationDTO';
import { RoleDTO } from 'projects/neosuite/src/app/models/RoleDTO';
import { OrgRoleConfigDTO } from '../../../model/OrgRoleConfigDTO';
import { environment } from 'projects/hub/src/environments/environment.prod';

declare var $: any;
declare var require: any;

@Component({
    selector: 'app-org-role-config',
    templateUrl: './org-role-config.component.html',
    styleUrls: ['./org-role-config.component.css']
})

export class OrgRoleConfigComponent implements OnInit {
    orgConfigList: any[] = [];
    disabled: boolean = false;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    businessUnitList: any[] = [];
    allRoleList: any = [];
    listOfRolesByApplication2: any;
    allApplicationsCode: any = [];
    totalCount: number = 0;
    currentPage: number = 1;
    searchKey: string = "";
    applicationDTO: any;

    orgRoleConfigDTO: OrgRoleConfigDTO = new OrgRoleConfigDTO();
    orgRoleConfigList: OrgRoleConfigDTO[] = [];
    listOfRolesByApplication: RoleDTO[] = []
    countryList: any[] = [];
    countryBusinessUnitList: any[] = [];
    listOfApplications: ApplicationDTO[] = [];
    cdnUrl=environment.cdnPath;
    itemsPerPageToDisplay: number = 50;
    instanceOfOrcModalInstance: any;
    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService, private utilityService: UtilityService) { }
    ngOnInit() {
        this.fetchApplications();
    }
    @ViewChild('orcModalInstance', { static: false }) orcModalInstance: ElementRef;
    ngAfterViewInit() {
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.orcModalInstance)) {
            this.instanceOfOrcModalInstance = new M.Modal(this.orcModalInstance.nativeElement, { dismissible: false, opacity: 0.1 })
        }
    }
    fetchRolesByApplicationFromNeosuite2(appCode) {

        return new Promise((resolve, reject) => {
            
            this.http.get<any>("neosuite/roles/application/" + appCode).subscribe(data => {
                this.listOfRolesByApplication2 = data.payload;
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.listOfRolesByApplication2)) {
                    this.allRoleList = this.allRoleList.concat(this.listOfRolesByApplication2);
                }
                return resolve(1);
            }, err => {
                return null;
            })
        });

    }
    fetchOrgRoleConfigList() {
        
        this.orgRoleConfigList = [];
        this.http.get<any>("org-role?searchKey=" + this.searchKey + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(res => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(res) && this.utilityService.isNotNullOrEmptyOrUndefined(res.list)) {
                this.orgRoleConfigList = res.list;
                this.totalCount = res.count;
                for (var singleConfig of this.orgRoleConfigList) {
                    if (!this.allApplicationsCode.includes(singleConfig.appCode)) {
                        this.allApplicationsCode.push(singleConfig.appCode);
                    }
                }

                for (var singleAppCode of this.allApplicationsCode) {
                    for (var app of this.listOfApplications) {
                        var roleList = null;
                        if (app.appCode == singleAppCode) {
                            this.fetchRolesByApplicationFromNeosuite2(app.appCode).then(() => {
                                for (var app of this.allRoleList) {
                                    for (let i in this.orgRoleConfigList) {
                                        if (this.orgRoleConfigList[i].roleCode == app.roleCode) {
                                            this.orgRoleConfigList[i].roleName = app.roleName
                                        }

                                    }
                                }
                            });
                        }
                    }
                }


                for (let bu of this.businessUnitList) {
                    for (let role of this.orgRoleConfigList) {
                        if (role.businessUnitCode == bu.businessunitCode) {
                            role.businessUnitName = bu.businessunitName
                        }
                    }
                }

                for (let country of this.countryList) {
                    for (let role of this.orgRoleConfigList) {
                        if (role.countryCode == country.countryCode) {
                            role.countryName = country.countryName
                        }
                    }
                }



                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.listOfApplications)) {
                    for (let i in this.orgRoleConfigList) {
                        for (var app of this.listOfApplications) {
                            if (this.orgRoleConfigList[i].appCode == app.appCode) {
                                this.orgRoleConfigList[i].appName = app.appName
                            }

                        }
                    }
                }
                this.actionButtonsDisplay();
                this.selectRefresh();

            }
        })
    }
    sortArray() {
        var list: any[] = [];
        for (var modal of this.orgRoleConfigList) {
            if (modal.appCode == this.orgRoleConfigDTO.appCode)
                list.push(modal);
        }
        return list;
    }
    saveOrgRoleConfig() {
        
        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.applicationDTO) && this.utilityService.isNotNullOrEmptyOrUndefined(this.applicationDTO.appCode))
            this.orgRoleConfigDTO.appCode = this.applicationDTO.appCode;
        if (this.utilityService.isNullOrEmptyOrUndefined(this.orgRoleConfigDTO))
            return this.toastService.error("please enter mandatory fields");
        if (this.utilityService.isNullOrEmptyOrUndefined(this.orgRoleConfigDTO.appCode))
            return this.toastService.error("Application can not be null");
        if (this.utilityService.isNullOrEmptyOrUndefined(this.orgRoleConfigDTO.roleCode))
            return this.toastService.error("Role can not be null");
        if (this.utilityService.isNullOrEmptyOrUndefined(this.orgRoleConfigDTO.orgCode))
            return this.toastService.error("Org Code can not be null");

        if (this.orgRoleConfigDTO.sequence == null) {

            var list = this.sortArray();
            var max = 0;
            if (this.utilityService.isNotNullOrEmptyOrUndefined(list)) {
                max = list.reduce((a, b) => a = a > b.sequence ? a : b.sequence, 0) + 1;
            }
            this.orgRoleConfigDTO.sequence = max;
        }
        if (this.orgRoleConfigDTO.sequence < 0)
            return this.toastService.error("Please enter valid sequence number");


        this.http.post<any>("org-role", this.orgRoleConfigDTO).subscribe(data => {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(data) && this.utilityService.isNotNullOrEmptyOrUndefined(data.payload)) {
                this.instanceOfOrcModalInstance.close();
                this.fetchOrgRoleConfigList();
                this.refreshOrgRoleConfig();
                this.toastService.success("Org Role Configuration Saved");

            }
        })


    }
    outputFromListView(outPutFromChild) {
        
        if (outPutFromChild.selectedAction == "deleteButton") {
            this.deleteOrgRoleConfig(outPutFromChild.listDetails.id, outPutFromChild.index);
        } else
            if (outPutFromChild.selectedAction == "applicationButton") {
                this.openModal(null);
            } else if (outPutFromChild.selectedAction == "paginationClick") {
                this.currentPage = outPutFromChild.listDetails.page;
                this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
                this.fetchOrgRoleConfigList();
            } else if (outPutFromChild.selectedAction == "globalSearch") {
                this.searchKey = outPutFromChild.listDetails
                this.fetchOrgRoleConfigList();
            }
    }
    deleteOrgRoleConfig(id: number, i) {
        this.http.delete<any>("org-role?id=" + id).subscribe(data => {

            this.fetchOrgRoleConfigList();
            this.toastService.success("organization mapping deleted");
            this.selectRefresh();


        });
    }
    openModal(data) {
        debugger
        if (this.utilityService.isNotNullOrEmptyOrUndefined(data)) {
            this.disabled = true
            this.orgRoleConfigDTO = data;

        }
        this.fetchOrgConfigList();
        this.instanceOfOrcModalInstance.open();
        this.selectRefresh();
    }
    closeModal() {
        this.instanceOfOrcModalInstance.close();
        this.disabled = false;
    }
    fetchApplications() {
        this.listOfApplications = [];
        this.http.get<any>("neosuite/applications").subscribe(data => {
            this.listOfApplications = data.payload;
            this.fetchCountryList();
        })
    }

    fetchCountryList() {
        this.http.get<any>("countries").subscribe(data => {
            this.countryList = data.payload.list;
            this.fetchOrgRoleConfigList();
            this.selectRefresh();
        })
    }

    onCountrySelect() {
        this.countryBusinessUnitList = [];
        this.http.get<any>("businessunit?countryCode='" + this.orgRoleConfigDTO.countryCode + "'").subscribe(data => {
            this.countryBusinessUnitList = data.payload.list;
            this.selectRefresh();
        });
        this.selectRefresh();
    }

    fetchRolesByAppCode() {
        this.listOfRolesByApplication = [];
        this.http.get<any>("neosuite/roles/application/" + this.applicationDTO.appCode).subscribe(data => {
            this.listOfRolesByApplication = data.payload;
            this.selectRefresh();
        }, err => {
        })
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

        for (var k in this.orgRoleConfigList) {
            this.orgRoleConfigList[k].actionButtonsList = [];
            this.orgRoleConfigList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deleteButton", "Delete",environment.cdnPath+"/Hub/delete"));
        }
    }
    fetchOrgConfigList() {
        this.orgConfigList = [];
        this.http.get<any>("org-config?enabled=true").subscribe(res => {
            debugger
            if (this.utilityService.isNotNullOrEmptyOrUndefined(res.list)) {
                res.list.forEach(orgConfig => {
                    orgConfig.orgStructureName = orgConfig.orgStructureName + " (" + orgConfig.orgStructureCode + ")";
                })
                this.orgConfigList = res.list;

            }
        })
    }

    refreshOrgRoleConfig() {

        this.listOfRolesByApplication = []
        this.countryBusinessUnitList = [];
        this.orgRoleConfigDTO = null;
        this.orgRoleConfigDTO = new OrgRoleConfigDTO();
        this.applicationDTO = null;
        this.selectRefresh();
    }
    selectRefresh() {
        setTimeout(function () {
            $('select').formSelect();
        }, 10);
    }
}
