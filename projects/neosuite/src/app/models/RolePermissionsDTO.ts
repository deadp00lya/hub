
import { AppRoleDTO } from "./AppRoleDTO";
import { PermissionsDTO } from "./PermissionsDTO";

export class RolePermissionsDTO {

    public id: number;
    public appRole: AppRoleDTO;
    public permission: PermissionsDTO;
    public enabled: boolean;

    public constructor() {

        this.id = null;
        this.appRole = null;
        this.permission = null;
        this.enabled = true;
    }
}