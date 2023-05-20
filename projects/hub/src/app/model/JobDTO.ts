export class JobDTO {
    jobId: number;
    employeeId: string;
    departmentCode: string;
    reportingManagerAdminEmployeeId: string;

    reportingManagerHrEmployeeId: string;
    serviceCenterEmployeeId: string;
    reportingManagerFuntionalEmployeeId:string; 
    position: number;
    sid: number;
    pid: number;
    jobTitle: string;
    jobClassification: string;
    designation: string;
    band: string;
    grade: string;
    role: string;
    externalDesignationId: number;
    collectiveAgreement: string;
    costCentre: string;
    function: string;
    effectiveStartDate: string;
    effectiveEndDate: Date;
    enabled: boolean;
    approval: number;
    error: string;
    overwrite: boolean;
}