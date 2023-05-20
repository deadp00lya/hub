import { Client } from "./client";

export class Role {
    id: number;
    roleName: string;
    client: Client;
    roleCode: string;
    active: boolean = false;
    enabled: boolean;
}
