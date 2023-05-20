export class EmployeeDTO {

    job: any;
    contact: any;
    payroll: any;
    countryId: any;
    businessunitId: any;

    //    education: any = [];
    id: number;
    sid: number;
    pid: number;
    employeeId: string;
    employeeGlobalId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    preferredName: string;
    title: string;
    gender: string;
    dateOfBirth: string;
    dateOfJoining: string;
    resignationDate: string;
    reHireDate: string;
    dateOfConfirmation: string;
    employeeClass: string;
    employeeType: string;
    employeeCategory: string;
    employeeStatus: string;
    photo: string;
    effectiveStartDate: string;
    effectiveEndDate: string;
    enabled: boolean;
    approval: number;
    overwrite: boolean;
    countryCode: string;
    businessunitCode: string;
    clientCode: string;

    contactId: string;
    workLocationId: number;
    languageCode: string;
    emailOfficial: string;
    phoneNumberOfficial: string;
    emailPersonal: string;
    phoneNumberPersonal: string;
    seatNumber: string;
    deskExtension: string;
    infraCode: string;
    timezone: number;
    emergencyContactName: string;
    emergencyContactRelationship: string;
    emergencyContactPhone: string;
    emergencyEmailAddress: string;
    contactEffectiveStartDate: string;
    contactEffectiveEndDate: string;

    jobId: string;
    departmentCode: string;
    reportingManagerAdminEmployeeId: string;
    reportingManagerHrEmployeeId: string;
    serviceCenterEmployeeId: string;
    reportingManagerFuntionalEmployeeId: string;
    position: number;
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
    jobEffectiveStartDate: string;
    jobEffectiveEndDate: string;
    departmentName: string;

    payrollId: string;
    payrollStartDate: string;
    payType: string;
    paymentMethod: string;
    payrollEmployeeStatus: string;
    seniorityStartDate: string;
    previousEmploymentId: string;
    payGrade: string;
    payGroup: string;
    modeOfPayment: string;
    payFrequency: string;
    compulsorilyInsured: string;
    taxBracket: string;
    taxCardCopyProvided: string;
    taxDependants: number;
    differentlyAbled: string;
    exemptFromTax: string;
    martialStatus: string;
    dateOfMarraige: string;
    etinicity: string;
    onsiteStatus: string;
    accessCardNumber: string;
    leaveStatus: string;
    isExempt: boolean;
    employeeWorkingHours: number;
    timeStatus: string;
    shiftCode: string;
    payrollEffectiveStartDate: string;
    payrollEffectiveEndDate: string;
    insuredType: any;
    payCurrency: string;

    managerPreferredName: string;
    managerFirstName: string;
    managerLastName: string;
    employeeDepartmentName: string;

    managerAdminFirstName: string;
    managerAdminLastName: string
    managerAdminPreferredName: string;

    managerFuntionalFirstName: string;
    managerFuntionalLastName: string;
    managerFuntionalPreferredName: string;

    managerHRFirstName: string;
    managerHRLastName: string;
    managerHRPreferredName: string;

    serviceCenterFirstName: string;
    serviceCenterLastName: string;
    serviceCenterPreferredName: string;

    employeeLanguageCode: string;
    employeeLanguageName: string;

    employeeTimezoneName: string;

    employeeLocationName: string;

    employeeCurrencyName: string;
    actionButtonsList: any = [];
    showViewButton: boolean = false;
    showCacheButton: boolean = false;
    showFormButton: boolean = false;
    showEventButton: boolean = false;


   /* job: any ={};
    contact: ContactDTO =new ContactDTO();
    payroll: any ={};*/
}