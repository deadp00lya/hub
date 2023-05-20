import { Department } from "./department";
import { BusinessUnitDTO } from "./BusinessUnitDTO";
import { Role } from "./role";
import { Country } from "./country";
import { TimezoneDTO } from "./timezonedto";
import { LanguageDTO } from "./LanguageDTO";
import { SecurityQuestionDTO } from "./SecurityQuestions";


export class UserDTO {

    assignedRoles: string;
    id: number;
    userName: string;
    employeeId: string;/*for delegated user */
    firstName: string;
    lastName: string;
    contactNumber: number;
    userMail: string;
    rCode: string;
    userImage: string;
    userBackgroundImage: string;
    password: string;
    oldPassword: string;
    answer: string;
    themeColor: string;
    timeZone: string
    other: string;
    preferredLang: string;
    empName: string;
    empIdName: string;
    widgetMenuView: string;
    passwordResetType: string;
    preferredName: string
    noOfItems: number;
    passwordReset: boolean;
    status: boolean;
    accountLocked: boolean;
    credentialsExpired: boolean;
    selected: boolean;
    mgr: boolean;
    enable: boolean;
    consent: boolean;
    selectedUser: boolean;
    userImageFlag: boolean;
    userBackgroundImageFlag: boolean;
    departmentDTO: Department;
    countryDTO: Country;
    businessUnitDTO: BusinessUnitDTO;
    timezoneDTO: TimezoneDTO;
    languageDTO: LanguageDTO;
    securityQuestion: SecurityQuestionDTO;
    roleDTO: Role;
    roles: Role[] = [];
    countries: Country[];
    departments: Department[];
    businessUnits: BusinessUnitDTO[];
    actionButtonsList: any[] = []; /* for List View UI */
    serialNumber: string;
    
    constructor() {
        this.id = null;
        this.userName = null;
        this.firstName = null;
        this.lastName = null;
        this.contactNumber = 0;
        this.userMail = null;
        this.userImage = null;
        this.userBackgroundImage = null;
        this.password = null;
        this.answer = null;
        this.themeColor = null;
        this.passwordReset = null;
        this.status = null;
        this.accountLocked = null;
        this.credentialsExpired = false;
        this.mgr = null;
        this.countryDTO = null;
        this.consent = null;
        this.enable = null;
        this.timezoneDTO = null;
        this.preferredLang = null;
        this.widgetMenuView = null;
        this.securityQuestion = null;
        this.passwordResetType = null;
        this.empName = null;
        this.empIdName = null;
        this.preferredName = null;

    }
}



