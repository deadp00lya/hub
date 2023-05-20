import { UserDTO } from "./userDTO";

export class WidgetLogDTO {
    
     id: number;
     widgetCode: string;
     userDTO: UserDTO;
     inTime: Date;
     outTime: Date;
}