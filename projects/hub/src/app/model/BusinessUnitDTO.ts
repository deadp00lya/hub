import { CountryDTO } from "./CountryDTO";

export class BusinessUnitDTO {
    id: number;
    sid: number;
    pid: number;
    countryCode: string;
    country: CountryDTO = new CountryDTO;
    businessunitCode: string;
    businessunitName: string;
    overwrite: boolean;
    approval: number;
    error: string;
}