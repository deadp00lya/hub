export class ContactDTO {

    contactId: number;

    workLocationId: number;
    sid: number;
    pid: number;
    employeeId: string;
    language: number;
    emailOfficial: string;
    phoneNumberOfficial: string;
    emailPersonal: string;
    phoneNumberPersonal: string;
    seatNumber: string;
    deskExtension: string;
    infraCode: string;
    timezone:  number;
    emergencyContactName: string;
    emergencyContactRelationship: string;
    emergencyContactPhone: string;
    emergencyEmailAddress: string;
    effectiveStartDate: string;
    effectiveEndDate: Date;
    enabled: boolean;
    approval: number;
    error: string;
    overwrite: boolean;

}