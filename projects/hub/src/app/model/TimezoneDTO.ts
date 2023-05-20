import { CountryDTO } from "./CountryDTO";

export class TimezoneDTO {

    id: number;
    country: CountryDTO = new CountryDTO();
    baseUtcOffset: string;
    dayLightName: string;
    displayName: string;
    enabled: boolean;
    standardName: string;
    supportsDaylightsSavingTime: boolean;
    timezoneName: string;
    approval: number;
    overwrite: boolean;
    error: string;
}