import { ObjectId } from "mongodb";
import { IAssignment, ICompanyInfo, IContact, ICredentials, IEmployeeSpecialty, IName, IVariation } from "..";
import { IComparable } from "../utilities/comparable";

export interface IEmployee {
    _id?: ObjectId;
    position_assigned?: ObjectId;
    assignments?: IAssignment[];
    variations?: IVariation[];
    name: IName;
    companyinfo: ICompanyInfo;
    creds: ICredentials;
    contacts: IContact[];
    specialties?: IEmployeeSpecialty[];
}

export class Employee implements IEmployee, IComparable<IEmployee> {
    public _id?: ObjectId | undefined;
    public position_assigned?: ObjectId | undefined;
    
    constructor(other?: IEmployee) {
        this._id = (other && other._id) ? other._id : undefined;
        this.position_assigned = (other && this.position_assigned) 
            ? other.position_assigned : undefined;
    }

    compareTo(other: IEmployee): number {
        return 0;
    }
}