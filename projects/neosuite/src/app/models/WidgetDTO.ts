import { ApplicationDTO } from "./ApplicationDTO";
import { AppModuleDTO } from "./AppModuleDTO";
import { WidgetClassDTO } from "./WidgetClassDTO";
import { WidgetTypeDTO } from "./WidgetTypeDTO";
import { AppRoleDTO } from "./AppRoleDTO";
import { WidgetTagDTO } from "../models/WidgetTagDTO";

export class WidgetDTO {

    public id: number;

    public application: ApplicationDTO;

    public appModule: AppModuleDTO;

    public widgetClass: WidgetClassDTO;

    public widgetType: WidgetTypeDTO;

    public appRoleDtoList: AppRoleDTO[];
    public widgetTagDTO: WidgetTagDTO[];

    public widgetName: string;
    public color: string;
    public widgetHeight: number;
    public widgetWidth: number;
    public userID: number;
    public profileId: number;
    public logId: number;
    public widgetPath: string;
    public editable: boolean;
    public resizable: boolean;
    public closable: boolean;
    public minimizable: boolean;
    public maximizable: boolean;
    public tempMinimizable: boolean;
    public tempMaximizable: boolean;
    public widgetPositionX: number;
    public widgetPositionY: number;
    public tempPosX: number;
    public tempPosY: number;

    public isRestored: boolean;
    public widgetToIcon: boolean;

    public visible: boolean;
    public widgetCode: string;
    public widgetHtml: string;
    public subsCode: string;
    public widgetImagePath: string;
    public widgetImageUrl: string;
    public widgetBgImageUrl: string;
    public enabled: boolean;
    public widgetIcon: string;
    public widgetIconFlag: boolean;
    public widgetGifFlag: boolean;
    public widgetGif: string;
    public bookmarkIcon: boolean;
    public helpIcon: boolean;
    public tagIcon: boolean;
    public scnCapIcon: boolean;
    public loading: boolean;
    public mobileCompatibility: boolean;
    public selected: boolean;
    public secure: boolean;
    public inViewPort: boolean = false;
    public movable: boolean;
    public icon: string;
    public actionButtonsList: any[] = [];
    public showImg: boolean;
    public showGif: boolean;
    public favourite: boolean;
    public titleBar: boolean;
    public routePath:string
    public constructor() {
        this.tempMaximizable = false;
        this.tempMinimizable = false;
        this.loading = false;
        this.secure = false;
    }
}