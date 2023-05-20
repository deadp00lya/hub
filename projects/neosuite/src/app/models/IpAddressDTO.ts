
export class IpAddressDTO {

    public id: number;
    public address: string;
    public addressType: string;
    public enabled: boolean;


    public constructor() {
        this.address = null
        this.addressType = null;
    }

}