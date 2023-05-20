import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import * as M from "materialize-css/dist/js/materialize";
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { HttpClient } from '@angular/common/http';
import { WidgetService } from '@nw-workspace/common-services';
import { GroupDTO } from 'projects/hub/src/app/model/GroupDTO';
import { GroupParticipantsDTO } from 'projects/hub/src/app/model/GroupParticipantsDTO';
import { EmployeeService } from 'projects/hub/src/app/services/employee.service';
import { SessionService } from '@nw-workspace/common-services';
import { ToastService } from '@nw-workspace/common-services';
import { UtilityService } from '@nw-workspace/common-services';
import { environment } from 'projects/hub/src/environments/environment.prod';

declare var $: any;
declare var require: any;

@Component({
    selector: 'app-hub-group',
    templateUrl: './hub-group.component.html',
    styleUrls: ['./hub-group.component.css']
})

export class HubGroupComponent implements OnInit {
    suggestions: any = [];
    modalInstance: any;
    actionButtonsObject: { buttonName: any; buttonTitle: any; iconName: any; };
    itemsPerPageToDisplay: number = 50;
    modalInstance1: any;
    employeeInfo: any = [];
    groupName: string;
    widgetWidth: number;
    group: GroupDTO = new GroupDTO();
    serchgroupKey: string = "";
    currentPage: number = 0;
    itemPerPage: number = 50;
    groupList: any;
    group1: any;
    pageSizeOptions: any = [10, 20, 30];
    groupmember: GroupParticipantsDTO[] = [];
    groupParticipant: GroupParticipantsDTO = new GroupParticipantsDTO();
    groupMemberEmployeeIds: string = "";
    employeeList: any = [];
    protected searchStr: string;
    dataService: CompleterData;
    employeeId: string;
    gid: number;
    flag: boolean = false;
    count: number;
    addParticipant: boolean = false;
    employeeIdName: GroupParticipantsDTO[] = [];
    currentClient = this.sessionService.getCurrentUser().additionalDetails.mdm.clientCode;
    searchparticipantKey: string = "";
    employeeIds: string[] = [];
    loader: boolean = false;
    cdnUrl=environment.cdnPath;
    cloneEventList: any;
    configCode: any;
    groupSpocArray: any = [];
    newConfigObject: {};
    uploadFile: any;
    viewNeoConfig: boolean = false;
    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService, private completerService: CompleterService, private sessionService: SessionService, private employeeService: EmployeeService, private utilityService: UtilityService) {


    }

    ngOnInit() {
        this.fetchGroup();
        this.fetchEmployeeList();
        //this.getCurrentWidgetCodeAppCode();
    }


    ngAfterViewInit() {

        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, {});


        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("groupView"), element => {
            this.onResizedEvent(element);
        });


    }
    reset() {
        this.group = new GroupDTO();
        this.groupParticipant = new GroupParticipantsDTO();
        this.selectRefresh();
    }


    setPageSize(size) {

        this.currentPage = 1;
        var fetchData = false;
        if (this.itemPerPage < size)
            fetchData = true;
        this.itemPerPage = size;
        if (fetchData) {
            this.fetchGroup();
        }
        else {
            this.groupList = this.groupList.slice(0, size);
        }
        setTimeout(() => {
            M.AutoInit();
        }, 0);
    }

    openDropdown() {

        let dropDownEle: Element = document.getElementById("dropdownBtn1")
        var instance = M.Dropdown.init(dropDownEle, { coverTrigger: false, closeOnClick: true });
        instance.open();
    }



    selectRefresh() {
        setTimeout(function () {
            $('select').formSelect();
            M.updateTextFields();
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



    saveGroup() {

        if (this.group.groupName == null || this.group.groupName == undefined || this.group.groupName.trim() == "") {
            this.toastService.error("Enter group name");
        } else if (this.group.groupCode == null || this.group.groupCode == undefined || this.group.groupCode.trim() == "") {
            this.toastService.error("Enter group code");
        } else {
            this.group.id = null;
            this.group.status = "save";
            this.groupSpocArray.push(this.group)
            //saveGroup
            this.http.post<any>("group", this.groupSpocArray).subscribe(data => {

                this.fetchGroup();
                this.closeModal();
            })
        }
    }

    fetchGroup() {

        //fetchGroupList
        this.http.get<any>("group?serchgroupKey=" + this.serchgroupKey + "&Page=" + (this.currentPage + 1) + "&size=" + this.itemPerPage).subscribe(data => {

            this.groupList = data.payload;
            this.count = this.groupList.length;
            this.actionButtonsDisplay();
            this.selectRefresh();

        })
    }


    listgroupUpdate(group) {

        this.group = group;
        var elems = document.getElementById('group');
        var instance = M.Modal.init(elems, {});

        this.selectRefresh();
        instance.open();
    }


    add(event, groupParticipant) {
        

        if (this.utilityService.isNotNullOrEmptyOrUndefined(event)) {
            groupParticipant.employeeId = event;
            groupParticipant.groupId = Object.assign(this.group, this.group1)

            if (groupParticipant.employeeId != undefined) {
                let flag = false;
                this.groupmember.forEach(emp => {
                    if (emp.employeeId == groupParticipant.employeeId)
                        flag = true;
                })
                if (!flag) {
                    //saveParticipant
                    this.http.post<any>("participants", groupParticipant).subscribe(data => {

                        var employeeName = data.payload.employeeId;
                        this.fetchParticipant(this.group1);
                        this.reset();
                        this.selectRefresh();
                    })
                } else
                    this.toastService.error("Already Exists");

            } else {
                this.toastService.error("EmployeeId is empty");
            }
        }
    }



    fetchEmployeeList() {
        //fetchEmployeeNameList
        this.http.get<any>("group/employees").subscribe(empData => {

            this.employeeList = empData.payload.payload.list;
            this.dataService = this.completerService.local(this.employeeList, 'employeeId,preferredName', "employeeId,preferredName");

        })


    }


    fetchEmployeeName() {
        
        if (this.utilityService.isNullOrEmptyOrUndefined(this.employeeIds)) {
            this.employeeService.getEmployee(this.employeeIds).subscribe(data => {
                this.employeeInfo = data;
            })
        }

    }

    fetchParticipant(group) {
        
        this.loader = true;
        this.group1 = group;

        this.searchparticipantKey = "";
        let groupId = group.id;
        this.employeeIds = [];
        //fetchParticipant
        this.http.get<any>("participants?groupId=" + groupId).subscribe(data => {
            this.groupmember = data.payload;

            if (this.utilityService.isNullOrEmptyOrUndefined(this.groupmember)) {
                this.groupName = group.groupName;
            }

            this.gid;


            for (var i = 0; i < this.groupmember.length; i++) {
                this.employeeIds.push(this.groupmember[i].employeeId);


                this.gid = data.payload[i].groupId;
                this.groupName = data.payload[i].groupId.groupName;

            }
            this.fetchEmployeeName();
            this.selectRefresh();
            this.loader = false;

        }, err => {
            this.loader = false;

        });
        var elemodal = document.getElementById('viewParticipant');
        this.modalInstance1 = M.Modal.init(elemodal, {});

        this.modalInstance1.open();

    }

    removeParticipant(employeeId) {

        let groupId;
        groupId = this.group1.id;

        var str = employeeId.split(" ")[0]

        //updateParticipant
        this.http.delete<any>("participants?employeeId=" + str + "&groupId=" + groupId).subscribe(data => {

            this.fetchParticipant(this.group1);
            this.selectRefresh();
        })
    }


    closeModal() {

        var elemodal = document.getElementById('group');
        this.modalInstance = M.Modal.init(elemodal, {});

        this.modalInstance.close();
        this.reset();
        this.selectRefresh();
    }

    closeviewParticipantModal() {
        this.groupName = null;
        this.addParticipant = false;
        var elemodal = document.getElementById('viewParticipant');
        this.modalInstance1 = M.Modal.init(elemodal, {});

        this.modalInstance1.close();
        this.reset();
    }

    openModal() {
        var elemodal = document.getElementById('group');
        this.modalInstance = M.Modal.init(elemodal, {});
        this.modalInstance.open();
    }

    actionButtonsObjectCreation(buttonName, buttonTitle, iconName) {
        return this.actionButtonsObject = {
            buttonName: buttonName,
            buttonTitle: buttonTitle,
            iconName: iconName
        }
    }

    actionButtonsDisplay() {
        for (var k in this.groupList) {
            this.groupList[k].actionButtonsList = [];
            this.groupList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewButton", "View", environment.cdnPath + "/Hub/view"));
            this.groupList[k].actionButtonsList.push(this.actionButtonsObjectCreation("GroupParticipant", "GroupParticipant", environment.cdnPath + "/Hub/group"));
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.groupList[k].neoConfigCode)) {
                this.groupList[k].actionButtonsList.push(this.actionButtonsObjectCreation("viewNeoConfig", "Neo Configuration", environment.cdnPath + "/Hub/icons-info"));
            }
        }
    }



    customSearchFn(term: string, item: any) {

        term = term.toUpperCase();

        const list = Object.values<string>(item).filter(word => {
            if (typeof (word) == "string") {
                if (word.toUpperCase() != null && word != undefined && word.toUpperCase().match(term) != null) {
                    return item;
                }
            }
        });

        return (list.length != 0);
    }

//method not used
    getAutoComplete(event: any) {

        var url = "group/employee?searchKey=" + event.term;

        this.http.get(url).subscribe(res => {
            this.suggestions = res;
        }, err => {
        });

    }

    resolvePattern(data) {
        var patt = "{employeeGlobalId}-{preferredName}";
        let result = patt.replace(/\{\S+?\}/g, function (str, offset, input) {
            var key = str.replace('{', '');
            key = key.replace('}', '');
            if (data[key] == null || data[key] == undefined) {
                var empty = "";
                return empty;
            }
            else {
                return data[key];
            }
        });
        return result;
    }

    outputFromListView(outPutFromChild) {

        if (outPutFromChild.selectedAction == "viewButton") {
            var group = outPutFromChild.listDetails;
            this.listgroupUpdate(group);
            this.fetchGroup();
        } else if (outPutFromChild.selectedAction == "GroupParticipant") {
            var group = outPutFromChild.listDetails;
            this.fetchParticipant(group);
        } else if (outPutFromChild.listDetails == "add") {
            this.openModal();
        } else if (outPutFromChild.selectedAction == "globalSearch") {
            this.serchgroupKey = outPutFromChild.listDetails;
            this.fetchGroup();
        } else if (outPutFromChild.selectedAction == "paginationClick") {
            if (this.utilityService.isNotNullOrEmptyOrUndefined(this.serchgroupKey)) {
                this.serchgroupKey = outPutFromChild.textToSearch;
            }
            this.currentPage = outPutFromChild.listDetails.page;
            this.itemsPerPageToDisplay = outPutFromChild.listDetails.size;
            this.fetchGroup();
        } else if (outPutFromChild.selectedAction == "rowBasedCheckBoxSelection") {
            this.cloneEventList = outPutFromChild.listDetails;
        } else if (outPutFromChild.selectedAction == "viewNeoConfig") {
            this.configCode = outPutFromChild.listDetails.neoConfigCode;
            this.openNeoConfigModal(this.configCode);
        } else if (outPutFromChild.listDetails == "cloud_download") {
            var res = this.cloneEventList
            this.generateUrl(res)
        } else if (outPutFromChild.listDetails == "cloud_upload") {
            this.openUploadModal();
        }
    }

    /******************************Cloning Configuration starts*********************************** */
    /*  getCurrentWidgetCodeAppCode() {
 
         return this.http.get<any>("neosuite/api/getMyAllWidgets")
             .subscribe(res => {
                 var widgetList = [];
                 widgetList = res.payload;
                 let currentWidgetInfo = widgetList.filter(widget => widget.widgetPath === 'HubGroupComponent');
                 this.currentAppCode = currentWidgetInfo[0].application.appCode;
                 this.widgetCode = currentWidgetInfo[0].widgetCode;
 
             })
 
     } */

    openNeoConfigModal(configCode) {
        this.viewNeoConfig = true; 
    }

    triggered($event){
        this.viewNeoConfig = $event;
    }

    /***Cloning download  */
    generateUrl(res) {

        if (this.utilityService.isNullOrEmptyOrUndefined(res)) {
            this.toastService.error("Please Select Records")
        }
        else {
            for (let log of res) {
                log.id = null;
                log.status = "save";
                this.groupSpocArray.push(log);
            }
            var array = JSON.stringify(this.groupSpocArray)
            this.dyanmicDownloadByHtmlTag({
                fileName: 'GroupSpocReport.json',
                text: array
            });

        }
    }

    private setting = {
        element: {
            dynamicDownload: null as HTMLElement
        }
    }

    private dyanmicDownloadByHtmlTag(arg: {
        fileName: string,
        text: any
    }) {
        if (!this.setting.element.dynamicDownload) {
            this.setting.element.dynamicDownload = document.createElement('a');
        }
        const element = this.setting.element.dynamicDownload;
        element.setAttribute('href', `data:${'text/plain'};charset=utf-8,${encodeURIComponent(arg.text)}`);
        element.setAttribute('download', arg.fileName);
        var event = new MouseEvent("click");
        element.dispatchEvent(event);
    }

    openUploadModal() {

        var elem = document.getElementById("uploadModal");
        var instance = M.Modal.init(elem, {});
        instance.open();
    }

    closeUploadModal() {
        var elemodal = document.getElementById('uploadModal');
        var instance = M.Modal.init(elemodal, {});
        instance.close();
        this.groupSpocArray = [];
        $(".file-upload").val("");
    }

    onUpload() {

        if (this.utilityService.isNotNullOrEmptyOrUndefined(this.uploadFile)) {
            try {
                this.groupSpocArray = JSON.parse(this.uploadFile);

                if (this.utilityService.isNotNullOrEmptyOrUndefined(this.groupSpocArray)) {
                    this.http.post<any>("saveGroup", this.groupSpocArray).subscribe(data => {

                        this.closeUploadModal();
                        $(".file-upload").val("");
                        this.fetchGroup();
                        this.groupSpocArray = [];
                        this.uploadFile = null;
                    }, err => {
                        $(".file-upload").val("");
                        this.groupSpocArray = [];
                        this.uploadFile = null;
                        this.closeUploadModal();
                    });
                }
            }
            catch {
                this.toastService.error("No JSON File Found");
                $(".file-upload").val("");
            }
        }
        else {
            this.toastService.error("Choose File")
        }


    }


    fileChanged(event: any) {

        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
            this.uploadFile = reader.result;
        }
    }

}
