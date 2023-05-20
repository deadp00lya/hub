import { ComponentDTO } from "./ComponentDTO";

export class FieldMasterDTO {

    id: number;
    fieldName: string;
    fieldCode: string;
    enabled: boolean;
    tbMasComponents: ComponentDTO;
    actionButtonsList: any = [];

}
