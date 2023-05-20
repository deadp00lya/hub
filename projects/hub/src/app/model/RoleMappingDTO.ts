import { FormDTO } from "./FormDTO";
import { ListConfigDTO } from "./ListConfigDTO";

export class RoleConfigurationDTO {
    id: number;
    appCode: string;
    roleCode: string;
    form: FormDTO = new FormDTO();
    configList: ListConfigDTO = new ListConfigDTO();
    idAutoGenerate: string;


}
