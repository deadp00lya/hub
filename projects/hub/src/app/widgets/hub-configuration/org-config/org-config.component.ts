import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from "@angular/common/http";
import { OrgStructureDTO } from '../../../model/OrgStructureDTO';
import { ToastService } from '../../../services/toast.service';
import { UtilityService } from '../../../services/utility.service';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;

@Component({
    selector: 'app-org-config',
    templateUrl: './org-config.component.html',
    styleUrls: ['./org-config.component.css']
})

export class OrgConfigComponent implements OnInit {
    disabledBit: boolean = false;
    searchKey: string = "";
    nodeStructure: any = { width: 250, height: 50 };
    orgConfig: any = {
    };
    align = [
        { id: 1, name: 'left' },
        { id: 2, name: 'right' },
        { id: 3, name: 'center' }
    ];
    options = [
        { id: 1, name: 'image' },
        { id: 2, name: 'icon' },
        { id: 3, name: 'title' },
        { id: 3, name: 'label' }
    ];
    showOrg: boolean = false;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    itemsPerPageToDisplay: number = 50;
    currentPage: number = 1;
    totalCount: number = 0;
    instanceOfAddOrgModal: any;
    i: any;
    orgStructureDTO: OrgStructureDTO = new OrgStructureDTO();
    orgStructureList: OrgStructureDTO[] = [];
    inputObject: any = {
    };


    instanceOfOrgConfigModal: any;
    showModal: string;
    css: any = { a: {} };
    col: any;
    row: any;
    column: any = { columnCss: {} };
    instanceOfColumnsConfig: any;
    cdnUrl=environment.cdnPath

    constructor(private util: UtilityService, private toast: ToastService, private http: HttpClient) { }

    @ViewChild('columnConfigModal', { static: false }) columnConfigModal: ElementRef;
    @ViewChild('orgConfigModal', { static: false }) orgConfigModal: ElementRef;
    @ViewChild('addOrgModal', { static: false }) addOrgModal: ElementRef;


    ngOnInit() {
        
        this.fetchOrgConigList();

    }

    ngAfterViewInit() {

        if (this.util.isNotNullOrEmptyOrUndefined(this.columnConfigModal))
            this.instanceOfColumnsConfig = new M.Modal(this.columnConfigModal.nativeElement, { dismissible: false })
        if (this.util.isNotNullOrEmptyOrUndefined(this.addOrgModal))
            this.instanceOfAddOrgModal = new M.Modal(this.addOrgModal.nativeElement, { dismissible: false })
        if (this.util.isNotNullOrEmptyOrUndefined(this.orgConfigModal))
            this.instanceOfOrgConfigModal = new M.Modal(this.orgConfigModal.nativeElement, { dismissible: false })
        this.refreshAll();
    }

    fetchOrgConigList() {

        this.orgStructureList = [];
        this.http.get<any>("org-config?searchKey=" + this.searchKey + "&page=" + (this.currentPage - 1) + "&size=" + this.itemsPerPageToDisplay).subscribe(res => {
            this.totalCount = res.count;
            this.orgStructureList = res.list;
            this.actionButtonsDisplay();
        }, error => {
            this.toast.error('Opps something went wrong');
        })
    }
    actionButtonsDisplay() {

        for (var k in this.orgStructureList) {
            this.orgStructureList[k].actionButtonsList = [];
            this.orgStructureList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View",environment.cdnPath+"/Hub/view"));
            this.orgStructureList[k].actionButtonsList.push(this.actionButtonsObjectCreation("editButton", "Edit",environment.cdnPath+"/Hub/edit"));
            if (this.orgStructureList[k].enabled)
                this.orgStructureList[k].actionButtonsList.push(this.actionButtonsObjectCreation("deactivateButton", "De-activate",environment.cdnPath+"/Hub/flash_off"));
            else
                this.orgStructureList[k].actionButtonsList.push(this.actionButtonsObjectCreation("activateButton", "Activate",environment.cdnPath+"/Hub/flash_on"));
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
        
        if (outPutFromChild.selectedAction == "applicationButton")
            this.instanceOfAddOrgModal.open();
        else if (outPutFromChild.selectedAction == "viewButton") {
            this.showOrgConfigView(outPutFromChild.listDetails);
        } else if (outPutFromChild.selectedAction == "editButton") {
            this.editOrgName(outPutFromChild.listDetails);
        } else if (outPutFromChild.selectedAction == "activateButton") {
            this.activeDeactiveOrgConfig(outPutFromChild.listDetails.id, true);
        }
        else if (outPutFromChild.selectedAction == "deactivateButton") {
            this.activeDeactiveOrgConfig(outPutFromChild.listDetails.id, false);
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            this.currentPage = outPutFromChild.listDetails.page;
            this.fetchOrgConigList();
        }
    }
    activeDeactiveOrgConfig(orgCode, enabled) {

        this.http.delete<any>("org-config?id=" + orgCode + "&enabled=" + enabled).subscribe(res => {
            if (enabled)
                this.toast.success("Organization Structure activated");
            else
                this.toast.success("Organization Structure deactivated");
            this.fetchOrgConigList();
        })
    }
    editOrgName(orgStructureDTO) {
        this.orgStructureDTO.enabled = true;
        this.orgStructureDTO = new OrgStructureDTO();
        this.orgStructureDTO = Object.assign(this.orgStructureDTO, orgStructureDTO)
        this.disabledBit = true;
        this.instanceOfAddOrgModal.open();
    }
    backTOListView() {
        this.showOrg = false;
        this.fetchOrgConigList();
        this.orgStructureDTO = new OrgStructureDTO();
        this.refreshFirstNode();
        this.refreshNodeStructure();
        this.fetchOrgConigList();
    }
    showOrgConfigView(orgStructure) {
        this.orgStructureDTO = new OrgStructureDTO();
        this.orgStructureDTO.enabled = true;
        this.disabledBit = false;
        this.orgStructureDTO = Object.assign(this.orgStructureDTO, orgStructure)
        if (this.util.isNotNullOrEmptyOrUndefined(this.orgStructureDTO.firstNode))
            this.orgConfig = JSON.parse(this.orgStructureDTO.firstNode);
        if (this.util.isNotNullOrEmptyOrUndefined(this.orgStructureDTO.nodeStructure))
            this.nodeStructure = JSON.parse(this.orgStructureDTO.nodeStructure);
        this.showOrg = true;
        setTimeout(() => {
            this.refreshAll();
        }, 5);
    }
    saveColumn() {
        
        if (this.showModal == 'Title')
            this.nodeStructure.sections[this.row].columns[this.col].keys[this.i]['titleCss'] = this.css;
        if (this.showModal == 'Label')
            this.nodeStructure.sections[this.row].columns[this.col].labels[this.i]['labelCss'] = this.css;
        if (this.showModal == 'Icon')
            this.nodeStructure.sections[this.row].columns[this.col]['iconCss'] = this.css;
        if (this.showModal == 'Image') {
            this.css['width'] = this.css['height'];
            this.nodeStructure.sections[this.row].columns[this.col]['imgCss'] = this.css;
        }
        if (this.showModal == 'Column')
            this.nodeStructure.sections[this.row].columns[this.col] = this.column;

        if (this.showModal == 'Row') {
            this.nodeStructure.sections[this.row]['rowCss'] = this.css;
        }

        this.closeColumnConfigModal();
        this.css = { a: {} }
        this.row = null;
        this.col = null;
    }
    saveFirstNode() {
        
        if (this.util.isNullOrEmptyOrUndefined(this.orgConfig['titleKey']))
            return this.toast.error('Please enter title key name');
        if (this.util.isNullOrEmptyOrUndefined(this.orgConfig['upperNodeApi']))
            return this.toast.error('Please enter upper node api');
        if (this.util.isNullOrEmptyOrUndefined(this.orgConfig['subordinateNodeApi']))
            return this.toast.error('Please enter subordinate node api');
        if (this.util.isNullOrEmptyOrUndefined(this.orgConfig['startNodeApi']))
            return this.toast.error('Please enter start node api');
        this.orgStructureDTO.firstNode = JSON.stringify(this.orgConfig);
        if (this.util.isNotNullOrEmptyOrUndefined(this.nodeStructure))
            this.orgStructureDTO.nodeStructure = JSON.stringify(this.nodeStructure);
        this.http.post<any>('org-config', this.orgStructureDTO).subscribe(res => {
            this.toast.success('Organization config saved');
        })
    }
    refreshFirstNode() {
        this.orgConfig = {};
        this.orgStructureDTO.firstNode = null
        this.nodeStructure = { width: 250, height: 50 };
    }
    saveNodeStructure() {
        
        if (this.util.isNotNullOrEmptyOrUndefined(this.orgConfig))
            this.orgStructureDTO.firstNode = JSON.stringify(this.orgConfig);
        this.orgStructureDTO.nodeStructure = JSON.stringify(this.nodeStructure);
        this.http.post<any>('org-config', this.orgStructureDTO).subscribe(res => {

            this.toast.success('Node Structure saved');
        })
    }
    refreshNodeStructure() {
        this.nodeStructure = {};
        this.orgStructureDTO.nodeStructure = null;
        this.nodeStructure = { width: 250, height: 50 };
    }
    isRound(event) {
        
        if (event.target.checked)
            this.css.a.round = true;
        else
            this.css.a.round = false;
    }
    isBorder(border, event) {

        if (event.target.checked) {
            this.css[border] = true;
            this.css['border' + border] = 'solid';
        }
        else {
            this.css[border] = false;
            this.css['border' + border] = null;
        }
    }

    addRow() {

        
        if (this.util.isNullOrEmptyOrUndefined(this.nodeStructure.sections)) {
            this.nodeStructure.sections = [];
        }
        var i = this.nodeStructure.sections.length;
        this.nodeStructure.sections[i] = { id: i }


    }
    saveOrg() {
        debugger
        if (this.util.isNullOrEmptyOrUndefined(this.orgStructureDTO.orgStructureName))
            return this.toast.error("Please enter org structure name");
        if (this.util.isNullOrEmptyOrUndefined(this.orgStructureDTO.orgStructureCode))
            return this.toast.success("Please enter org structure code");
        if (!this.disabledBit) {
            this.http.post<any>('org-config', this.orgStructureDTO).subscribe(res => { this.toast.success('Organization Config Created'); });

        } else {
            this.http.post<any>('org-config', this.orgStructureDTO).subscribe(res => { this.toast.success('Organization Config Updated'); });

        }
        this.instanceOfAddOrgModal.close();
        this.fetchOrgConigList();
        setTimeout(() => {
            this.refreshOrg();
        }, 5);
    }
    openColumnConfigModal(i, j, k, column, modalName) {
        
        this.column = column;
        this.showModal = modalName;
        if (this.showModal == 'Title' && column.keys[k]['titleCss'] != undefined)
            this.css = column.keys[k]['titleCss']
        if (this.showModal == 'Label' && column.labels[k]['labelCss'] != undefined)
            this.css = column.labels[k]['labelCss']
        if (this.showModal == 'Icon' && column['iconCss'] != undefined)
            this.css = column['iconCss'];
        if (this.showModal == 'Img' && column['imgCss'] != undefined)
            this.css = column['imgCss'];
        if (this.showModal == 'Row' && column['rowCss'] != undefined) {

            this.css = column['rowCss'];
        }
        this.selectRefresh();
        this.instanceOfColumnsConfig.open();
        this.row = i;
        this.col = j;
        this.i = k;
    }
    closeColumnConfigModal() {
        this.css = { a: {} }
        this.column = {};
        this.instanceOfColumnsConfig.close();
    }
    removeRow(i) {
        this.nodeStructure.sections.splice(i, 1);
    } removeColumn(i, j) {
        this.nodeStructure.sections[i].columns.splice(j, 1);
    } addColumn(i) {

        if (this.nodeStructure.sections[i].columns == undefined) {
            this.nodeStructure.sections[i].columns = [];
        }
        var j = this.nodeStructure.sections[i].columns.length;
        this.nodeStructure.sections[i].columns.push({ id: j });
    }

    selectTag(value) {
        
        if (this.column.option == 'image' || this.column.option == 'title' || this.column.option == 'icon') {
            this.column['keys'] = [];
            this.column['keys'][0] = { name: '' };
        }
        if (this.column.option == 'label') {
            this.column['labels'] = [];
            this.column['labels'][0] = { name: '' };
        }
    }
    addKey(i) {
        this.column.keys[i + 1] = { key: '' }
    }
    removeKey(i) {
        this.column.keys.splice(i, 1)
    }
    addLabel(i) {
        this.column.labels[i + 1] = { key: '' }
    }
    removeLabel(i) {
        this.column.labels.splice(i, 1)
    }
    openOrgConfigModal() {
        this.instanceOfOrgConfigModal.open();
    }
    closeOrgConfigModal() {
        this.instanceOfOrgConfigModal.close();
    }

    showOrgConfig(btnId: string) {
        
        this.showOrg = false;
        $('.modal').modal();
    }
    showOrgChart(btnId: string) {
        
        this.showOrg = true;
        this.actionButtonCss(btnId);
    }
    actionButtonCss(id: string) {
        $('.assetButton').removeClass("blue");
        $('.assetButton').removeClass("white-text");
        $(id).addClass("blue");
        $(id).addClass("white-text");
    }
    closeOrgModal() {
        this.orgStructureDTO = new OrgStructureDTO();
        this.instanceOfAddOrgModal.close();
    }
    refreshOrg() {
        this.orgStructureDTO = new OrgStructureDTO();
        this.disabledBit = false;
    }
    selectRefresh() {
        setTimeout(() => {
            $('select').formSelect();
        }, 0);
    }
    refreshAll() {
        $('select').formSelect();
        $('.collapsible').collapsible();
        $('.modal').modal();
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems, Option);
    }

    refreshConfig() {
        this.css = {};
        this.column = {};
        this.selectRefresh();
    }

}
