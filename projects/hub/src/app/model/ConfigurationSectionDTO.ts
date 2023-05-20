import { FieldDTO } from "./FieldDTO";
import { FormDTO } from "./FormDTO";
import { SectionDTO } from "./SectionDTO";

export class ConfigurationSectionDTO {
    id: number;
    form: FormDTO = new FormDTO();
    field: FieldDTO = new FieldDTO();
    section: SectionDTO = new SectionDTO();
    column: number;
    sequence: number;
    sectionSequence: number;
}