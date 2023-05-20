export class ComponentApiDTO {
    id: number;
    componentName: string;
    fetchApi: string;
    updateApi: string;
    fetchDetailApi: string;
    enabled: boolean;
    actionButtonsList: any[] = [];
    neoConfigCode: string;
}