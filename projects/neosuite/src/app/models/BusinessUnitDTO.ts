import { Country } from "./country";
import { UserDTO } from "./userDTO";

export class BusinessUnitDTO {

    public id: number;
    public businessUnit: string;
    public countries: Country;
    public createdBy: UserDTO;
    public updatedBy: UserDTO;
    public createdOn: Date;
    public updatedOn: Date;
    public enabled: boolean;
    public buCode: string;
    public businessunitCode: string;
    public businessunitName: string


    public constructor() {

        this.id = null;
        this.businessUnit = null;
        this.countries = null
        this.createdBy = null;
        this.updatedBy = null;
        this.createdOn = null;
        this.updatedOn = null;
        this.enabled = true;
        this.buCode = null;
        this.businessunitCode = null;
        this.businessunitName = null;

    }

}