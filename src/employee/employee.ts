import { ObjectId } from "mongodb";
import { IAssignment, Assignment } from './assignments/assignment';
import { IVariation, Variation } from "./assignments/variation"; 
import { ICompanyInfo, CompanyInfo, IContact, Contact, IEmployeeSpecialty, 
    EmployeeSpecialty, IName, Name} from './employeeInfo/companyInfo'; 
import { ICredentials, Credentials } from './employeeInfo/credentials';
import { ILeave, Leave } from './leaves/leave';
import { ILeaveBalance, LeaveBalance } from './leaves/leaveBalance';
import { ILeaveRequest, LeaveRequest } from './leaves/leaveRequest';
import { IComparable } from "../utilities/comparable";
import { IWork, Work } from "./work";
import { Specialty } from "../team/specialties";

export interface IEmployee {
    _id?: ObjectId;
    position_assigned?: ObjectId;
    assignments?: IAssignment[];
    variations?: IVariation[];
    name: IName;
    companyinfo: ICompanyInfo;
    creds: ICredentials;
    contacts?: IContact[];
    specialties?: IEmployeeSpecialty[];
    leaves?: ILeave[];
    balances?: ILeaveBalance[];
    leaveRequests?: ILeaveRequest[];
    work?: IWork[];
}

export class Employee implements IEmployee, IComparable<IEmployee> {
    public _id?: ObjectId | undefined;
    public position_assigned?: ObjectId | undefined;
    public assignments?: Assignment[] | undefined;
    public variations?: Variation[] | undefined;
    public name: Name;
    public companyinfo: CompanyInfo;
    public creds: Credentials;
    public contacts?: Contact[] | undefined;
    public specialties?: EmployeeSpecialty[] | undefined;
    public leaves?: Leave[] | undefined;
    public balances?: LeaveBalance[] | undefined;
    public leaveRequests?: LeaveRequest[] | undefined;
    public work?: Work[] | undefined;
    
    constructor(other?: IEmployee) {
        this._id = (other && other._id) ? other._id : undefined;
        this.position_assigned = (other && this.position_assigned) 
            ? other.position_assigned : undefined;
        this.assignments = [];
        if (other && other.assignments) {
            for (let asgmt of other.assignments) {
                this.assignments.push(new Assignment(asgmt));
            }
        }
        this.variations = [];
        if (other && other.variations) {
            for (let vari of other.variations) {
                this.variations.push(new Variation(vari));
            }
        }
        this.name = (other) ? new Name(other.name) : new Name();
        this.creds = (other) ? new Credentials(other.creds) : new Credentials();
        this.companyinfo = (other) ? new CompanyInfo(other.companyinfo)
            : new CompanyInfo();
        this.contacts = [];
        if (other && other.contacts) {
            for (let contact of other.contacts) {
                this.contacts.push(new Contact(contact));
            }
        }
        this.specialties = [];
        if (other && other.specialties) {
            for (let spec of other.specialties) {
                this.specialties.push(new EmployeeSpecialty(spec));
            }
        }
        this.leaves = [];
        if (other && other.leaves) {
            for (let lv of other.leaves) {
                this.leaves.push(new Leave(lv));
            }
        }
        this.balances = [];
        
    }

    compareTo(other: IEmployee): number {
        return 0;
    }
}