import { ApplicationDTO} from "./ApplicationDTO";
import { AppRoleDTO } from "./AppRoleDTO";

export class PermissionsDTO {

    id: number;
    applications: ApplicationDTO;
    appRole: AppRoleDTO;
    permissionName: string;
    permissionCode: string;
    permissionValue: string;
    enabled: boolean;

    public constructor() {

        this.id = null;
        this.permissionName = null;
        this.permissionCode = null;
        this.permissionValue = null;
        this.enabled = true;

    }
}
