import { Component, OnInit, Input } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from "@angular/common/http";
import { ToastService } from '../../../services/toast.service';
import { WidgetService, UtilityService, SessionService } from '@nw-workspace/common-services';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;
declare var require: any;

@Component({
	selector: 'app-client-bu-creation',
	templateUrl: './client-bu-creation.component.html',
	styleUrls: ['./client-bu-creation.component.css']
})

export class ClientBuCreationComponent implements OnInit {
	constructor(private http: HttpClient, public widgetService: WidgetService,
		private toastService: ToastService, public utilityService: UtilityService, private sessionService: SessionService) {
		this.currentUser = this.sessionService.getCurrentUser();
		this.appCode = "cmas";
	}

	@Input("keyRestrictions") keyRestrictions: any = new Map();
	@Input("appCode") appCode: any;

	currentRole: any;
	appRoles: any;
	employeeData: any;
	configPage: any;
	instancesSow: any;
	instancesLe: any;

	formCode: any;
	itemsPerPageToDisplay: number = 50;
	currentPage: number = 1;
	count: any;
	actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
	searchKey: string = '';
	widgetWidth: number;

	businessunitList: any[] = [];
	businessunitPage: boolean = true;
	businessunitFormPage: boolean = false;
	businessunitListPage: boolean = true;
	leClient: string = null;

	clientList: any[] = [];
	clientPage: boolean = false;
	clientFormPage: boolean = false;
	clientListPage: boolean = false;

	sowList: any[] = [];
	sowPage: boolean = false;
	sowFormPage: boolean = false;
	sowListPage: boolean = false;
	sowClient: string = null;

	lobList: any[] = [];
	seletedClientList: string = "";
	seletedLobList: any[] = [];
	updateFlag: boolean = false;
	createFlag: boolean = false;
	fieldType: string = "Businessunit";
	currentUser: any;

	ngOnInit(): void {
		this.currentRole = this.getCurrentRole();
        if (this.currentRole == "cmasLegal" ||this.currentRole == "cmasAccountManagemant") {
			this.setConfigPage(0);
		} else {
			this.setConfigPage(1);
		}
		this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username

	}

	getCurrentRole() {
		this.appRoles = this.sessionService.getCurrentUser().additionalDetails.neosuite.appRoles;
		for (var e in this.appRoles) {
			if (this.appRoles[e].appCode == "cmas") {
				return this.appRoles[e].roles[0].roleCode;
			}
		}
	}

	ngAfterViewInit() {
		var elementResizeDetectorMaker = require("element-resize-detector");
		var erdUltraFast = elementResizeDetectorMaker({
			strategy: "scroll" //<- For ultra performance.
		});

		erdUltraFast.listenTo(document.getElementById("hub_client_bu_creation"), element => {
			this.onResizedEvent(element);
		});

		document.addEventListener("DOMContentLoaded", function() {
			$('.preloader-background ').delay(5000).fadeOut(' slow');
			$('.preloader-wrapper ')
				.delay(5000)
				.fadeOut();
		});

		$('.dropdown-trigger').dropdown({
			closeOnClick: false
		});
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

	pageRefresh() {
		setTimeout(function() {
			M.updateTextFields();
			M.AutoInit();
		}, 0);
	}

	selectRefresh() {
		setTimeout(() => {
			$('select').formSelect()
		}, 0);
	}

	setConfigPage(configPage) {
		this.configPage = configPage;
		if (this.configPage == 0) {
			this.createFlag = true;
			this.formCode = "CF2"
			this.fieldType = 'Client'
			this.employeeData = null
			this.keyRestrictions = {};
			this.clientFormPage = true;
			this.clientListPage = false;
			this.businessunitFormPage = false;
			this.businessunitListPage = false;
			this.sowFormPage = false;
			this.sowListPage = false;
			this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username
		} else if (this.configPage == 1) {
			this.searchKey = '';
			this.createFlag = false;
			this.formCode = "CF1"
			this.fieldType = 'Client'
			this.clientFormPage = false;
			this.clientListPage = true;
			this.businessunitFormPage = false;
			this.businessunitListPage = false;
			this.sowFormPage = false;
			this.sowListPage = false;
			this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username
			this.getClientList();
		} else if (this.configPage == 2) {
			this.getAllClientList();
			this.leClient = null;

			var elems = document.getElementById("le_client_modal");
			this.instancesLe = M.Modal.init(elems, {
				dismissible: false
			});

			this.instancesLe.open();
			this.createFlag = true;
			this.fieldType = 'Businessunit'
			this.keyRestrictions = {};
			this.clientFormPage = false;
			this.clientListPage = false;
			this.sowFormPage = false;
			this.sowListPage = false;
			this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username
		} else if (this.configPage == 3) {
			this.searchKey = '';
			this.createFlag = false;
			this.formCode = "BUF1"
			this.fieldType = 'Businessunit'
			this.clientFormPage = false;
			this.clientListPage = false;
			this.businessunitFormPage = false;
			this.businessunitListPage = true;
			this.sowFormPage = false;
			this.sowListPage = false;
			this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username
			this.getAllClientList();
			this.getBusinessunitList();
		} else if (this.configPage == 4) {
			this.getAllClientList();
			this.sowClient = null;

			var elems = document.getElementById("sow_client_modal");
			this.instancesSow = M.Modal.init(elems, {
				dismissible: false
			});

			this.instancesSow.open();
			this.createFlag = true;
			this.fieldType = 'SOW'
			this.keyRestrictions = {};
			this.clientFormPage = false;
			this.clientListPage = false;
			this.businessunitFormPage = false;
			this.businessunitListPage = false;
			this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username
		} else if (this.configPage == 5) {
			this.searchKey = '';
			this.createFlag = false;
			this.formCode = "SOWF1";
			this.fieldType = 'SOW';
			this.sowClient = null;
			this.seletedLobList = [];
			this.clientFormPage = false;
			this.clientListPage = false;
			this.businessunitFormPage = false;
			this.businessunitListPage = false;
			this.sowFormPage = false;
			this.sowListPage = true;
			this.getAllClientList();
			this.getLobList();
			this.getSowList();
		}
	}

	onLeClientSelect() {
		if (this.utilityService.isNullOrEmptyOrUndefined(this.leClient)) {
			this.toastService.warning("Select Client");
			return;
		}
		this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username
		this.formCode = "BUF2"
		this.instancesLe.close();
		this.businessunitFormPage = true;
		this.businessunitListPage = false;
	}

	onLeClientCancel() {
		this.leClient = null;
		this.instancesLe.close();
		this.openSideNav();
	}

	onSowClientSelect() {
		if (this.utilityService.isNullOrEmptyOrUndefined(this.sowClient)) {
			this.toastService.warning("Select Client");
			return;
		}
		this.keyRestrictions["loggedInUser"] = this.sessionService.getCurrentUser().preferred_username
		this.formCode = "SOWF2"
		this.instancesSow.close();
		this.sowFormPage = true;
		this.sowListPage = false;
	}

	onSowClientCancel() {
		this.sowClient = null;
		this.instancesSow.close();
		this.openSideNav();
	}

	openSideNav() {
		var instance = M.Sidenav.init(document.getElementById('pexSlideOut'), {
			onOpenStart: () => {
				$(".sidenav-overlay").addClass("view_noOverlay");
			},
			onCloseEnd: () => {
				$(".sidenav-overlay").removeClass("view_noOverlay");
			}
		});
		instance.open();
	}

	getBusinessunitList() {
		
		this.businessunitList = [];
		this.count = 0;
		//fetchGlobalBusinessunit
		let url = 'businessunits?size=' + this.itemsPerPageToDisplay + '&page=' + this.currentPage + '&searchKey=' + this.searchKey;
		 if(this.utilityService.isNotNullOrEmptyOrUndefined(this.seletedClientList)) {
		  url = url + '&clientList=' + this.seletedClientList
		 }
		this.http.get<any>(url).subscribe(response => {
			if (this.utilityService.isNotNullOrEmptyOrUndefined(response)) {
				this.businessunitList = response.payload.list;
				this.count = response.payload.totalItems;
				this.actionButtonsDisplay();
			}
			this.pageRefresh();
		});
	}

	getAllClientList() {
		this.clientList = [];
		//getAllClientNameAndCode
		this.http.get<any>('clients').subscribe(response => {
			this.clientList = response.payload.list;
			this.selectRefresh();
		});
	}

	getClientList() {
		this.clientList = [];
		this.count = 0;
		//getClientNameAndCode
		this.http.get<any>('clients?size=' + this.itemsPerPageToDisplay + '&page=' + this.currentPage + '&searchKey=' + this.searchKey).subscribe(response => {
			this.clientList = response.payload.list;
			this.count = response.payload.totalItems;
			this.actionButtonsDisplay();
			this.pageRefresh();
		});
	}

	getLobList() {
		this.lobList = [];
		//getLobList
		this.http.get<any>('lob').subscribe(response => {
			this.lobList = response.payload.list;
			this.pageRefresh();
		});
	}

	getSowList() {
		this.sowList = [];
		this.count = 0;
		//getSowList
		this.http.get<any>('sow?size=' + this.itemsPerPageToDisplay + '&page=' + this.currentPage + '&lobList=' + this.seletedLobList + '&clientCode=' + this.sowClient + '&searchKey=' + this.searchKey).subscribe(response => {
			this.sowList = response.payload.list;
			this.count = response.payload.totalItems;
			this.actionButtonsDisplay();
			this.pageRefresh();
		});
	}

	getSowListOverClient() {
		this.sowList = [];
		this.count = 0;
		//getSowList
		this.http.get<any>('sow?size=' + this.itemsPerPageToDisplay + '&page=' + this.currentPage + '&lobList=' + this.seletedLobList + '&clientCode=' + this.sowClient + '&searchKey=' + this.searchKey).subscribe(response => {
			this.sowList = response.payload.list;
			this.count = response.payload.totalItems;
			this.actionButtonsDisplay();
			this.pageRefresh();
		});
	}

	getSowListOverLob() {
		this.sowList = [];
		this.count = 0;
		//getSowList
		this.http.get<any>('sow?size=' + this.itemsPerPageToDisplay + '&page=' + this.currentPage + '&lobList=' + this.seletedLobList + '&clientCode=' + this.sowClient + '&searchKey=' + this.searchKey).subscribe(response => {
			this.sowList = response.payload.list;
			this.count = response.payload.totalItems;
			this.actionButtonsDisplay();
			this.pageRefresh();
		});
	}

	outputFromFormView(outPutFromChild) {
		if (outPutFromChild.selectedAction == "saveButton") {
			let apiCode = outPutFromChild.data.updateAPICode;
			let updatedCode = outPutFromChild.data.data;

			if (this.createFlag)
				updatedCode.approval = 9;

			if (this.fieldType == 'Businessunit') {
				let clientCode = this.keyRestrictions['clientCode'];

				if (this.createFlag)
					clientCode = this.leClient;

				if (this.utilityService.isNullOrEmptyOrUndefined(updatedCode.legalEntityCode)) {
					this.toastService.error("Legal Entity Code is empty");
					return
				}

				//updateBusinessunit
				this.http.post<any>('businessunits?clientCode=' + clientCode + '&apiCode=' + apiCode, updatedCode).
					subscribe(response => {
						if (this.utilityService.isNotNullOrEmptyOrUndefined(response.payload)) {
							this.setConfigPage(3);
						} else if (this.utilityService.isNotNullOrEmptyOrUndefined(response.description)) {
							this.toastService.error(response.description);
						}
					});
			} else if (this.fieldType == 'Client') {
				if (this.utilityService.isNullOrEmptyOrUndefined(updatedCode.clientCode)) {
					this.toastService.error("Client Code is empty");
					return
				}

				//updateClient
				this.http.post<any>('clients?apiCode=' + apiCode, updatedCode).
					subscribe(response => {
						if (this.utilityService.isNotNullOrEmptyOrUndefined(response.payload)) {
							this.setConfigPage(1);
						} else if (this.utilityService.isNotNullOrEmptyOrUndefined(response.description)) {
							this.toastService.error(response.description);
						}
					});
			} else if (this.fieldType == 'SOW') {
				if (!this.createFlag) {
					for (var sow of updatedCode.sowLegalentity) {
						if (this.utilityService.isNotNullOrEmptyOrUndefined(sow.NewIteam)) {
							sow.approval = 9;
						}
					}
				}

				if (this.utilityService.isNullOrEmptyOrUndefined(updatedCode.sowId)) {
					this.toastService.error("SOW Id is empty");
					return
				}

				//updateSow
				this.http.post<any>('sow?apiCode=' + apiCode + '&clientCode=' + this.sowClient, updatedCode).
					subscribe(response => {
						if (this.utilityService.isNotNullOrEmptyOrUndefined(response.payload)) {
							this.setConfigPage(5);
						} else if (this.utilityService.isNotNullOrEmptyOrUndefined(response.description)) {
							this.toastService.error(response.description);
						}
					});
			}

			this.formCode = null;
			this.createFlag = false;
		} else if (outPutFromChild.selectedAction == "back") {
			if (this.fieldType == 'Businessunit') {
				this.getBusinessunitList();
				this.businessunitListPage = true;
				this.businessunitFormPage = false;
			} else if (this.fieldType == 'Client') {
				this.getClientList();
				this.clientFormPage = false;
				this.clientListPage = true;
			} else if (this.fieldType == 'SOW') {
				this.getSowList();
				this.sowFormPage = false;
				this.sowListPage = true;
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
		if (this.fieldType == 'Businessunit') {
			for (var k in this.businessunitList) {
				this.businessunitList[k].actionButtonsList = [];
				this.businessunitList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewFormButton", "View Form", environment.cdnPath + "/Hub/view"));
			}
		} else if (this.fieldType == 'Client') {
			for (var k in this.clientList) {
				this.clientList[k].actionButtonsList = [];
				this.clientList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewFormButton", "View Form", environment.cdnPath + "/Hub/view"));
			}
		} else if (this.fieldType == 'SOW') {
			for (var k in this.sowList) {
				this.sowList[k].actionButtonsList = [];
				this.sowList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewFormButton", "View Form", environment.cdnPath + "/Hub/view"));
			}
		}
	}

	outputFromListView(outPutFromChild) {
		if (outPutFromChild.selectedAction == "viewFormButton") {
			let data = outPutFromChild.listDetails;

			if (this.fieldType == 'Businessunit') {
				this.keyRestrictions['clientCode'] = data.globalClientCode
				this.keyRestrictions['businessunitCode'] = data.legalEntityCode
				this.formCode = "BUF1";

				this.businessunitListPage = false;
				this.businessunitFormPage = true;
			} else if (this.fieldType == 'Client') {
				this.keyRestrictions['clientCode'] = data.clientCode
				this.formCode = "CF1";

				this.clientFormPage = true;
				this.clientListPage = false;
			} else if (this.fieldType == 'SOW') {
				//this.keyRestrictions['clientCode'] = null
				this.keyRestrictions['sowId'] = data.sowId
				if (this.utilityService.isNotNullOrEmptyOrUndefined(data.workOrderNo))
				   this.keyRestrictions['workOrderNo'] = data.workOrderNo
				this.formCode = "SOWF1";

				this.sowFormPage = true;
				this.sowListPage = false;
			}
		} else if (outPutFromChild.selectedAction == "listViewRowSize") {
			this.itemsPerPageToDisplay = outPutFromChild.listDetails;

			if (this.fieldType == 'Businessunit') {
				this.getBusinessunitList();
			} else if (this.fieldType == 'Client') {
				this.getClientList();
			} else if (this.fieldType == 'SOW') {
				this.getSowList();
			}
		} else if (outPutFromChild.selectedAction == "globalSearch") {
			this.searchKey = outPutFromChild.listDetails;
			this.currentPage = 1;
			if (this.fieldType == 'Businessunit') {
				this.getBusinessunitList();
			} else if (this.fieldType == 'Client') {
				this.getClientList();
			} else if (this.fieldType == 'SOW') {
				this.getSowList();
			}
		} else if (outPutFromChild.selectedAction == "paginationClick") {
			this.currentPage = outPutFromChild.listDetails.page;
			this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;

			if(outPutFromChild.buttonClicked == "resetButton")
			   this.searchKey = "";

			if (this.fieldType == 'Businessunit') {
				this.getBusinessunitList();
			} else if (this.fieldType == 'Client') {
				this.getClientList();
			} else if (this.fieldType == 'SOW') {
				this.getSowList();
			}
		} else if (outPutFromChild.selectedAction == "globalSearch") {
			this.searchKey = outPutFromChild.listDetails;

			if (this.fieldType == 'Businessunit') {
				this.getBusinessunitList();
			} else if (this.fieldType == 'Client') {
				this.getClientList();
			} else if (this.fieldType == 'SOW') {
				this.getSowList();
			}
		}
	}
}
