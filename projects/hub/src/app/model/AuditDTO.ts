export class AuditDTO {
    clientCode: string;
    employeeGlobalId: string;
    employeeName: string;
    countryCode: string;
    businessunitCode: string;
    eventType: string;
    actionType: string;
    fromDate: string;
    toDate: string;
    rev: number;
    fieldType: string;
    page: number;
    size: number;
    searchString: string;

    constructor() {
        this.clientCode = null;
        this.employeeGlobalId = null;
        this.employeeName = null;
        this.countryCode = null;
        this.eventType = null;
        this.actionType = null;
        this.businessunitCode = null;
        this.fromDate = null;
        this.toDate = null;
        this.rev = null;
        this.fieldType = null;
        this.page = 0;
        this.size = 50;
        this.searchString = '';
    }
}
