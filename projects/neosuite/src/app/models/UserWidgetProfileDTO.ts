import { UserDTO } from "./userDTO";
import { WidgetDTO } from "./WidgetDTO";


export class UserWidgetProfileDTO {

    public profileId: number;

    public userDTO: UserDTO;

    public widgetDTO: WidgetDTO;

    public widgetName: String;

    public widgetImagePath: String;

    public widgetProflieImage: String;

    public widgetProflieBgImage: String;

    public color: String;

    public widgetHeight: number;

    public widgetWidth: number;

    public widgetRadius: number;

    public widgetPositionX: number;

    public widgetPositionY: number;

    public widgetTransformStatus: String;

    public visible: Boolean;

    public bookmark: Boolean;

    public getWidgetBgImgFlag: boolean;

    public fromWidget: WidgetDTO;

    public toWidget: WidgetDTO;

constructor(){
    this.widgetDTO= new WidgetDTO();
}
}