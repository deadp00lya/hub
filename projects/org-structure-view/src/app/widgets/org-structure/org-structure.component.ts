import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ToastService, WidgetService, UtilityService } from '@nw-workspace/common-services';
import { OrgStructureDTO } from 'projects/hub/src/app/model/OrgStructureDTO';
import * as CryptoJS from 'crypto-js';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'projects/org-structure-view/src/environments/environment.prod';

declare var $: any;

@Component({
    selector: 'org-structure',
    templateUrl: './org-structure.component.html',
    styleUrls: ['./org-structure.component.css'],

})

export class OrgStructureComponent implements OnInit {
    employeeList$: Observable<any[]>;
    peopleLoading = false;
    peopleInput$ = new Subject<string>();
    selectedPersons: any;
    map: any = {};
    keyValues: string = null;
    searchKey: string = null;
    searchObjectList: any[] = [];
    rootObject: any[] = [];
    childObject: any[] = [];
    widgetWidth: number = 12;
    expanIconValue: any;
    con: boolean = true;
    loader: boolean = false;
    backupChildObject: any = {};
    startNodeIndex: number;
    showOrg: boolean = false;
    orgStructureDTO: OrgStructureDTO = new OrgStructureDTO();
    inputObject: any;
    orgConfig: any;
    nodeConfig: {
        width: 250,
        height: 50
    }
    showDownArrow: boolean = false;
    nodeLevel: number;
    listLevel: number;
    nodeLimit: number;
    upperNodeLevel: number;
    nodeLevelMap: {};
    temp: any;
    backupOrgConfig: any = {};
    currentNode: string;
    upperNode: boolean = true;
    firstNode: any;
    backupObject: any = null;
    @Input("orgCode") orgCode: string;
    @Input("startNode") startNode: string;
    @Output() outputFromORGComponent = new EventEmitter();
    rootNode: string;
    scale: number = 1;
    description: string;
    showProfile: boolean = false;
    startIndex: number = 0;
    showMoreEmployee: boolean = true;
    showLessEmployee: boolean = false;
    outPutFromChild = {};
    showChildDivider: boolean = false;
    employeeBox: any;
    childBlackArrow: boolean = true;
    childblueArrow: boolean = false;
    parentBlackArrow: boolean = true;
    employeeBoxHeight: any;
    parentemployeeBoxHeight: any;
    parentblueArrow: boolean = false;
    normalLeftArrowBoolean: boolean;
    normalUpArrowBoolean: boolean = false;
    normalUpperArrowBoolean: boolean;
    hoverCardBoolean: boolean;
    hoverChildBoolean: boolean;
    selectedId: any;
    orgHoverId: any;
    parentNode: any;
    cdnUrl = environment.cdnPath;
    orgHoverCardId: any;
    childBool: boolean=true;
    imgLog: number;
    uniqueImgId: number=123;
    primaryBoolean: boolean=true;
    constructor(private widgetService: WidgetService, private util: UtilityService, private toast: ToastService, private http: HttpClient) {
    }

    ngOnInit() {
        this.fetchOrgStructureConfig();
        this.fetchEmployee();
        //this.startNode="et1016";
    }
    ngAfterViewInit(): void {
    }

    search() {
        this.searchKey = this.searchKey.toUpperCase();
        if (this.util.isNullOrEmptyOrUndefined(this.searchKey)) {
            this.fetchOrgStructureConfig();
        } else {
            this.rootObject = [];
            this.childObject = [];
            this.showChildDivider = false;
            this.loader = true;
            this.fetchEmployeeDetails(this.searchKey).subscribe(res => {
                if (this.util.isNotNullOrEmptyOrUndefined(res.payload.list[0])) {
                    this.employeeBoxHeight = this.searchKey;
                    this.rootObject = [];
                    this.rootObject[0] = res.payload.list[0];
                    this.fetchStartNode(this.searchKey);
                    this.loader = false;

                } else {
                    this.loader = false;
                }

            }, error => {
                this.loader = false;
            });

        }
    }

    fetchHierarchy() {

        this.fetchUpperNodes(this.keyValues).subscribe(res => {
            var obj = res.payload.list[0];

            this.keyValues = obj[this.orgConfig.titleKey];
            var con: boolean = true;
            var index = null;
            var i = 0;
            this.rootObject.forEach(xkey => {
                if (xkey[this.orgConfig.titleKey].toUpperCase() == this.keyValues) {
                    index = i;
                    con = false;
                    return false;
                }
                i++;
            });

            if (con) {
                this.searchObjectList.unshift(obj);
                this.fetchHierarchy();
            } else {
                for (var obj of this.searchObjectList) {
                    
                    if (this.util.isNotNullOrEmptyOrUndefined(index)) {
                        var inx = index + 1;
                        var count = this.rootObject.length - index;
                        this.rootObject.splice(inx, count);
                    }
                    index = null;
                    this.rootObject.push(obj);

                }
                this.fetchChildNodes(this.searchKey);
                this.searchObjectList = [];
            }
        }, error => {
            this.loader = false;
        });

    }

    closeOrg() {
        
        this.outPutFromChild = {
            selectedAction: 'close',
            selectedNode: null
        }

        this.outputFromORGComponent.emit(this.outPutFromChild);
    }
    rootdempDet(item, root, i) {
        debugger
        if (this.orgConfig.showColleague) {
            if (this.util.isNullOrEmptyOrUndefined(this.backupChildObject[item[this.orgConfig.titleKey]])) {
                this.fetchChildNodes(item[this.orgConfig.titleKey]);
            } else {
                this.childObject = this.backupChildObject[item[this.orgConfig.titleKey]];
                this.showChildDivider = true;
            }
            var count = (this.rootObject.length - 1) - i;
            this.rootObject.splice(i + 1, count);
        }
        this.expandCard(item);
    }
    expandCard(item) {
        
        if (!item[this.orgConfig.titleKey] == this.employeeBoxHeight) {

            this.childBlackArrow = false;
            this.childblueArrow = true;
            this.employeeBoxHeight = item[this.orgConfig.titleKey];
            // $(".org_empBox").css("margin-bottom", "60px");
        }
    }
    childempDet(item, root) {
        
        this.rootdempDet(item, root, this.rootObject.length);
        if (this.util.isNotNullOrEmptyOrUndefined(item.hasChild) && item.hasChild) {
            this.rootObject.push(item);

            this.childObject = [];
            this.fetchChildNodes(item[this.orgConfig.titleKey]);
        }
    }
    changeColorEnter(id) {
        this.employeeBox = id;
        this.orgHoverId = id;
    }
    changeColorLeavel(id) {
        this.employeeBox = "";
        this.orgHoverId = "";
    }
    hoverCardAppears(id) {
        this.orgHoverCardId = id;
    }
    hoverCardLeaves(id) {
        this.orgHoverCardId = "";
    }
    hoverChildCardAppears(id) {
        this.orgHoverCardId = id;
        debugger
        if(this.primaryBoolean==true){
            $("#org_employeeTasksAnimate").css("overflow-y", "auto");
        }
    }
    hoverChildCardLeaves(id) {
        this.orgHoverCardId = "";
        debugger
        if(this.primaryBoolean==true){
        $("#org_employeeTasksAnimate").css("overflow-y", "hidden");
        $( "#org_employeeTasksAnimate" ).scrollTop( 0 );
        }
    }
    showMoreEmployeeDetails() {
    debugger
        if (this.showMoreEmployee) { 
            this.primaryBoolean=false;
            $("#org_employeeTasksAnimate").css("height", "500px");
            $("#org_employeeTasksAnimate").css("overflow-y", "auto");
            $("#down_arrowImg").css("transform", "none");
            
            this.showMoreEmployee = false;
            this.showLessEmployee = true;
        } 
        else {   
            this.showMoreEmployee = true;
            this.showLessEmployee = false;
            this.primaryBoolean=true;
            $("#org_employeeTasksAnimate").css("height", "unset");
            $("#org_employeeTasksAnimate").css("overflow-y", "hidden");
            $("#down_arrowImg").css("transform", "rotate(180deg)");
            $( "#org_employeeTasksAnimate" ).scrollTop( 0 ); 
        }

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

    fetchOrgStructureConfig() {
        
        this.loader = true;
        //fetchOrgStructureByCode
        this.http.get<any>('org-structure?orgStructureCode=' + this.orgCode).subscribe(res => {
            if (this.util.isNotNullOrEmptyOrUndefined(res)) {
                this.orgStructureDTO = res;
                this.orgConfig = JSON.parse(this.orgStructureDTO.firstNode);
                this.orgConfig.nodeStructure = JSON.parse(this.orgStructureDTO.nodeStructure);
                if (this.util.isNotNullOrEmptyOrUndefined(this.orgConfig.startNode))
                    this.startNode = this.orgConfig.startNode;
                else
                    this.orgConfig['startNode'] = this.startNode;
                if (this.util.isNullOrEmptyOrUndefined(this.orgConfig['upperNodeLevel'])) {
                    this.orgConfig['upperNodeLevel'] = null;
                    this.orgConfig['upperNodeLevel'] = 0;
                }
                if (this.util.isNullOrEmptyOrUndefined(this.orgConfig['nodeLimit'])) {
                    this.orgConfig['nodeLimit'] = null;
                    this.orgConfig['nodeLimit'] = 0;
                }
                this.employeeBoxHeight = this.startNode;
                this.childblueArrow = true;
                this.fetchStartNode(this.startNode);

            }
        })
    }

    fetchStartNode(startNode) {
        
        this.setMap(this.orgConfig.startNodeApi, this.orgConfig.titleKey, startNode, false);
        //fetchNodeObject
        this.http.post<any>('org-structure', this.map).subscribe(res => {
            if (this.util.isNotNullOrEmptyOrUndefined(res) && this.util.isNotNullOrEmptyOrUndefined(res.payload) && this.util.isNotNullOrEmptyOrUndefined(res.payload.list)) {
                this.startNodeIndex = 0;
                this.rootObject = [];
                this.rootObject[0] = res.payload.list[0];

                if (this.util.isNotNullOrEmptyOrUndefined(this.rootObject)) {
                    if (this.util.isNotNullOrEmptyOrUndefined(this.orgConfig.upperNodeLevel) && this.orgConfig.upperNodeLevel > 0) {
                        this.setMap(this.orgConfig.upperNodeApi, this.orgConfig.titleKey, this.rootObject[0][this.orgConfig.titleKey], false);
                        //fetchNodeObject
                        this.http.post<any>("org-structure", this.map).subscribe(res2 => {
                            
                            if (this.util.isNotNullOrEmptyOrUndefined(res2.payload.list[0])) {
                                this.startNodeIndex = this.startNodeIndex + 1;
                                res2.payload.list[0]["hasChild"] = null;
                                res2.payload.list[0]["hasChild"] = true;
                                this.rootObject.unshift(res2.payload.list[0]);
                                this.parentNode = res2.payload.list[0][this.orgConfig.titleKey];
                            }
                        })
                    }
                    if (this.util.isNotNullOrEmptyOrUndefined(this.orgConfig.nodeLimit) && this.orgConfig.nodeLimit > 0) {
                        this.fetchChildNodes(this.rootObject[this.rootObject.length - 1][this.orgConfig.titleKey]);
                    }
                }
                this.loader = false;
            }
        })
    }
    fetchChildNodes(parentValue) {

        this.loader = true;
        this.childObject = []
        this.setMap(this.orgConfig.subordinateNodeApi, this.orgConfig.titleKey, parentValue, false);
        //fetchNodeObject
        this.http.post<any>("hub/org-structure", this.map).subscribe(res => {
            debugger     
            if (this.util.isNotNullOrEmptyOrUndefined(res) && this.util.isNotNullOrEmptyOrUndefined(res.payload) && this.util.isNotNullOrEmptyOrUndefined(res.payload.list)) {
                if (parentValue.toUpperCase == this.startNode.toUpperCase) {
                    
                         for (var i = 0; i < this.rootObject.length; i++) { 
                        if (parentValue == this.rootObject[i][this.orgConfig.titleKey]) {
                            this.rootObject[i]["hasChild"] = null;
                            this.rootObject[i]["hasChild"] = true;
                        }
                    }
                }
                this.childObject = res.payload.list;
                this.showChildDivider = true;
                this.backupChildObject[parentValue] = [];
                this.backupChildObject[parentValue] = this.childObject;
                for (var i = 0; i < this.childObject.length; i++) {
                    this.hasChild(this.childObject[i][this.orgConfig.titleKey], i);
                }
            } else {

                this.showChildDivider = false;
                this.childObject = [];
                this.backupChildObject[parentValue] = [];
                this.loader = false;
                this.showMoreEmployee = true;
                this.showLessEmployee = false;
                if (parentValue.toUpperCase == this.startNode.toUpperCase) {
                    for (var i = 0; i < this.rootObject.length; i++) {
                        if (parentValue == this.rootObject[i][this.orgConfig.titleKey]) {
                            this.rootObject[i]["hasChild"] = null;
                            this.rootObject[i]["hasChild"] = false;
                        }
                    }
                }
                $("#org_employeeTasksAnimate").css("height", "unset");
                $("#org_employeeTasksAnimate").css("overflow-y", "hidden");
            }

            this.loader = false;
        }, error => {
            this.loader = false;
        });
    }
    fetchEmployeeDetails(keyValue) {
        this.setMap(this.orgConfig.startNodeApi, this.orgConfig.titleKey, keyValue, false);
        //fetchNodeObject
        return this.http.post<any>("hub/org-structure", this.map);
    }

    fetchUpperNodes(keyValue: string): Observable<any> {
        this.setMap(this.orgConfig.upperNodeApi, this.orgConfig.titleKey, keyValue, false);
        //fetchNodeObject
        return this.http.post<any>("hub/org-structure", this.map)

    }
    expandRootNode = () => {
        debugger
        if (!this.showDownArrow && this.rootObject.length < this.orgConfig.upperNodeLevel + 1) {

            this.loader = true;
            this.setMap(this.orgConfig.upperNodeApi, this.orgConfig.titleKey, this.rootObject[0][this.orgConfig.titleKey], false);

            //fetchNodeObject
            this.http.post<any>("hub/org-structure", this.map).subscribe(res => {

                if (this.util.isNotNullOrEmptyOrUndefined(res) && this.util.isNotNullOrEmptyOrUndefined(res.payload) && this.util.isNotNullOrEmptyOrUndefined(res.payload.list)) {
                    if (res.payload.list[0][this.orgConfig.titleKey] != this.rootObject[0][this.orgConfig.titleKey]) {
                        res.payload.list[0]["hasChild"] = null;
                        res.payload.list[0]["hasChild"] = true;
                        this.rootObject.unshift(res.payload.list[0]);
                        this.startNodeIndex = this.startNodeIndex + 1;
                       }   else {
                            this.showDownArrow = true;
                        }
                } else {
                    this.showDownArrow = true;
                }
                this.loader = false;

            }, error => {
                this.loader = false;
            });
        } else {

            this.rootObject.splice(0, this.startNodeIndex - 1);
            this.showDownArrow = false;
        }
    }
    onSelectEmployee() {
        
        this.searchKey = this.selectedPersons;
        if (this.util.isNotNullOrEmptyOrUndefined(this.searchKey))
            this.search();
        else
            this.fetchOrgStructureConfig();
    }
    hasChild(keyValue, i) {
        if (this.util.isNullOrEmptyOrUndefined(this.childObject[i]["hasChild"])) {
            this.childObject[i]["hasChild"] = null;
            this.childObject[i]["hasChild"] = false;
            this.setMap(this.orgConfig.subordinateNodeApi, this.orgConfig.titleKey, keyValue, true);

            //fetchNodeObject
            this.http.post<any>("hub/org-structure", this.map).subscribe(res => {
                if (this.util.isNotNullOrEmptyOrUndefined(res.payload.list)) {
                    this.childObject[i]["hasChild"] = true;

                }
            }, error => {

            });
        }

    }
    setEmployee() {

    }

    normalLeftArrow() {
        this.normalLeftArrowBoolean = true
    }
    bgLeftArrow() {
        this.normalLeftArrowBoolean = false
    }
    normalUpArrow() {
        this.imgLog = this.uniqueImgId;
    }
    bgUpArrow() {
        this.imgLog = -1;
    }
    normalUpperArrow() {
        this.normalUpperArrowBoolean = true
    }
    bgUpperArrow() {
        this.normalUpperArrowBoolean = false
    }

    fetchEmployee() {
        //searchOrgEmployee
        this.employeeList$ = concat(
            of([]), // default items
            this.peopleInput$.pipe(
                distinctUntilChanged(),
                tap(() => this.peopleLoading = true),
                switchMap(term =>
                    this.http.get<any>('org-structure/' + term + '?apiCode=' + this.orgConfig.startNodeApi).pipe(map(res => res.payload.list)
                        , catchError(() => of([])), // empty list on error
                        tap(() => this.peopleLoading = false)
                    ))
            )
        );
    }

    encrypt(key: string): string {
        
        var secret = "aesEncryptionKey";
        var encrypted = CryptoJS.AES.encrypt(key, secret);
        encrypted = encrypted.toString();
        return encrypted;
    }

    setMap(apiCode, key, restriction, isCount) {
        this.map = {
            "apiCode": apiCode,
            "key": key,
            "isCount": isCount,
            "restriction":this.encrypt(restriction)       }
        var temp = JSON.stringify(this.map);
    }
}

