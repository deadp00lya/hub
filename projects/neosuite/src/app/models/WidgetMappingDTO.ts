import { WidgetDTO } from "./WidgetDTO";
import { WidgetSubscriptionDTO } from "./WidgetSubscriptionDTO";
import { Client } from "./client";
import { AppRoleDTO } from "./AppRoleDTO";
import { Role } from "./role";
import { UserDTO } from "./userDTO";
import { Country } from "./country";
import { Department } from "./department";
import { BusinessUnitDTO } from "./BusinessUnitDTO";




export class WidgetMappingDTO {

    public id: number;

    public widgets: WidgetDTO;

    public widgetSubscription: WidgetSubscriptionDTO;

    public widgetSubscriptions: WidgetSubscriptionDTO[];

    public client: Client;

    public appRole: AppRoleDTO;

    public appRoles: AppRoleDTO[];

    public role: Role;

    public user: UserDTO;

    public userList: UserDTO[];

    public country: string;

    public businessUnit: string;

    public department: string;

    public accessType: boolean;

    public enabled: boolean;

    public cronDateTime: string;

    public constructor() { }
}