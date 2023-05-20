import { ApiRegistration } from "./ApiRegistration";

export class FieldDTO {
    tbMasApiRegistration: ApiRegistration;
    id: number;
    fieldId: number;
    mdmComponent: string;
    componentName: string;
    fieldName: string;
    fieldTitle: string;
    fieldDisplay: string
    fieldType: string;
    dataSource: string;
    sdmValue: boolean;
    sdmFieldCode: string;
    fieldCode: number;
    queryCode: string;
    path: string;
    componentId: number;
    attachment: boolean;
    enabled: boolean;
    attachmentsPaths: any[] = [];
    actionButtonsList: any = [];
}