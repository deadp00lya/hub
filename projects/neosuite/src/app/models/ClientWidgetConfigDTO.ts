import { WidgetDTO } from "./WidgetDTO";
import { WidgetSubscriptionDTO } from "./WidgetSubscriptionDTO";


export class ClientWidgetConfigDTO {

    public id: number;

    public widget: WidgetDTO;

    public widgetSubscription: WidgetSubscriptionDTO;

    public tileName: string;

    public color: string;

    public tileRadius: number;

    public height: number;

    public width: number;

    public editable: boolean;

    public resizable: boolean;

    public minimizable: boolean;

    public maximizable: boolean;

    public closable: boolean;
    
    public movable: boolean;

    public widgetToIcon: boolean;
    
    public openByDefault: boolean
    public enabled: boolean=true
    public xaxis: number;
    public yaxis: number;


    public constructor() {

        this.editable = true;
        this.resizable = true;
        this.minimizable = true;
        this.maximizable = true;
        this.closable = true;
        this.widgetToIcon = true;
        this.openByDefault = false;
        this.movable =true;


    }
}