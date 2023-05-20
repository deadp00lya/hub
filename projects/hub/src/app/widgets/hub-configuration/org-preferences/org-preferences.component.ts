import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import * as M from "materialize-css/dist/js/materialize";
import { HttpClient } from '@angular/common/http';
import { ToastService, WidgetService } from '@nw-workspace/common-services';
import { WidgetComponent } from '../../../model/WidgetComponent';
declare var require: any;
declare var $: any;

@Component({
    selector: 'app-org-prefrences',
    templateUrl: './org-preferences.component.html',
    styleUrls: ['./org-preferences.component.css']
})

export class OrgPreferencesComponent implements OnInit {

    widgetWidth: number;
    widgetComponent: WidgetComponent = new WidgetComponent();
    configPage: number = 0;

    constructor(private http: HttpClient, private toastService: ToastService, private widgetService: WidgetService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {

        setTimeout(function () {
            M.AutoInit();
        }, 10);



        var elementResizeDetectorMaker = require("element-resize-detector");
        var erdUltraFast = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.
        });
        erdUltraFast.listenTo(document.getElementById("orgPrefrences"), element => {
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

        var instance = M.Sidenav.init(document.getElementById('orgSlideOut'), {
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
