import { ApiRegistration } from "./ApiRegistration";

export class EventFormDTO {

    id: number;
    eventFormName: string;
    fetchApi: ApiRegistration = new ApiRegistration();;
    updateApi: ApiRegistration = new ApiRegistration();;
    queryName: string;
    queryCode: string;
    enabled: boolean;
    actionButtonsList: any = [];
}
