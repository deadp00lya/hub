import { EventFormConfigurationDTO } from "./EventFormConfigurationDTO";
import { EventsDTO } from "./EventsDTO";
import { RoleConfigurationDTO } from "./RoleConfigurationDTO";

export class RoleEventMappingDTO {

    id: number;
    roleConfigMapping: RoleConfigurationDTO = new RoleConfigurationDTO();
    events: EventsDTO = new EventsDTO();
    eventformConfig: EventFormConfigurationDTO=new EventFormConfigurationDTO();
    dataInjection:string;

}
