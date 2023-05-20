import { Country } from './country';
import { Department } from "./department";
import { BusinessUnitDTO } from "./BusinessUnitDTO";
export class FilterDTO {

    countryCode: string
    deptCode: string
    buCode: string
    isMgr: boolean;
    roleCodes : string[]
    partialSSO:boolean
    constructor() {

        this.buCode = null
        this.deptCode = null
        this.countryCode = null
        this. partialSSO=false

    }


}
