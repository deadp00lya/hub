import { FormDTO } from "./FormDTO";
import { ListConfigDTO } from "./ListConfigDTO";

export class RoleConfigurationDTO {
    id: number;
    appCode: string;
    roleCode: string;
    component: string;
    formCode: string;
    configuration: FormDTO = new FormDTO();
    configList: ListConfigDTO = new ListConfigDTO();
    idAutoGenerate: string;
    globalIdAutoGenerate: string;
    updatedByTemplateCode: string;
    updatedForTemplateCode: string;
    effectiveDateView: boolean;



}
