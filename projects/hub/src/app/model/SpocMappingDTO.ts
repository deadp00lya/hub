import { SpocRegionDTO } from "./SpocRegionDTO";

export class SpocMappingDTO {
    eventRoleId: number;
    formRoleId: number;
    spocs: SpocRegionDTO[] = [];
    neoConfigCode: string
}