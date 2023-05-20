import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AnnouncementDTO } from '../../models/AnnouncementDTO';

@Component({
  selector: 'app-annoucements',
  templateUrl: './annoucements.component.html',
  styleUrls: ['./annoucements.component.css'],
})
export class AnnoucementsComponent implements OnInit {
  announcementList: AnnouncementDTO[] = [];
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchAllAnnouncement();
  }
  fetchAllAnnouncement() {

    this.http.get<any>(`neosuite/api/admin/tenant/neeyamo/announcement`, {}).subscribe(data => {
      if (data.payload != null) {
        this.announcementList = data.payload;
        for (let i = 0; i < this.announcementList.length; i++) {
          this.announcementList[i].affectedServices = this.announcementList[i].services.split(',');
        }
      }
      else{
        this.announcementList = [];
      }
    });
  }

  getIcon(type: string) {
    switch (type) {
      case 'Feature Release': 
        return 'lightbulb_outline';
      case 'Scheduled Release': 
        return 'access_time';
      case 'Service Up': 
        return 'check_circle';
      case 'Service Down': 
        return 'cancel';
      case 'Emergency Release': 
        return 'warning';

      default:
        return 'error';
    }

  }

  getClass(type: string) {

    switch (type) {
      case 'Feature Release': 
        return 'new_feature';
      case 'Scheduled Release': 
        return 'planned_downtime';
      case 'Service Up': 
        return 'service_up';
      case 'Service Down': 
        return 'service_down';
      case 'Emergency Release': 
        return 'emergency_downtime';

      default:
        return 'planned_downtime'
    }
  }
 
}
