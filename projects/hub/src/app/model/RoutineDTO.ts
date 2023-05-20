import { RoutineFieldDTO } from "./RoutineFieldDTO";

export class RoutineDTO {
    id: string;
    routineCode: string;
    routineName: string;
    fieldDto: RoutineFieldDTO;
    fields: string;
    enabled: string;
    actionButtonsList: any;
    neoConfigCode : string;

    constructor() {
        this.id = null;
        this.routineCode = null;
        this.routineName = null;
        this.fields = null;
        this.fieldDto = new RoutineFieldDTO();
        this.enabled = null;
    }
}
