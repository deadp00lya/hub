import { FormDTO } from "./FormDTO";
import { RoleConfigurationDTO } from "./RoleConfigurationDTO";
import { RoleEventMappingDTO } from "./RoleEventMappingDTO";
import { StatusDTO } from "./StatusDTO";

export class ApprovalDTO {
    id: number;
    roleEventMapping: RoleEventMappingDTO = new RoleEventMappingDTO()
    role:RoleConfigurationDTO =new RoleConfigurationDTO()
    formRole:FormDTO=new FormDTO();
    prerequest: string;
    request: string;    
    status: StatusDTO = new StatusDTO();
    assignedBy: string;
    assignedTo: string;
    enabled: boolean;
}