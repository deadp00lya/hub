import { Role } from "./role";
import { ApplicationDTO } from "./ApplicationDTO";
import { UserDTO } from "./userDTO";

export class UserRole {
    userRoleId: number;
    role: Role;
    appRole: Role[] = [];
    appDTO: ApplicationDTO;
    user: UserDTO;
    users: UserDTO[];
    active: boolean;
    enable: boolean;
    activeAppRole: string;
}
