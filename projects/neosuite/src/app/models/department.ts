import { UserDTO } from "./userDTO";

export class Department {

    public id: number;
    public deptName: string;
    public deptCode: string;
    public createdBy: UserDTO;
    public updatedBy: UserDTO;
    public createdOn: Date;
    public updatedOn: Date;
    public enabled: boolean;

}
