import { HostUrlDTO } from "./HostUrlDTO";

export class ApiRegistration {

    id: number;
    hosturlId: HostUrlDTO = new HostUrlDTO();
    apiName: string
    apiCode: string
    api: string
    queryCode: string
    searchQueryCode: string;
    apiType: string
    enabled: boolean
    actionButtonsList: any = [];
    status:string;

}
