export class AuditActionFieldDTO {
    id: number;
    actionType: string;
    actionName: string;
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
        this.actionType = null;
        this.actionName = null;
        this.fieldJson = null;
        this.createdBy = null;
        this.createdOn = null;
        this.updatedBy = null;
        this.updatedOn = null;
        this.enabled = true;
    }
}
