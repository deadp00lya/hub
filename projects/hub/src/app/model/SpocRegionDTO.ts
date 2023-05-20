import { ActioRoleDTO } from "./ActioRoleDTO";
import { ApiRegistration } from "./ApiRegistration";
import { RoleEventMappingDTO } from "./RoleEventMappingDTO";
import { RoleFormMappingDTO } from "./RoleFormMappingDTO";

export class SpocRegionDTO {
    id: number;
    staticConfig: boolean = true;
    eventConfig: boolean = false;
    spoc: string;
    apiurl: ApiRegistration = new ApiRegistration();
    queryCode: string;
    fieldName: string;
    currentData: boolean;
    formControl: boolean;
    level: number;
    finalApproval: boolean;
    skip: boolean;
    approvedByTemplateCode: string;
    primaryRole: ActioRoleDTO = new ActioRoleDTO();
    eventRole: RoleEventMappingDTO;
    formRole: RoleFormMappingDTO = new RoleFormMappingDTO();
    notification: string;
    neosuiteNotifications: string;
    enabled: boolean;
}
