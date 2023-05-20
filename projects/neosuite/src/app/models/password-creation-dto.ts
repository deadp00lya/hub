import { UserDTO } from "./userDTO";

export class PasswordCreationDTO {
    clientId: number;
    password: string;
    users: UserDTO[] = [];
    passwordNotify: boolean;
    auto: boolean;
    manual: boolean;
}
