import { UserDTO } from "../models/userDTO";
import { WidgetDTO } from "../models/WidgetDTO";
import { ApplicationDTO } from "../models/ApplicationDTO";

export class ProxySettingDTO {

    public id: number;
    public widgetCode: string[];
    public proxiedBy: UserDTO;
    public proxiedTo: string[];
    public startDate: Date;
    public endDate: Date;
    public widgets: WidgetDTO[];
    public proxiedToUser: UserDTO;
    public widget: WidgetDTO;
    public delegatedTo: string;
    public noOfWidgets: number;
    public application: ApplicationDTO;
    public delegatedToUser: string;
    public delegatedByUser: string;
    public widgetmap: Map<string, WidgetDTO[]>;
    public appList: string[];
    public enabled: Boolean;

    public constructor() {

        this.id = null;
        this.widgetCode = [];
        this.proxiedBy = new UserDTO() ;
        this.proxiedTo = [];
        this.startDate = null;
        this.endDate = null;
        this.widgets = [];
        this.proxiedToUser = null;
        this.widget = null;
        this.delegatedTo = null;
        this.noOfWidgets = null;
        this.application = null;
        this.delegatedToUser = null;
        this.delegatedByUser = null;
        this.widgetmap = null;
        this.appList = [];
        this.enabled = true;

    }
}