import { Role } from "./role";

export class EmployeeFeedback {
    empId: number;
    empName: string;
    project: string;
    comments: string;
    rating:number;
    mgrRating:string;
    mgrComments:string;
    role?:Role;
    
}