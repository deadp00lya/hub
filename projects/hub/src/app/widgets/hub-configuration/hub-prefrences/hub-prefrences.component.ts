import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from '@angular/common/http';
import { SessionService, ToastService, WidgetService } from '@nw-workspace/common-services';
import { WidgetComponent } from '../../../model/WidgetComponent';
declare var require: any;
declare var $: any;

@Component({
    selector: 'app-hub-prefrences',
    templateUrl: './hub-prefrences.component.html',
    styleUrls: ['./hub-prefrences.component.css']
})

export class HubPrefrencesComponent implements OnInit {

    widgetWidth: number;
    widgetComponent: WidgetComponent = new WidgetComponent();
    configPage: number = 0;
    activeRole: string;
    globalSeries: boolean = false;

    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService,
        private sessionService: SessionService) { }

    ngOnInit() {
        this.getAppRole();
        if(this.activeRole ==="hub_superAdmin") {
            this.globalSeries=true;
            this.setConfigPage(7)
        }
    }

    getAppRole() {

        let currentUser = this.sessionService.getCurrentUser();
        var appRoles: any[] = currentUser.additionalDetails.neosuite.appRoles;
        appRoles.filter(app => {
            if (app.appCode == "ehub") {
                this.activeRole = app.roles[0].roleCode;
            }
        });
    }
    ngAfterViewInit() {

        setTimeout(function () {
            M.AutoInit();
        }, 10);



        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("pexPrefrences"), element => {
            this.onResizedEvent(element);
        });
    }
    onResizedEvent(event) {
        this.widgetWidth = this.widgetService.onResized(event);
        if (this.widgetWidth > 12) {
            this.widgetWidth = 12
        }
        else if (this.widgetWidth == 8) {
            setTimeout(function () {
                M.AutoInit();
            }, 10);
        }
    }

    getResponsiveClasses(widgetWidth, classSizeList, defaultClasses) {
        return this.widgetService.getResponsiveClasses(widgetWidth, classSizeList, defaultClasses);
    }

    getHideShow(className, widgetWidth, comparator, startSize, endSize) {
        return this.widgetService.getHideShow(className, widgetWidth, comparator, startSize, endSize);
    }

    setConfigPage(configPage) {
        this.configPage = configPage;
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

}
