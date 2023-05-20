
export class SectionDTO {
    id: number;
    sectionName: string;
    onetomany: boolean = false;
    sourceKeys: string;
    source: string;
    enabled: boolean;
    actionButtonsList: any = [];
}