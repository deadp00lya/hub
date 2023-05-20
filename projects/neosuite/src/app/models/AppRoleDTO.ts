import { ApplicationDTO } from "./ApplicationDTO";
import { UserDTO } from "./userDTO";
import { RoleDTO } from "./RoleDTO";

export class AppRoleDTO {

    public id: number;

    public applications: ApplicationDTO;
    public roleName: String;
    public roleCode: String;
    public enabled: Boolean;
    public user: UserDTO;
    public role: RoleDTO;
    public appName: string;
    public actionButtonsList: any[] = [];
    public constructor() {

        this.id = null;
        this.applications = null;
        this.roleName = null;
        this.roleCode = null;
        this.enabled = true;
        this.user = new UserDTO();
        this.role = new RoleDTO();
        this.appName = null;
    }

}
