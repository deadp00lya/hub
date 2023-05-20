import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from "@angular/forms";
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WidgetService } from '@nw-workspace/common-services';
import { ToastService } from 'projects/hub/src/app/services/toast.service';
import { UtilityService } from 'projects/hub/src/app/services/utility.service';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;
declare var require: any;

@Component({
    selector: 'app-hub-approval-list',
    templateUrl: './hub-approval-list.component.html',
    styleUrls: ['./hub-approval-list.component.css']
})

export class HubApprovalListComponent implements OnInit {
    loader: boolean = false;
    loader1: boolean = false;
    fieldConfiguration: any = {};
    totalCount: number;
    count: number;
    searchKey: string = "";
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    OnMecurrentPage: number = 1;
    BymecurrentPage: number = 1;
    itemsPerPageToDisplay: number = 50;
    loadingGroupDetail: boolean = false;
    maintenance: boolean = false;
    activeStatuslist: any[] = [];
    flag: any = {};
    filterbutton: boolean;
    statusAndCount: any = [];
    allApprovals: any[] = [];
    filteredapprovals: any;
    statusList: any = []
    approval: any = {};
    modalType: string;
    modalInstance: any;
    note: string;
    listOfApplications: any;
    widgetDetail: any;
    appCode: any;
    onMe: boolean = true;
    approvals: any[];
    approvalData: any;
    listPage: boolean = true;
    hideFilter: boolean = true;
    headers: HttpHeaders = new HttpHeaders();
    options: { headers: HttpHeaders; };
    pageData: any[] = [];
    cdnUrl=environment.cdnPath;


    @ViewChild("onMeByMe", { static: false }) onMeByMe: ElementRef
    widgetWidth: number;
    finalApprovalList: any[] = [];
    finalOnMeApprovalList: any[] = [];
    finalByMeApprovalList: any[] = [];
    countryList: any;
    countryBusinessUnitList: any[];
    constructor(private http: HttpClient, private widgetService: WidgetService, private toastService: ToastService, private utilityService: UtilityService) { 
        this.widgetService.selectedWidget$.subscribe(myWid => {
            this.widgetDetail = myWid;
        })
    }

    ngOnInit() {
        //this.getWidgetDetails();
        this.flag.Open = false;
        this.flag.Approved = false;
        this.flag.Cancelled = false;
        this.flag.Rejected = false;
        this.hideFilter = true;
        this.filterbutton = true;
        this.statusList = ['Open', 'Approved', 'Cancelled', 'Rejected'];
        this.appCode = this.widgetDetail.application.appCode;
        this.headers = this.headers.append('App-Code', this.appCode);
        this.headers = this.headers.append('Component', "approveList");
        this.options = { headers: this.headers };
        this.fetchApplicationFromNeosuite();
        this.fetchCountryList();
        this.onCountrySelect(null);

    }

    /* getWidgetDetails() {
        this.widgetService.currentWidgets.subscribe(widgets => {
            //console.table(widgets)
            for(let singleWidget of widgets){
             if(singleWidget.widgetPath == "HubApprovalListComponent") {
             this.widgetDetail = singleWidget;
             break;
             //console.log(singleWidget);
             }
            }
         
     })
    } */

    ngAfterViewInit() {
        setTimeout(() => {
            $('select').formSelect();

        }, 10);

        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });

        erdUltraFast.listenTo(document.getElementById("Group_Main_Div"), element => {
            this.onResizedEvent(element);
        });
    }

    fetchCountryList() {
        this.http.get<any>("countries").subscribe(data => {
            this.countryList = data.payload.list;
        })
    }

    onCountrySelect(countryCode): any {

        // this.advanceFilterDTO.businessunitCode = null;

        this.http.get<any>("businessunit").subscribe(data => {
            this.countryBusinessUnitList = data.payload.list;

        });

    }

    fetchFieldConfiguratorList() {
        

        //fieldConfigurator
        this.http.get<any>("field-configurations", this.options).subscribe(data => {
            this.fieldConfiguration = data.payload;
            if (this.fieldConfiguration == null) {
                this.fieldConfiguration = {};
            } else {
                if (!(this.fieldConfiguration['onMe'] && this.fieldConfiguration['onMe'].visible)) {
                    this.BymecurrentPage = 1;
                    this.fetchByMerecords();
                } else if ((this.fieldConfiguration['onMe'] && this.fieldConfiguration['onMe'].visible)) {
                    this.OnMecurrentPage = 1;
                    this.fetchOnMerecords();
                }
            }

        });
    }

    selectApproval(approvalData) {
        this.listPage = false;
        this.approvalData = approvalData;
    }

    pageRefresh() {
        setTimeout(function () {
            var elems = document.querySelectorAll('.datepicker');
            var instances = M.Datepicker.init(elems, {});
            setTimeout(function () {
            }, 0);
        }, 0);
    }

    backApprovalEventHander($event: any) {
        this.listPage = $event;
        this.fetchApprovals();
    }


    fetchOnMerecords() {
        this.resetFlag()
        this.onMe = true;
        setTimeout(() => {
            this.fetchApprovals();
        }, 0);
    }

    fetchByMerecords() {
        this.resetFlag()
        this.onMe = false;
        setTimeout(() => {
            this.fetchApprovals();
        }, 0);
    }

    fetchApprovals() {
        this.loader = true;
        this.statusAndCount = [];
        this.allApprovals = []
        this.approvals = [];

        let currentPage;
        if (this.onMe) {
            currentPage = this.OnMecurrentPage
        } else
            currentPage = this.BymecurrentPage

        this.http.get<any>("approvals?searchKey=" + this.searchKey + "&approval=" + this.onMe + "&page=" + (currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(data => {
            this.approvals = data.payload.approvalList;
            let empployeeData = data.payload.employeeList;
            this.totalCount = data.payload.count;
            this.count = this.totalCount;
            this.actionButtonsDisplay();
            this.loader = false;


            for (var i = 0; i < this.approvals.length; i++) {
                if (this.approvals[i].tbMasApproval.applicationCode != null) {
                    for (var j = 0; j < this.listOfApplications.length; j++) {
                        if (this.listOfApplications[j].appCode == this.approvals[i].tbMasApproval.applicationCode) {
                            this.approvals[i].tbMasApproval.applicationName = this.listOfApplications[j].appName;
                        }
                    }
                }
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.approvals[i].tbMasApproval.request)) {
                    var request = JSON.parse(this.approvals[i].tbMasApproval.request);
                    this.countryList.forEach(country => {
                        if (country.countryCode == request.data.countryCode) {
                            this.approvals[i]['countryName'] = country.countryName;
                            //this.countryBusinessUnitList = this.onCountrySelect(country.countryCode);
                            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.countryBusinessUnitList))
                                this.countryBusinessUnitList.forEach(bu => {
                                    if (bu.businessunitCode == request.data.businessunitCode) {
                                        this.approvals[i]['businessunitName'] = bu.businessunitName;
                                    }

                                })

                        }

                    });
                    //this.approvals[i]['countryName'] = request.oldDataDisplayNames.countryCode;
                    //this.approvals[i]['businessunitName'] = request.oldDataDisplayNames.businessunitCode;
                }

                if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData)) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.approvals[i].assignedBy)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.approvals[i].assignedBy])) {
                            this.approvals[i].assignedByName = empployeeData[this.approvals[i].assignedBy].employeeGlobalId + "-" + empployeeData[this.approvals[i].assignedBy].firstName + " " + empployeeData[this.approvals[i].assignedBy].lastName;
                        } else {
                            this.approvals[i].assignedByName = this.approvals[i].assignedBy;
                        }
                    }

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.approvals[i].assignedTo)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.approvals[i].assignedTo])) {
                            this.approvals[i].assignedToName = empployeeData[this.approvals[i].assignedTo].employeeGlobalId + "-" + empployeeData[this.approvals[i].assignedTo].firstName + " " + empployeeData[this.approvals[i].assignedTo].lastName;
                        } else {
                            this.approvals[i].assignedToName = this.approvals[i].assignedTo;
                        }
                    }

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.approvals[i].proxyBy)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.approvals[i].proxyBy])) {
                            this.approvals[i].proxyByName = empployeeData[this.approvals[i].proxyBy].employeeGlobalId + "-" + empployeeData[this.approvals[i].proxyBy].firstName + " " + empployeeData[this.approvals[i].proxyBy].lastName;
                        } else {
                            this.approvals[i].proxyByName = this.approvals[i].proxyBy;
                        }
                    }

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.approvals[i].tbMasApproval.approvalFor)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.approvals[i].tbMasApproval.approvalFor])) {
                            this.approvals[i].tbMasApproval.approvalForName = empployeeData[this.approvals[i].tbMasApproval.approvalFor].employeeGlobalId + "-" + empployeeData[this.approvals[i].tbMasApproval.approvalFor].firstName + " " + empployeeData[this.approvals[i].tbMasApproval.approvalFor].lastName;
                        } else {
                            this.approvals[i].tbMasApproval.approvalForName = this.approvals[i].tbMasApproval.approvalFor;
                        }
                    }
                }
            }

            this.allApprovals = this.approvals;
            /* if (this.utilityService.isNotNullOrEmptyOrUndefined(this.allApprovals) && this.count <= 50) {
                for (var e of this.statusList) {
                    var count = 0
                    for (var i = 0; i < this.approvals.length; i++) {
                        if (this.approvals[i].status.statusName == e) {
                            count++;
                        }
                    }
                    this.statusAndCount.push({ e, count });
                }

                this.setStatusFilter(null, null, null);
            } else  */if (this.onMe && this.utilityService.isNotNullOrEmptyOrUndefined(this.allApprovals)) {
                this.fetchAllOnMeApprovalList();
            }
            else if (!this.onMe && this.utilityService.isNotNullOrEmptyOrUndefined(this.allApprovals)) {
                this.fetchAllByApprovalList();
            }
        });
    }


    fetchAllOnMeApprovalList() {
        this.loader = true;
        this.statusAndCount = [];

        /*   let currentPage;
          if (this.onMe) {
              currentPage = this.OnMecurrentPage
          } else
              currentPage = this.BymecurrentPage */

        this.http.get<any>("approvals?approval=" + this.onMe).subscribe(data => {

            this.finalOnMeApprovalList = data.payload.approvalList;
            let empployeeData = data.payload.employeeList;
            //this.totalCount = data.payload.count;
            // this.count = this.totalCount;
            this.actionButtonsDisplay();
            this.loader = false;




            for (var i = 0; i < this.finalOnMeApprovalList.length; i++) {
                if (this.finalOnMeApprovalList[i].tbMasApproval.applicationCode != null) {
                    for (var j = 0; j < this.listOfApplications.length; j++) {
                        if (this.listOfApplications[j].appCode == this.finalOnMeApprovalList[i].tbMasApproval.applicationCode) {
                            this.finalOnMeApprovalList[i].tbMasApproval.applicationName = this.listOfApplications[j].appName;
                        }
                    }
                }

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalOnMeApprovalList[i].tbMasApproval.request)) {
                    var request = JSON.parse(this.finalOnMeApprovalList[i].tbMasApproval.request);
                    this.countryList.forEach(country => {
                        if (country.countryCode == request.data.countryCode) {
                            this.finalOnMeApprovalList[i]['countryName'] = country.countryName;
                            //this.countryBusinessUnitList = this.onCountrySelect(country.countryCode);
                            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.countryBusinessUnitList))
                                this.countryBusinessUnitList.forEach(bu => {
                                    if (bu.businessunitCode == request.data.businessunitCode) {
                                        this.finalOnMeApprovalList[i]['businessunitName'] = bu.businessunitName;
                                    }

                                })

                        }

                    });
                }

                if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData)) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalOnMeApprovalList[i].assignedBy)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.finalOnMeApprovalList[i].assignedBy])) {
                            this.finalOnMeApprovalList[i].assignedByName = empployeeData[this.finalOnMeApprovalList[i].assignedBy].employeeGlobalId + "-" + empployeeData[this.finalOnMeApprovalList[i].assignedBy].firstName + " " + empployeeData[this.finalOnMeApprovalList[i].assignedBy].lastName;
                        } else {
                            this.finalOnMeApprovalList[i].assignedByName = this.finalOnMeApprovalList[i].assignedBy;
                        }
                    }

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalOnMeApprovalList[i].assignedTo)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.finalOnMeApprovalList[i].assignedTo])) {
                            this.finalOnMeApprovalList[i].assignedToName = empployeeData[this.finalOnMeApprovalList[i].assignedTo].employeeGlobalId + "-" + empployeeData[this.finalOnMeApprovalList[i].assignedTo].firstName + " " + empployeeData[this.finalOnMeApprovalList[i].assignedTo].lastName;
                        } else {
                            this.finalOnMeApprovalList[i].assignedToName = this.finalOnMeApprovalList[i].assignedTo;
                        }
                    }

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalOnMeApprovalList[i].proxyBy)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.finalOnMeApprovalList[i].proxyBy])) {
                            this.finalOnMeApprovalList[i].proxyByName = empployeeData[this.finalOnMeApprovalList[i].proxyBy].employeeGlobalId + "-" + empployeeData[this.finalOnMeApprovalList[i].proxyBy].firstName + " " + empployeeData[this.finalOnMeApprovalList[i].proxyBy].lastName;
                        } else {
                            this.finalOnMeApprovalList[i].proxyByName = this.finalOnMeApprovalList[i].proxyBy;
                        }
                    }

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalOnMeApprovalList[i].tbMasApproval.approvalFor)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.finalOnMeApprovalList[i].tbMasApproval.approvalFor])) {
                            this.finalOnMeApprovalList[i].tbMasApproval.approvalForName = empployeeData[this.finalOnMeApprovalList[i].tbMasApproval.approvalFor].employeeGlobalId + "-" + empployeeData[this.finalOnMeApprovalList[i].tbMasApproval.approvalFor].firstName + " " + empployeeData[this.finalOnMeApprovalList[i].tbMasApproval.approvalFor].lastName;
                        } else {
                            this.finalOnMeApprovalList[i].tbMasApproval.approvalForName = this.finalOnMeApprovalList[i].tbMasApproval.approvalFor;
                        }
                    }
                }
            }
            //this.finalOnMeApprovalList = this.approvals;
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalOnMeApprovalList)) {
                //   this.allApprovals = this.approvals;
                for (var e of this.statusList) {
                    var count = 0
                    for (var i = 0; i < this.finalOnMeApprovalList.length; i++) {
                        if (this.finalOnMeApprovalList[i].status.statusName == e) {
                            count++;
                        }
                    }
                    this.statusAndCount.push({ e, count });
                }

                this.setStatusFilter(null, null, null);
            }

        });
    }


    fetchAllByApprovalList() {
        this.loader = true;
        this.statusAndCount = [];
        this.approvals = []

        /*      let currentPage;
             if (this.onMe) {
                 currentPage = this.OnMecurrentPage
             } else
                 currentPage = this.BymecurrentPage */

        this.http.get<any>("approvals?approval=" + this.onMe).subscribe(data => {

            this.finalByMeApprovalList = data.payload.approvalList;
            let empployeeData = data.payload.employeeList;
            //this.totalCount = data.payload.count;
            //this.count = this.totalCount;
            this.actionButtonsDisplay();
            this.loader = false;




            for (var i = 0; i < this.finalByMeApprovalList.length; i++) {
                if (this.finalByMeApprovalList[i].tbMasApproval.applicationCode != null) {
                    for (var j = 0; j < this.listOfApplications.length; j++) {
                        if (this.listOfApplications[j].appCode == this.finalByMeApprovalList[i].tbMasApproval.applicationCode) {
                            this.finalByMeApprovalList[i].tbMasApproval.applicationName = this.listOfApplications[j].appName;
                        }
                    }
                }
                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalByMeApprovalList[i].tbMasApproval.request)) {
                    var request = JSON.parse(this.finalByMeApprovalList[i].tbMasApproval.request);
                    this.countryList.forEach(country => {
                        if (country.countryCode == request.data.countryCode) {
                            this.finalByMeApprovalList[i]['countryName'] = country.countryName;
                            //this.countryBusinessUnitList = this.onCountrySelect(country.countryCode);
                            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.countryBusinessUnitList))
                                this.countryBusinessUnitList.forEach(bu => {
                                    if (bu.businessunitCode == request.data.businessunitCode) {
                                        this.finalByMeApprovalList[i]['businessunitName'] = bu.businessunitName;
                                    }

                                })

                        }

                    });
                }
                if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData)) {
                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalByMeApprovalList[i].assignedBy)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.finalByMeApprovalList[i].assignedBy])) {
                            this.finalByMeApprovalList[i].assignedByName = empployeeData[this.finalByMeApprovalList[i].assignedBy].employeeGlobalId + "-" + empployeeData[this.finalByMeApprovalList[i].assignedBy].firstName + " " + empployeeData[this.finalByMeApprovalList[i].assignedBy].lastName;
                        } else {
                            this.finalByMeApprovalList[i].assignedByName = this.finalByMeApprovalList[i].assignedBy;
                        }
                    }

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalByMeApprovalList[i].assignedTo)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.finalByMeApprovalList[i].assignedTo])) {
                            this.finalByMeApprovalList[i].assignedToName = empployeeData[this.finalByMeApprovalList[i].assignedTo].employeeGlobalId + "-" + empployeeData[this.finalByMeApprovalList[i].assignedTo].firstName + " " + empployeeData[this.finalByMeApprovalList[i].assignedTo].lastName;
                        } else {
                            this.finalByMeApprovalList[i].assignedToName = this.finalByMeApprovalList[i].assignedTo;
                        }
                    }

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalByMeApprovalList[i].proxyBy)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.finalByMeApprovalList[i].proxyBy])) {
                            this.finalByMeApprovalList[i].proxyByName = empployeeData[this.finalByMeApprovalList[i].proxyBy].employeeGlobalId + "-" + empployeeData[this.finalByMeApprovalList[i].proxyBy].firstName + " " + empployeeData[this.finalByMeApprovalList[i].proxyBy].lastName;
                        } else {
                            this.finalByMeApprovalList[i].proxyByName = this.finalByMeApprovalList[i].proxyBy;
                        }
                    }

                    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalByMeApprovalList[i].tbMasApproval.approvalFor)) {
                        if (this.utilityService.isNotNullOrEmptyOrUndefined(empployeeData[this.finalByMeApprovalList[i].tbMasApproval.approvalFor])) {
                            this.finalByMeApprovalList[i].tbMasApproval.approvalForName = empployeeData[this.finalByMeApprovalList[i].tbMasApproval.approvalFor].employeeGlobalId + "-" + empployeeData[this.finalByMeApprovalList[i].tbMasApproval.approvalFor].firstName + " " + empployeeData[this.finalByMeApprovalList[i].tbMasApproval.approvalFor].lastName;
                        } else {
                            this.finalByMeApprovalList[i].tbMasApproval.approvalForName = this.finalByMeApprovalList[i].tbMasApproval.approvalFor;
                        }
                    }
                }
            }
            // this.finalByMeApprovalList = this.approvals;
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.finalByMeApprovalList)) {
                // this.allApprovals = this.approvals;
                for (var e of this.statusList) {
                    var count = 0
                    for (var i = 0; i < this.finalByMeApprovalList.length; i++) {
                        if (this.finalByMeApprovalList[i].status.statusName == e) {
                            count++;
                        }
                    }
                    this.statusAndCount.push({ e, count });
                }

                this.setStatusFilter(null, null, null);
            }

        });

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

    cancelApproval() {
        this.http.get<any>("approvals/cancel?approvalAssignmentId=" + this.approval.id + "&note=" + this.note).subscribe(data => {
            // this.fetchAllOnMeApprovalList();
            this.closeModal();

            this.fetchApprovals();
        });
    }

    rejectApproval() {
        this.http.get<any>("approvals/reject?approvalAssignmentId=" + this.approval.id + "&note=" + this.note).subscribe(data => {
            //this.fetchAllOnMeApprovalList();
            //this.fetchAllByApprovalList();
            this.closeModal();

            this.fetchApprovals();
        });
    }

    event(ev) {
        ev.stopPropagation();
    }

    approve(event) {

        if (!event.detail || event.detail == 1) {

            this.http.get<any>("approvals/approve?approvalAssignmentId=" + this.approval.id + "&note=" + this.note).subscribe(data => {
                this.closeModal();
                // this.fetchAllByApprovalList();
                // this.fetchAllOnMeApprovalList();
                this.fetchApprovals();
                this.loader1 = false;
            }, err => {
                this.loader1 = false;
            });
        }
        else {
            return false;
        }

    }

    fetchApplicationFromNeosuite() {
        this.http.get<any>("neosuite/applications").subscribe(data => {
            this.listOfApplications = data.payload;
            this.fetchFieldConfiguratorList();
            // this.fetchAllByApprovalList();
            // this.fetchAllOnMeApprovalList();
            // this.fetchOnMerecords();
        })
    }

    closeModal() {
        var elemodal = document.getElementById('approvalListModal');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.close();
        this.note = null;
    }

    openModal(modalType, approval) {
        this.approval = {}
        this.modalType = modalType;
        this.approval = approval;

        var elemodal = document.getElementById('approvalListModal');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.open();
        this.note = null;
    }

    save(event) {

        if (this.modalType == "approve") {
            this.approve(event);
        }
        else if (this.modalType == "reject") {
            if (this.note == null || this.note == "" || this.note == undefined) {
                this.toastService.error("Enter Comment");
            } else {
                this.rejectApproval();
            }
        }
        else if (this.modalType == "cancel") {
            this.cancelApproval();
        }
    }

    countApprovalsByStatus(status) {
        this.approvals = this.allApprovals
        this.filteredapprovals = []
        var count = 0

        for (var i = 0; i < this.approvals.length; i++) {
            if (this.approvals[i].status.statusName == status) {
                this.filteredapprovals.push(this.approvals[i]);
            }
        }

        for (var j = 0; j < this.filteredapprovals.length; j++) {
            count++;
        }
        return count;
    }

    countTicketByStatus(status) {

    }

    setStatusFilter(status, value, event) {
        if (this.utilityService.isNotNullOrEmptyOrUndefined(status)) {
            if (value) {
                this.flag[status] = false;
            } else {
                this.flag[status] = true;
            }
        }

        for (var statusName in this.flag) {
            if (this.flag[statusName]) {
                if (!this.activeStatuslist.includes(statusName)) {
                    this.activeStatuslist.push(statusName);
                }
            } else {
                if (this.activeStatuslist.includes(statusName)) {
                    this.activeStatuslist.splice(this.activeStatuslist.indexOf(statusName), 1);
                }
            }
        }

        if (this.activeStatuslist.length == 0) {
            this.approvals = this.allApprovals;
            this.count = this.totalCount;
        } else if (this.activeStatuslist.length > 0) {
            this.approvals = [];
            this.pageData = [];
            if (this.onMe) {
                for (let statusname of this.activeStatuslist) {
                    this.filteredapprovals = []
                    for (var i = 0; i < this.finalOnMeApprovalList.length; i++) {
                        if (this.finalOnMeApprovalList[i].status.statusName == statusname) {
                            this.filteredapprovals.push(this.finalOnMeApprovalList[i]);
                        }
                    }
                    this.pageData = this.pageData.concat(this.filteredapprovals);
                    this.count = this.pageData.length;
                }
                if (this.pageData.length <= 50)
                    this.OnMecurrentPage = 1;
                var start = (this.OnMecurrentPage - 1) * this.itemsPerPageToDisplay;
                var end = start + this.itemsPerPageToDisplay;
                this.approvals = this.pageData.slice(start, end);
            } else {
                for (let statusname of this.activeStatuslist) {
                    this.filteredapprovals = []
                    for (var i = 0; i < this.finalByMeApprovalList.length; i++) {
                        if (this.finalByMeApprovalList[i].status.statusName == statusname) {
                            this.filteredapprovals.push(this.finalByMeApprovalList[i]);
                        }
                    }
                    this.pageData = this.pageData.concat(this.filteredapprovals);
                    this.count = this.pageData.length;
                }
                if (this.pageData.length <= 50)
                    this.BymecurrentPage = 1;
                var start = (this.BymecurrentPage - 1) * this.itemsPerPageToDisplay;
                var end = start + this.itemsPerPageToDisplay;
                this.approvals = this.pageData.slice(start, end);
            }
        }
    }

    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.approvals) {
            this.approvals[k].actionButtonsList = [];
            //            this.employeeViewList[k].showViewButton = true;
            //            this.employeeViewList[k].showEventButton = true;
            this.approvals[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
            if (this.onMe && this.utilityService.isNotNullOrEmptyOrUndefined(this.approvals)) {
                if (this.onMe && this.approvals[k].tbMasApproval.status.statusName == 'Open') {
                    this.approvals[k].actionButtonsList.push(this.actionButtonsObjectCreation("Reject", "Reject Ticket", environment.cdnPath + "/Hub/close"));
                    this.approvals[k].actionButtonsList.push(this.actionButtonsObjectCreation("Approval", "Approve Ticket", environment.cdnPath + "/Hub/done"));
                }
            }
            if (!this.onMe && this.approvals[k].tbMasApproval.status.statusName == 'Open') {
                this.approvals[k].actionButtonsList.push(this.actionButtonsObjectCreation("Cancel", "Cancel Ticket", environment.cdnPath + "/Hub/close"));
            }
        }

        if (this.onMe) {
            for (var k in this.finalOnMeApprovalList) {
                this.finalOnMeApprovalList[k].actionButtonsList = [];
                //            this.employeeViewList[k].showViewButton = true;
                //            this.employeeViewList[k].showEventButton = true;
                this.finalOnMeApprovalList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
                if (this.onMe && this.utilityService.isNotNullOrEmptyOrUndefined(this.finalOnMeApprovalList)) {
                    if (this.onMe && this.finalOnMeApprovalList[k].tbMasApproval.status.statusName == 'Open') {
                        this.finalOnMeApprovalList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Reject", "Reject Ticket", environment.cdnPath + "/Hub/close"));
                        this.finalOnMeApprovalList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Approval", "Approve Ticket", environment.cdnPath + "/Hub/done"));
                    }
                }
                if (!this.onMe && this.finalOnMeApprovalList[k].tbMasApproval.status.statusName == 'Open') {
                    this.finalOnMeApprovalList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Cancel", "Cancel Ticket", environment.cdnPath + "/Hub/close"));
                }
            }
        }
        if (!this.onMe) {
            for (var k in this.finalByMeApprovalList) {
                this.finalByMeApprovalList[k].actionButtonsList = [];
                //            this.employeeViewList[k].showViewButton = true;
                //            this.employeeViewList[k].showEventButton = true;
                this.finalByMeApprovalList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
                if (this.onMe && this.utilityService.isNotNullOrEmptyOrUndefined(this.finalByMeApprovalList)) {
                    if (this.onMe && this.finalByMeApprovalList[k].tbMasApproval.status.statusName == 'Open') {
                        this.finalByMeApprovalList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Reject", "Reject Ticket", environment.cdnPath + "/Hub/close"));
                        this.finalByMeApprovalList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Approval", "Approve Ticket", environment.cdnPath + "/Hub/done"));
                    }
                }
                if (!this.onMe && this.finalByMeApprovalList[k].tbMasApproval.status.statusName == 'Open') {
                    this.finalByMeApprovalList[k].actionButtonsList.push(this.actionButtonsObjectCreation("Cancel", "Cancel Ticket", environment.cdnPath + "/Hub/close"));
                }
            }
        }


    }


    resetFlag() {
        this.flag.Open = false;
        this.flag.Approved = false;
        this.flag.Cancelled = false;
        this.flag.Rejected = false;
    }



    outputFromListView(outPutFromChild) {

        if (outPutFromChild.selectedAction == "viewButton") {
            if (this.onMe) {
                let approvalData = outPutFromChild.listDetails;
                this.selectApproval(approvalData);
            } else {
                let approvalData = outPutFromChild.listDetails;
                this.selectApproval(approvalData);
            }
        } else if (outPutFromChild.selectedAction == "Reject") {
            let modalType = 'reject'
            if (this.onMe) {
                let approvalData = outPutFromChild.listDetails;
                this.openModal(modalType, approvalData)
            } else {
                let approvalData = outPutFromChild.listDetails;
                this.selectApproval(approvalData);
                this.openModal(modalType, approvalData);
            }
        } else if (outPutFromChild.selectedAction == "Approval") {

            let modalType = 'approve'
            if (this.onMe) {
                let approvalData = outPutFromChild.listDetails;
                this.openModal(modalType, approvalData)
            } else {
                let approvalData = outPutFromChild.listDetails;
                this.openModal(modalType, approvalData);
            }
        }
        else if (outPutFromChild.selectedAction == "Cancel") {
            let modalType = 'cancel'
            if (this.onMe) {
                let approvalData = outPutFromChild.listDetails;
                this.openModal(modalType, approvalData)
            } else {
                let approvalData = outPutFromChild.listDetails;
                this.openModal(modalType, approvalData);
            }
        }
        else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.onMe) {

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                    this.searchKey = outPutFromChild.textToSearch;
                }
                this.OnMecurrentPage = outPutFromChild.listDetails.page;
                this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
                if (this.activeStatuslist.length == 0) {
                    this.fetchOnMerecords();
                }
                else {
                    this.setStatusFilter(null, null, null);
                }

            } else {

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.searchKey)) {
                    this.searchKey = outPutFromChild.textToSearch;
                }
                this.BymecurrentPage = outPutFromChild.listDetails.page;
                this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
                if (this.activeStatuslist.length == 0) {
                    this.fetchByMerecords();
                }
                else {
                    this.setStatusFilter(null, null, null);
                }

            }
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            if (this.onMe) {
                this.searchKey = outPutFromChild.listDetails;
                this.fetchOnMerecords();
            } else {
                this.searchKey = outPutFromChild.listDetails;
                this.fetchByMerecords();
            }

        }
        else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
        }
        else if (outPutFromChild.selectedAction == "listViewRowSize") {
            this.itemsPerPageToDisplay = outPutFromChild.listDetails;
        }
    }
}
