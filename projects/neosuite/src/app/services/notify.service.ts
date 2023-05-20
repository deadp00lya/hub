import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { NotificationDTO } from "../models/NotificationDTO";
import { webSocket } from "rxjs/webSocket";
import { SessionService, WidgetService } from '@nw-workspace/common-services';
import { Subscription, interval } from "rxjs";

@Injectable({
	providedIn: 'root'
})

export class NotifyService {

	subject: any;
	private observableNotifs = <BehaviorSubject<any>>new BehaviorSubject([]);
	private currentNotifs = this.observableNotifs.asObservable();
	totalNotifs: NotificationDTO[] = [];
	currentUser: any;
	userId: string;
	clientCode: string;
	refreshTokenSubscription: Subscription;
	notifToken: string;
	constructor(private http: HttpClient, private sessionService: SessionService, private widgetService: WidgetService) {
		this.currentUser = this.sessionService.getCurrentUser();
		this.userId = this.currentUser.preferred_username;
		this.clientCode = this.currentUser.additionalDetails.mdm.clientCode;

		// this.awsConnect();
		this.getNotiftoken();
		/* ************************************************
		*  calling an method to keep websocket conn active 
		*  ************************************************/
		this.refreshTokenSubscription = interval(240000).subscribe(x => {

			this.subject.next({ "action": "ping", "message": 'active session' });
		});
	}

	awsConnect() {
		var mythis = this;
		//console.log('Trying to connect');
		this.subject = webSocket('wss://ggut5hso29.execute-api.eu-central-1.amazonaws.com/uat?token=' + mythis.notifToken);
		this.subject.subscribe(
			msg => {

				mythis.setNotifs(msg);
			},
			err => {

				console.log("socket error: ", err);
			},
			() => {

				console.log('web socket connection closed ')
			}
		);
		this.subject.next({ "action": "ping", "message": 'start message' });
	}

	private setNotifs(notifs) {

		if (notifs.length != 0) {
			if (this.totalNotifs.length == 0)
				this.totalNotifs = notifs
			else {

				notifs.forEach(notif => {

					if (this.totalNotifs.some(alreadyNotif => alreadyNotif.id == notif.id)) {

					} else {

						this.totalNotifs.push(notif)
					}
					if (notif.appIcon == undefined || notif.appIcon == null)
						notif.appIcon = "assets/WidgetIcon/defaulticon.jpg"
				});


			}
			this.widgetService.currentWidgets.subscribe(widgets => {

				widgets.forEach(item => {
					this.totalNotifs.forEach(notif => {

						if (notif.app == item.application.appCode) {
							notif.appName = item.application.appName
							if (item.application.iconName == undefined || item.application.iconName == null)
								notif.appIcon = "assets/WidgetIcon/defaulticon.jpg"
							else
								notif.appIcon = item.application.iconName

						}
					});

				})
			})
			this.observableNotifs.next(this.totalNotifs)
		}
	}

	public subscribeNotifications() {

		return this.currentNotifs;
	}


	public removeNotifById(id) {

		var obj = {
			id: id,
			toUser: this.userId,
			clientCode: this.clientCode
		}
		for (let i = 0; i < this.totalNotifs.length; i++) {
			if (this.totalNotifs[i].id == id) {
				this.totalNotifs.splice(i, 1);
				break;
			}
		}
		this.observableNotifs.next(this.totalNotifs)
		this.http.post<any>("https://ekgg5l6165.execute-api.eu-central-1.amazonaws.com/UAT/notification/archive", obj).subscribe(data => {

		})

	}

	public removeAll(appNotifs) {

		for (let i = 0; i < appNotifs.length; i++) {
			var obj = {
				id: appNotifs[i].id,
				toUser: this.userId,
				clientCode: this.clientCode
			}
			for (let j = 0; j < this.totalNotifs.length; j++) {
				if (this.totalNotifs[j].id == appNotifs[i].id)
					this.totalNotifs.splice(j, 1);
			}
			this.http.post<any>("https://ekgg5l6165.execute-api.eu-central-1.amazonaws.com/UAT/notification/archive", obj).subscribe(data => {


			})
		}
		this.observableNotifs.next(this.totalNotifs);
	}

	public getNotiftoken() {
		this.http.get<any>('neosuite/api/getNotifToken').subscribe((response) => {
			this.notifToken = response.payload;
			this.awsConnect();
		});
	}

}
