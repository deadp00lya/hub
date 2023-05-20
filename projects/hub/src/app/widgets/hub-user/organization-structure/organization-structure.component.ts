import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UtilityService } from '../../../services/utility.service';
import { SessionService, WidgetService } from '@nw-workspace/common-services';
import { ToastService } from '../../../services/toast.service';
declare var $: any;

@Component({
    selector: 'app-organization-structure',
    templateUrl: './organization-structure.component.html',
    styleUrls: ['./organization-structure.component.css']
})

export class OrganizationStructureComponent implements OnInit {
    widgetDetail: any;
    showOrgList: boolean = false;
    orgCodeList: any[] = [];
    myOrgRoleConfig: any[] = [];
    myAppRoles: any[] = [];
    currentUser: any;
    startNode: string;
    orgCode: string;
    showOrg: boolean = false;
    headers: HttpHeaders = new HttpHeaders();
    options: { headers: HttpHeaders; };
    constructor(private util: UtilityService, private sessionService: SessionService,
         private toast: ToastService, private http: HttpClient, private widgetService: WidgetService) {
            this.widgetService.selectedWidget$.subscribe(myWid => {
                this.widgetDetail = myWid;
            })
    }

    ngOnInit() {
        debugger
        //this.getWidgetDetails();
        this.widgetDetail;
        this.fetchOrgRoleConfigList();
        this.currentUser = this.sessionService.getCurrentUser();
        this.startNode = this.startNode = this.sessionService.getCurrentUser().preferred_username;

    }

    /* getWidgetDetails() {
        this.widgetService.currentWidgets.subscribe(widgets => {
            //console.table(widgets)
            for(let singleWidget of widgets) {
             if(singleWidget.widgetPath == "OrganizationStructureComponent") {
             this.widgetDetail = singleWidget;
             //console.log(singleWidget);
             break;
             }
            }
         
     })
    } */
    outputFromORGComponent(outputFromOrg) {
        

        if (outputFromOrg.selectedAction == "close") {
            this.showOrg = false;
            this.showOrgList = true;
        }

    }

    showOrgFunction(orgCode) {
        this.orgCode = orgCode;
        this.showOrgList = false;
        this.showOrg = true;
    }
    fetchOrgRoleConfigList() {
        //fetchOrgRoleConfig
        this.http.get<any>("org-role/configurations").subscribe(data => {
            
            if (this.util.isNotNullOrUndefined(data)) {
                for (var orgConfig of data) {
                    orgConfig[0]['orgStructureName'] = orgConfig[1];
                    this.myOrgRoleConfig.push(orgConfig[0])
                }
                this.fetchAllMyAppRoles();
            }
        })
    }
    fetchAllMyAppRoles() {
        
        this.orgCodeList = []
        this.http.get<any>("neosuite/api/fetchAllMyAppRoles").subscribe(data => {
            
            if (this.util.isNotNullOrUndefined(data.payload)) {
                this.myAppRoles = data.payload;
debugger
                for (var app of this.myAppRoles[this.widgetDetail.appModule.applications.appName]) {
                    for (var role of this.myOrgRoleConfig) {
                        if (app.roleCode == role.roleCode) {
                            if (this.util.isNotNullOrEmptyOrUndefined(role.countryCode)) {
                                if (role.countryCode == this.currentUser.additionalDetails.countryCode) {
                                    if (this.util.isNotNullOrEmptyOrUndefined(role.businessUnitCode)) {
                                        if (this.currentUser.additionalDetails.buCode == role.businessUnitCode) {
                                            this.orgCodeList.push(role);
                                            this.showOrgList = true;
                                        }

                                    } else {
                                        this.orgCodeList.push(role);
                                        //this.showOrgList = true;
                                    }
                                }
                            } else {
                                this.orgCodeList.push(role);
                                //this.showOrgList = true;
                            }
                        }
                    }
                }
                var sortedArray: any[] = this.orgCodeList.sort((n1, n2) => {
                    if (n1.sequence > n2.sequence) {
                        return 1;
                    }

                    if (n1.sequence < n2.sequence) {
                        return -1;
                    }

                    return 0;
                });
                this.orgCodeList = [];
                this.orgCodeList = sortedArray;
                this.showOrgList = true;
            }
        })
    }

}
