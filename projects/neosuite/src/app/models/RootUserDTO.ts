export class RootUserDTO {

    public id: number;
    public userName: string;
    public password: string;
    public newPassword: string;

    public constructor() {
        this.id = null;
        this.userName = null;
        this.password = null;
        this.newPassword = null;
    }

}