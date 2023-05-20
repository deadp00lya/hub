export class JsonFieldDTO {
    fieldName: string;
    fieldTitle: string;
    fieldValue: string;
    fieldDisplay: string;
    fieldSource: string;
    sourceCode: string;
    fieldType: string;
    actionButtonsList: any[] = [];

    constructor() {
        this.fieldName = null;
        this.fieldTitle = null;
        this.fieldValue = null;
        this.fieldDisplay = null;
        this.fieldSource = null;
        this.sourceCode = null;
        this.fieldType = null;
    }
}
