export class EventFormConfigurationDTO {

    id: number;
    eventFormName: string;
    fetchApi: string;
    updateApi: string;
    queryName: string;
    queryCode: string;
    enabled: boolean;
    actionButtonsList: any = [];
}
