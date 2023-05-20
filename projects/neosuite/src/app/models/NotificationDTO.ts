
export class NotificationDTO {

    public id: number;
    public fromUser: string;
    public toUser: string;
    public description: string;
    public app: string; string
    public createdOn: Date;
    public markRead: boolean;
    public appName: string;
    public empName: string;
    public createdOnString: string;
    public appIcon: string;
    public constructor() {
        this.id = null;
        this.fromUser = null;
        this.toUser = null
        this.description = null;
        this.app = null;
        this.createdOn = null;
        this.markRead = false;
        this.appName = null;
        this.empName = null;
        this.appIcon = null;
        this.createdOnString = null;
    }
}



