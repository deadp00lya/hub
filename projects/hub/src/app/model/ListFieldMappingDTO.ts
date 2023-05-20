import { FieldDTO } from "./FieldDTO";
import { ListConfigDTO } from "./ListConfigDTO";

export class ListFieldMappingDTO {
    id: number;
    field: FieldDTO = new FieldDTO();
    listConfig: ListConfigDTO = new ListConfigDTO();
    sequence: number;
    mandatory: boolean;
    enabled: boolean;
}