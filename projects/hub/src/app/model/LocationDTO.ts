import { StateDTO } from "./StateDTO";

export class LocationDTO {
    id: number;
    sid: number;
    pid: number;
    state: StateDTO = new StateDTO();
    locationName: string;
    locationCode: string;
    businessunitCode: string;
    enabled: boolean;
    approval: number;
    error: string;
    overwrite: boolean;
}