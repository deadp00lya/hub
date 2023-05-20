export class ActionLogDTO {
    clientCode: string;
    employeeGlobalId: string;
    businessunitCode: string;
    eventType: string;
    fromDate: string;
    toDate: string;
    rev: number;
    page: number;
    size: number;
    searchString: string;

    constructor() {
        this.clientCode = null;
        this.employeeGlobalId = null;
        this.eventType = null;
        this.businessunitCode = null;
        this.fromDate = null;
        this.toDate = null;
        this.rev = null;
        this.page = 0;
        this.size = 50;
        this.searchString = '';
    }
}
