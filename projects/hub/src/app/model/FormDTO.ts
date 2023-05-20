import { ApiRegistration } from "./ApiRegistration";

export class FormDTO {

    id: number;
    configurationName: string;
    fetchApi: ApiRegistration = new ApiRegistration();
    saveApi: ApiRegistration = new ApiRegistration();
    updateApi: ApiRegistration = new ApiRegistration();
    queryName: string;
    queryCode: string;
    enabled: boolean;
    formCode: string;
    formName: string;
    actionButtonsList: any = [];

}
