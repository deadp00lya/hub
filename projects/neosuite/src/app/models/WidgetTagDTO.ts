
import { UserWidgetProfileDTO } from "../models/UserWidgetProfileDTO";

export class WidgetTagDTO {
    id: number;
    tagName: string;
    profileId: number;
    userWidgetProfileDTO: UserWidgetProfileDTO;
    enabled: boolean;
    widgetCode:string;
    constructor() {
        this.id = null;
        this.tagName = null;
        this.profileId = null;
        this.userWidgetProfileDTO = null;
        this.enabled = false;
        this.widgetCode = null;
    }
}




