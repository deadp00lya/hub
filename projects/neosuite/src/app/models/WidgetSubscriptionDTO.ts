import { WidgetDTO } from "./WidgetDTO";

export class WidgetSubscriptionDTO {

    public id: number;

   /* private client: ClientDTO;*/
    
    public selectedWidgets :any;

    public widgets: WidgetDTO;

    public startDate: Date;

    public endDate: Date;

    public paymentStatus: string;

    public subscriptionCode: string;

    public lastPaidDate: Date;

    public paymentDueDate: Date;

    public enable: boolean;
    
    public constructor() { }
}