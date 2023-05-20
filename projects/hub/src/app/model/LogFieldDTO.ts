import { JsonFieldDTO } from "./JsonFieldDTO";

export class LogFieldDTO {
    eventType: string;
    sectionName: string;
    sectionCode: string;
    fieldName: string;
    fieldTitle: string;
    fields: JsonFieldDTO[] = [];
    enabled: boolean;
    status: string;

    constructor() {
        this.eventType = null;
        this.sectionName = null;
        this.sectionCode = null;
        this.fieldName = null;
        this.fieldTitle = null;
        this.enabled = true;
        this.status = null;
    }
}
