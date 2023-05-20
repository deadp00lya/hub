import { GroupDTO } from "./GroupDTO";

export class GroupParticipantsDTO {

    id: number;
    groupId: GroupDTO= new GroupDTO();
    employeeId: string;
    owner: string;
    enabled:boolean;

}
