import { EventsDTO } from "./EventsDTO";

export class OrgRoleConfigDTO {
    id: number;
    appName: string;
    appCode: string;
roleCode:string;
roleName:string;
  sequence:number;
component: string;
    orgCode: string;
    countryCode: string;
    businessUnitCode: String;
countryName: string;
businessUnitName: String;
    eventsDTO: EventsDTO;
actionButtonsList:any[]=[];
enabled:boolean;;
    constructor() {
        this.id = null;
        this.roleCode=null;
        this.countryName=null;
        this.businessUnitName=null;
        this.eventsDTO = new EventsDTO();
        this.roleName =null;
        this.orgCode = null;
        this.countryCode = null;
        this.businessUnitCode = null;
        this.component = null;
        this.sequence=null;
    }
}
