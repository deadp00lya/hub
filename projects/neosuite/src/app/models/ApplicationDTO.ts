export class ApplicationDTO {

    public id: number;
    public appName: string;
    public appCode: string;

    public applicationId: number;
    public applicationName: string;
    public userId: string;
    public password: string;
    public enabled: boolean;
    public existingApp: Boolean;
    public appIconFlag: boolean;
    public appGifFlag: boolean;
    public createdBy: number;
    public createdOn: Date;
    public updatedBy: number;
    public updatedOn: Date;
    public iconName: string;
    public gifName: string;
    public selected: boolean = false;
    public notificationCount: number
    public showImg: boolean;
    public showGif: boolean;
    public url:string;
    public constructor() {
        this.id = null;
        this.appName = null;
        this.appCode = null;
        this.iconName = null;
        this.gifName = null;
        this.enabled = true;
        this.notificationCount = 0
    }

}