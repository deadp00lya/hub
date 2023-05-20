import { ApiRegistration } from "./ApiRegistration";

export class ListConfigDTO {
    id: number;
    listConfigName: string;
    api: ApiRegistration = new ApiRegistration();
    picklistinfo: string;
    queryName: string;
    queryCode: string;
    enabled: boolean;
    actionButtonsList: any = [];
    configFlag: any;
    status : string;
    neoConfigCode: string;
}