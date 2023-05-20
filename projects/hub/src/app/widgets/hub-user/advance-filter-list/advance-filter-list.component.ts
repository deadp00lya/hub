import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { SessionService, ToastService, UtilityService, WidgetService } from '@nw-workspace/common-services';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from "@angular/forms";
import { CompleterService, CompleterData, RemoteData, CompleterItem } from 'ng2-completer';
import * as M from "materialize-css/dist/js/materialize";
import { AdvanceFilterDTO } from '../../../model/advance-filter-dto';
import { EventsService } from '../../../services/events.service';
import { Constant } from '../../../model/constant';
import { environment } from 'projects/hub/src/environments/environment.prod';
declare var $: any;
declare var require: any;


@Component({
  selector: 'app-advance-filter-list',
  templateUrl: './advance-filter-list.component.html',
  styleUrls: ['./advance-filter-list.component.css']
})
export class AdvanceFilterListComponent implements OnInit {
  countryList: any = [];
  listview: boolean = false;
  appCode: any;
  widgetDetail: any;
  countryBusinessUnitList: any = [];
  advanceFilterDTO = new AdvanceFilterDTO();
  employeeStatusList: any = [{ "name": "Active" }, { "name": "Inactive" }]
  headers: HttpHeaders = new HttpHeaders();
  widgetCode: string;
  currentUser: any;
  options: { headers: HttpHeaders; };
  locationList: any = [];
  inCdnPath :string= environment.cdnPath;
  clientCode: string;

  advanceFilterInputs: AdvanceFilterDTO = new AdvanceFilterDTO();

  constructor(private http: HttpClient, private toastService: ToastService, private sessionService: SessionService, private widgetService: WidgetService, private advanceEvents: EventsService, private utilityService: UtilityService) {
    this.currentUser = this.sessionService.getCurrentUser().sessionDTO;
  }

  ngOnInit(): void {
    
    this.currentUser = this.sessionService.getCurrentUser();
    this.clientCode = localStorage.getItem('tenantID');

    this.advanceFilterDTO = this.advanceFilterInputs;
    
    this.fetchCountryList();
    this.getCurrentWidgetCodeAppCode();

    if (this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceFilterInputs)) {
      if (this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceFilterInputs.countryCode)) {
        debugger
        this.onCountrySelect(this.advanceFilterInputs.countryCode);
      }
      if (this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceFilterInputs.countryCode) && this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceFilterInputs.businessunitCode)) {
        debugger
        this.onLocationSelect(this.advanceFilterInputs.countryCode, this.advanceFilterInputs.businessunitCode);
      }
    }

    this.headers = this.headers.append('App-Code', this.appCode);
    this.headers = this.headers.append('Component', "listview");
    this.options = { headers: this.headers };


  }

  resetDate()
  {
    this.advanceFilterDTO.dateOfJoining = null;
  }

  getCurrentWidgetCodeAppCode() {
    
    return this.http.get<any>("neosuite/api/getMyAllWidgets")

      .subscribe(res => {

        var widgetList = [];

        widgetList = res.payload;

        let currentWidgetInfo = widgetList.filter(widget => widget.widgetPath === 'AdvanceFilterListComponent');

        /*   this.appCode = currentWidgetInfo[0].application.appCode;
  
          this.widgetCode = currentWidgetInfo[0].widgetCode;
   */


      })

  }

  selectRefresh() {
    setTimeout(function () {
      $('select').formSelect();
      M.updateTextFields();
    }, 10);
  }

  fetchCountryList() {
    this.http.get<any>("hub/tenants/" + this.clientCode + "/countries").subscribe(data => {
      this.countryList = data.payload.list;
      this.selectRefresh();

    })
  }



  onCountrySelect(countryCode) {
    this.countryBusinessUnitList = [];
    // this.advanceFilterDTO.businessunitCode = null;

    this.http.get<any>("hub/tenants/" + this.clientCode + "/businessunit?countryCode='" + countryCode + "'").subscribe(data => {
      this.countryBusinessUnitList = data.payload.list;

      if (this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceFilterInputs.businessunitCode) && this.utilityService.isNotNullOrEmptyOrUndefined(this.countryBusinessUnitList)) {
        this.advanceFilterDTO.businessunitCode = this.advanceFilterInputs.businessunitCode;
      }

      this.selectRefresh();
    });

    this.selectRefresh();
  }

  onLocationSelect(countryCode, bu) {
    // this.countryBusinessUnitList = [];
    this.locationList = [];
    this.http.get<any>("hub/tenants/" + this.clientCode + "/" + countryCode + "/" + bu + "/location").subscribe(data => {
      this.locationList = data.payload.list;

      if (this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceFilterInputs.location) && this.utilityService.isNotNullOrEmptyOrUndefined(this.locationList)) {
        this.advanceFilterDTO.location = this.advanceFilterInputs.location;
      }

      this.selectRefresh();
    });

    this.selectRefresh();
  }

  dateConverter() {
    
    this.advanceFilterDTO.dateOfJoining = formatDate(this.advanceFilterDTO.dateOfJoining, 'yyyy-MM-dd', 'en-US');

  }


  fetchAdvanceDetails() {
    
    if(this.utilityService.isNotNullOrEmptyOrUndefined(this.advanceFilterDTO))
    this.advanceEvents.broadcast(Constant.CONSTANT_SEND_ACTION, this.advanceFilterDTO);
  }

  reset() {
    this.advanceFilterDTO = new AdvanceFilterDTO();
    this.countryBusinessUnitList = [];
    this.locationList=[]
    this.advanceEvents.broadcast(Constant.CONSTANT_SEND_ACTION, this.advanceFilterDTO);
  }



}
