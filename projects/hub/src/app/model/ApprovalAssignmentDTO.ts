import { ApprovalDTO } from "./ApprovalDTO";
import { StatusDTO } from "./StatusDTO";

export class ApprovalAssignmentDTO {
    id: number;
    tbMasApproval: ApprovalDTO = new ApprovalDTO()
    status: StatusDTO = new StatusDTO();
    assignedBy: string;
    assignedTo: string;
    delegated: boolean;
    enabled: boolean;
    level: number;
    autoApproved: boolean;
    selfApproved: boolean;
    finalApproval: boolean;

}