import { MultifactorAuthDTO } from "./MultifactorAuthDTO";

export class Client {
    id: number
    clientName: string
    clientCode: string
    clientLogo: any;
    widgetLimit: number;
    clientSupportMail: string;
    ssoenabled: boolean;
    idpurl: string;
    enabled: boolean;
    clientUrl: string;
    partialSSO :boolean;
    multiFactorAuthDTO: MultifactorAuthDTO;
    widgetMenuView: string;
    backgroundImage:string;
}