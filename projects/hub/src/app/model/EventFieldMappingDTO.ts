import { EventFormDTO } from "./EventFormDTO";
import { FieldDTO } from "./FieldDTO";

export class EventFieldMappingDTO {

    id: number;
    eventformConfig: EventFormDTO = new EventFormDTO();
    field: FieldDTO = new FieldDTO();
    sequence: number;
    enabled: boolean;
}
