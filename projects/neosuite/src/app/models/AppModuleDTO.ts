import { ApplicationDTO } from "./ApplicationDTO";

export class AppModuleDTO {

    public id: number;
    public moduleName: string;
    public moduleCode: string;
    public applications: ApplicationDTO;
    public enabled: boolean;

    public constructor() {

        this.id = null;
        this.moduleName = null;
        this.moduleCode = null;
        this.applications = null;
        this.enabled = true;
    }
}