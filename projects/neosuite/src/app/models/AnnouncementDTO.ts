import { AnnouncementTypeDTO } from "./AnnouncementTypeDTO";

export class AnnouncementDTO {
	public id: number;
	public announcementTypeDTO: AnnouncementTypeDTO;
	public  subject: string;
	public  services: string
	public  affectedServices: string[];
	public  description: string;
	public  startDate: Date;
	public  endDate: Date;
	public  createdBy: string;
	public  updatedBy: string;
	public  createdOn: Date;
	public  updatedOn: Date;
    public enabled: boolean;
}