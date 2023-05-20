import { FormDTO } from "./FormDTO";
import { RoleConfigurationDTO } from "./RoleConfigurationDTO";

export class RoleFormMappingDTO {

    id: number;
    form: FormDTO = new FormDTO();
    roleMappingDTO: RoleConfigurationDTO = new RoleConfigurationDTO();
}
