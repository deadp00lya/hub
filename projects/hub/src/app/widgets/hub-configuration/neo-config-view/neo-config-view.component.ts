import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService, UtilityService } from '@nw-workspace/common-services';
import * as M from "materialize-css/dist/js/materialize";
import { environment } from 'projects/hub/src/environments/environment.prod';

import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-neo-config-view',
  templateUrl: './neo-config-view.component.html',
  styleUrls: ['./neo-config-view.component.css']
})
export class NeoConfigViewComponent implements OnInit {

  @Output() versionEvent = new EventEmitter<boolean>();
  @Input("configCode") configCode: any;
  newConfigObject: {};
  modalInstance: any;
  cdnUrl = environment.cdnPath;
  versionList: Observable<any>;
  index: number;
  widgetCode: string;

  constructor(private http: HttpClient, private toastService: ToastService, private utilityService: UtilityService) { }

  ngOnInit() {
    debugger
    this.getVersion(this.configCode);
  }

  closeNeoConfig() {
    this.versionEvent.emit(false);
  }

  getVersion(configCode) {

    if (this.utilityService.isNullOrEmptyOrUndefined(configCode)) {
      this.toastService.error("Config Code Empty");
      this.closeNeoConfig()
      return false;
    }

    this.http.get<any>("config-portal/version/" + configCode).subscribe(data => {

      this.versionList = data.payload.version;
      this.widgetCode = data.payload.widgetCode;

      setTimeout(() => {
        var elemodal = document.getElementById('versionModal');
        this.modalInstance = M.Modal.init(elemodal, {});
        this.modalInstance.open();

      }, 10);

    })

  }

  viewJsonBody(versionNumber) {

    this.http.get<any>("config-portal/" + this.configCode + "/version?id=" + versionNumber).subscribe(data => {

      this.newConfigObject = data.payload;

      setTimeout(() => {
        var elemodal = document.getElementById('neoConfigModal');
        this.modalInstance = M.Modal.init(elemodal, {});
        this.modalInstance.open();
        var textedJson = JSON.stringify(this.newConfigObject, undefined, 4);
        $('#myTextarea').text(textedJson);
      }, 10);

    })
  }

  byOrder = (a, b) => {
    if (a.key < b.key) return b.key;
  }

  switchToPreviousVersion() {

    var note = this.newConfigObject['note'];
    var appCode = this.newConfigObject['applicationCode']

    this.http.post<any>("config-portal/widget/" + this.widgetCode + "/name/" + note + "?config-code="
      + this.configCode, this.newConfigObject).subscribe(data => {
        this.toastService.success("waiting for Approval");
        this.closeNeoConfig();

      })

  }

}
