export class AuditEventFieldDTO {
    id: number;
    eventType: string;
    eventName: string;
    fieldJson: string;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
    enabled: boolean;
    actionButtonsList: any;
    neoConfigCode: string;

    constructor() {
        this.id = null;
        this.eventType = null;
        this.eventName = null;
        this.fieldJson = null;
        this.createdBy = null;
        this.createdOn = null;
        this.updatedBy = null;
        this.updatedOn = null;
        this.enabled = true;
    }
}
