export class OrgStructureDTO {
    id: number;
    actionButtonsList: any[];
    firstNode: string;
    nodeStructure: string;
    orgStructureName: string;
    orgStructureCode: string;
    createdBy: string;
    createdOn: Date;
    updetedBy: string;
    updatedOn: Date;
    enabled: boolean;

    constructor() {
        this.firstNode = null;
        this.nodeStructure = null;
        this.orgStructureName = null;
        this.orgStructureCode = null;
        this.createdBy = null;
        this.createdOn = null;
        this.updetedBy = null;
        this.updatedOn = null;
        this.enabled = null;
    }
}