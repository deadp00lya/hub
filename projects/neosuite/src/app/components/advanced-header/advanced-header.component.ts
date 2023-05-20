import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LazyModuleLoaderService, SessionService, ToastService, UtilityService, WidgetService } from "@nw-workspace/common-services";
import { OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import * as M from "materialize-css/dist/js/materialize";
import { CompleterService, RemoteData } from "ng2-completer";
import { ApplicationDTO } from "../../models/ApplicationDTO";
import { NotificationDTO } from "../../models/NotificationDTO";
import { ProxySettingDTO } from "../../models/ProxySettingDTO";
import { UserDTO } from "../../models/userDTO";
import { WidgetDTO } from "../../models/WidgetDTO";
import { AuthService } from "../../services/auth.service";
import { CurrentBrowserService } from "../../services/current-browser.service";
import { ImpersonateService } from "../../services/impersonate.service";
import { NotifyService } from "../../services/notify.service";
import { ProfileImageLoaderService } from "../../services/profile-image-loader.service";
import { Subscription, interval } from "rxjs";
import { AnnouncementDTO } from "../../models/AnnouncementDTO";
declare var $: any;
@Component({
    selector: 'app-advanced-header',
    templateUrl: './advanced-header.component.html',
    styleUrls: ['./advanced-header.component.css']
})
export class AdvancedHeaderComponent implements OnInit, AfterViewInit {
    height: number;
    trayDown: boolean = false;
    instances: any;
    noNotifFlag: boolean;
    notifAction: string;
    notifcationcount: any;

    instanceSideSetting: any;
    @ViewChild('sideSetting') sideSetting: ElementRef;
    @ViewChild('alertBox') alertBox: ElementRef;
    @ViewChild('#announcementElem') announcementElem: ElementRef;
    instanceAnnouncementDropdown: any;

    currentUser;
    selectedRole;
    dataService: RemoteData;
    loading: boolean = true;
    applications: ApplicationDTO[] = [];
    clientName: string;
    clientLogo: string;
    clientCode: string;
    userName: string;
    userFullName: string;
    userDTO: UserDTO = new UserDTO();
    userList: UserDTO[] = [];
    proxyUserName: string;
    proxyUserFlag: boolean = true;
    userAppRoles: any[];
    isBelldown: boolean;
    isStardown: boolean;
    isHomedown: boolean = true;
    notifyCard: boolean;
    createdOnDate: string;
    createdOnTime: string;
    notifList: NotificationDTO[] = [];
    notifDateTime: Date;
    advancedUI: boolean = true;
    //    flag: boolean = false;
    profileImg: string;
    allMyWidgets: WidgetDTO[] = [];
    allMyWidgetList: WidgetDTO[] = [];
    proxyDTO: ProxySettingDTO = new ProxySettingDTO();
    @ViewChild('headerComponent', { read: ViewContainerRef, static: true })
    headerComponent: ViewContainerRef;
    newAnnouncementflag: boolean = false;
    announcementList: AnnouncementDTO[];
    newAnnouncementList: AnnouncementDTO[] = [];
    refreshAnnouncement: Subscription;

    constructor(private notifyService: NotifyService, private sessionService: SessionService, private toastService: ToastService, private authService: AuthService, private http: HttpClient, private widgetService: WidgetService, private completerService: CompleterService, private currentBrowser: CurrentBrowserService,
        private profileImageLoaderService: ProfileImageLoaderService, private utilityService: UtilityService, private sanitizer: DomSanitizer, private router: Router,
        private impersonateService: ImpersonateService, private oauthService: OAuthService, private lazyModuleLoaderService: LazyModuleLoaderService, private translate: TranslateService) {

        /*    isHomedown: boolean = true;
            isStardown: boolean = false;
            isBelldown: boolean = false;
            loading: boolean;
            advancedUI: boolean = true;
            notifyCard: boolean = false
            emptyNotifs: boolean = false
            flag: boolean = false;*/

        //   this.dataService = completerService.remote("neosuite/api/fetchUserForProxy?userName=", "employeeId,firstName,lastName", "employeeId,firstName,lastName");
    }

    ngOnInit(): void {
        this.loading = false;

        this.applications = [];
        this.initializedAuthirity();
        this.fetchClientInfo();

        this.userName = this.currentUser.username;
        if (this.sessionService.consentFlag == true) {
            this.setConsent();
        }

        if (this.currentUser.additionalDetails.mdm.firstName != undefined && this.currentUser.additionalDetails.mdm.lastName != undefined)
            this.userFullName = this.currentUser.additionalDetails.mdm.firstName + " " + this.currentUser.additionalDetails.mdm.lastName;
        else if (this.currentUser.additionalDetails.mdm.lastName == undefined)
            this.userFullName = this.currentUser.additionalDetails.mdm.firstName;
        else
            this.userFullName = this.currentUser.additionalDetails.mdm.lastName;

        if (this.currentUser.impersonator != null) {
            this.proxyUserFlag = false;
        }
        this.fetchAllMyAppRoles();
        this.fetchAllAnnouncement();
        //this.createDropDown();
        this.notifyService.subscribeNotifications().subscribe(notifs => {
            /**** To remove unmapped application notifications****/
            var notifications = [];

            this.widgetService.currentWidgets.subscribe(widgets => {
                this.allMyWidgets = widgets;
                this.notifList = [];
                notifs.forEach(n => {
                    var list = [];
                    list = this.allMyWidgets.filter(w => n.app == w.application.appCode);
                    if (list.length != 0)
                        notifications.push(n)
                })
            })
            /********************************************/
            this.notifcationcount = notifications.length;
            if (this.advancedUI) {
                if (this.isUndefinedOrNullOrEmpty(this.notifList) || this.notifList.length == 0 || this.notifAction == "clear")
                    this.getRecentNotif(notifications);
                this.notifAction = ''

            }

        })

        /* *******************************************
         *  calling an method to fetch Announcement 
         *  ******************************************/

        this.refreshAnnouncement = interval(300000).subscribe(x => {

            this.fetchAllAnnouncement();

        });
    }

    ngAfterViewInit() {
        setTimeout(function () {

            $("#proxyUserModal").modal();
            $('select').formSelect();
            $('#sideNavBar').collapsible();
            $('#neoAppRole_Collapsible').collapsible();
            $('.collapsible').collapsible();

        }, 100);

        this.downloadProfileImage();
        this.authService.setTheme();

    }

    createDropDown() {
        var elems = document.querySelector('#alertBox');
        this.instances = M.Dropdown.init(elems, { closeOnClick: false });
        this.openDropDown();
    }

    openDropDown() {
        if (!this.instances.isOpen) {
            this.instances.open();
        }
    }

    closeDropDown() {
        this.instances.close();
    }

    downloadProfileImage() {

        this.profileImageLoaderService.downloadProfileImage().subscribe(res => {
            this.profileImg = res.payload.userImage;
            this.profileImageLoaderService.userProfileImg = res.payload.userImage;
        });
        setTimeout(() => {
            this.loading = false;
        }, 2200);
    }



    getRecentNotif(notifs) {
        this.notifList = [];
        var list = [];
        list = notifs.reverse();
        for (let n of list) {
            if (!this.notifList.some(notif => notif.id == n.id)) {
                var date = new Date(n.createdOn);
                n.createdOnString = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes();
                this.setCreatedTime(n.createdOnString, n.createdOn)
                n.createdOnDate = this.createdOnDate
                n.createdOnTime = this.createdOnTime
                if (this.isUndefinedOrNullOrEmpty(n.appIcon))
                    n.appIcon = "assets/WidgetIcon/defaulticon.jpg"
                this.notifList.push(n)
                if (this.notifList.length == 50)
                    break;
            }
        }

        if (this.notifList.length == 0)
            this.noNotifFlag = true
        else
            this.noNotifFlag = false
    }

    setCreatedTime(createdOnString, createdOn) {
        var currentDate = new Date()
        var createDate = new Date(createdOn)
        var min = Math.abs(currentDate.getTime() - createDate.getTime()) / 60000;
        if (min < 1440 && (createDate.getDate() == currentDate.getDate())) {
            var datearray = createdOnString.split("at");
            this.createdOnDate = "Today";
            this.createdOnTime = datearray[1];

        } else if (min < 2880 && (createDate.getDate() == currentDate.getDate() - 1)) {
            var datearray = createdOnString.split("at");
            this.createdOnDate = "Yesterday";
            this.createdOnTime = datearray[1];
        }
        else {
            var datearray = createdOnString.split("at");
            this.createdOnDate = datearray[0];
            this.createdOnTime = datearray[1];
        }
    }

    openRightSideBarSetting() {


        this.instanceSideSetting = new M.Sidenav(this.sideSetting.nativeElement, { "edge": "right" });
        this.instanceSideSetting.open();

        /*       $(function(){
                   $(".button-collapse").sideNav();
    
                   $(".drag-target").unbind('click');
                   $("#sidenav-overlay").unbind('click');
               });*/
    }

    initializedAuthirity() {

        this.currentUser = this.sessionService.getCurrentUser();

        if (this.currentUser.additionalDetails.clientSupportMail != null) {
            $(".supportMail").text("For help,Contact")
            $(".supportMail").append("<a href='mailto:'" + this.currentUser.additionalDetails.clientSupportMail + "'?subject=Feedback'> " + this.currentUser.additionalDetails.clientSupportMail + "</a>");
        }

        var mythis = this;
        // let role: any;
        // role = this.currentUser.additionalDetails.assignedRoles
        // if ( role.roleName == mythis.currentUser.authorities[0].authority )
        //     this.selectedRole = mythis.currentUser.authorities[0].authority
    }


    setConsent() {
        this.userDTO.userName = this.currentUser.username;;
        this.userDTO.consent = this.sessionService.consentFlag;

        return this.http.post<any>("neosuite/api/updateConsent", this.userDTO).subscribe(data => {
            var data = data.payload
        });
    }

    fetchAllMyAppRoles() {

        this.userAppRoles = [];

        this.http.get<any>("neosuite/api/fetchAllMyAppRoles")
            .subscribe(data => {
                this.userAppRoles = data.payload;
            });
    }

    updateAppRoleActivation() {

        let i = 0;
        let tempUserAppRoles: any = [];

        for (const [key, value] of Object.entries(this.userAppRoles)) {
            if (value != undefined && value != null)
                for (let j = 0; j < value?.length; j++) {
                    tempUserAppRoles[i] = value[j];
                    i++;
                }
        }

        this.http.post<any>("neosuite/api/updateAllMyAppRoles", tempUserAppRoles)
            .subscribe(data => {



                //   this.userAppRoles = data.payload;
                let noRedirectToLogoutUrl = true
                this.oauthService.logOut(noRedirectToLogoutUrl)

                location.reload();
            });

    }

    preventEvent(event, status) {
        if (status)
            event.preventDefault();

    }

    appRoleChanges(keys, roleName, active) {

        let appRoleList = this.userAppRoles[keys];

        for (let i = 0; i < appRoleList.length; i++) {

            if (appRoleList[i].roleName != roleName && appRoleList[i].active == true) {
                appRoleList[i].active = false;
            }

            if (appRoleList[i].roleName == roleName) {
                appRoleList[i].active = active;

            }
        }

        this.userAppRoles[keys] = appRoleList;
    }

    logout() {
        this.currentBrowser.homeOnloadFlag = false;
        this.authService.logout();

    }

    fetchAppRolesForProxyUser() {

        this.userAppRoles = [];

        this.http.get<any>("neosuite/api/fetchAppRolesForProxyUser")
            .subscribe(data => {

                this.userAppRoles = data.payload;

            });
    }

    addProxyUser() {
        if (this.proxyUserName != null && this.proxyUserName != "") {
            this.http.post<any>('neosuite/api/getImpersonateeDetails', this.proxyDTO.proxiedToUser)
                .subscribe(data => {

                    this.oauthService.refreshToken();
                    this.oauthService.events.subscribe(event => {
                        console.error(event);
                        if (event instanceof OAuthSuccessEvent) {
                            if (event.type === "token_received") {
                                this.impersonateService.impersonate(data.payload, "neosuite-client", localStorage.getItem("access_token"))
                                    .subscribe(data => {

                                        this.authService.localLogout();
                                        location.reload();
                                    })
                            }
                        }
                    });
                });
        }
        else {
            this.toastService.error("Please select User");
        }

        this.proxyDTO.proxiedToUser = null;
    }

    becomeSelf() {

        return this.http.get<any>('neosuite/api/becomeSelf')
            .subscribe(data => {
                location.reload();
                //this.proxyUserFlag=true;
            });
    }

    setProxyUser(user) {
        if (user)
            this.proxyUserName = user.employeeId + user.firstName + user.lastName;
        else
            this.proxyUserName = '';
    }

    fetchUserForProxy(event) {
        let searchKey = event.target.value;
        if (searchKey.length > 3) {
            return this.http.get<any>("neosuite/api/fetchUserForProxy?userName=" + searchKey).subscribe(data => {
                this.userList = data.payload;
            })
        }
    }
    cancel() {
        this.proxyUserName = null;
        this.proxyDTO.proxiedToUser = null;
        $(".modal").modal('close');
        this.instanceSideSetting.close();

    }

    close() {
        $("#settingsModal").modal('close');
    }


    isUndefinedOrNullOrEmpty(obj) {
        if (obj == undefined || obj == null || obj == "") {
            return true;
        }
        else {
            return false;
        }
    }
    markedNotificationRead(index, id) {

        this.notifyService.removeNotifById(id)
        this.notifAction = 'read'
        // this.notifList.splice(index, 1);

    }
    clearAllNotifications() {
        if (this.isUndefinedOrNullOrEmpty(this.notifList) || this.notifList.length == 0) {
            let foo: any = this.translate.get("You dont have any notification.");
            foo.subscribe(data => alert(data));
        }
        else {
            let result: any;
            let foo: any = this.translate.get("Do you want to clear all notifications?");
            foo.subscribe(data => result = confirm(data))
            if (result) {
                this.notifyService.removeAll(this.notifList)
                this.notifAction = 'clear'
            }
        }

    }


    CloseRightSideBarSetting() {
        this.instanceSideSetting.close();
    }

    fetchClientInfo() {
        this.http.get<any>("neosuite/api/fetchClientInfo")
            .subscribe(data => {
                this.clientName = data.payload.clientName;
                this.clientLogo = data.payload.clientLogo;
                this.clientCode = data.payload.clientCode;

                if (data.payload.clientLogo != null) {
                    $("#clientLogo").attr("src", this.clientLogo);
                }

                if (data.payload.clientSupportMail != null) {
                    $(".supportMail").text("For help,Contact")
                    $(".supportMail").append("<a href='mailto:'" + data.payload.clientSupportMail + "'?subject=Feedback'> " + data.payload.clientSupportMail + "</a>");
                }
            });
    }
    openModal(parameter) {

        if (parameter == 'settings') {
            this.lazyModuleLoaderService.getCompFactoryAndInstantiate(import('../settings/settings.module').then(m => m.SettingsModule), this.headerComponent)
            $("#settingsModal").modal({ "dismissible": false });
        }
        else if (parameter == 'delegate') {
            $("#settingsModal").modal({ "dismissible": false });
            this.lazyModuleLoaderService.getCompFactoryAndInstantiate(import('../delegate/delegate.module').then(m => m.DelegateModule), this.headerComponent)

        }
        else if (parameter == 'notifications') {
            $("#settingsModal").modal({ "dismissible": false });
            this.lazyModuleLoaderService.getCompFactoryAndInstantiate(import('../notifications/notifications.module').then(m => m.NotificationsModule), this.headerComponent)
        }

    }

    notifToWidgetLoader(url) {
        if (this.utilityService.isNotNullOrEmptyOrUndefined(url))
            this.router.navigate(['/home/' + url]);
    }


    fetchAllAnnouncement() {

        this.http.get<any>(`neosuite/api/admin/tenant/neeyamo/announcement`, {}).subscribe(data => {

            this.newAnnouncementList = data.payload;
            if(this.newAnnouncementList != null){
                if (this.announcementList == null) {
                    this.announcementList = this.newAnnouncementList;
                }

                else{
                    if(this.newAnnouncementList.length>this.announcementList.length)
                        {
                            this.toastService.info("You have new announcement. Click on Announcement icon")
                            this.announcementList = this.newAnnouncementList;
                    }
                }
            }
        });
    }
   
    ngOnDestroy(): void {
        this.refreshAnnouncement.unsubscribe();
    }
}
