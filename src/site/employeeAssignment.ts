import { ObjectId } from "mongodb";
import { IComparable } from "../utilities/comparable";

export interface IEmployeeAssignment {
    _id?: ObjectId;
    teamID: ObjectId;
    siteID: ObjectId;
    employeeID: ObjectId;
    start_date: Date;
    end_date?: Date;
    departure_reason?: string;
}

export class EmployeeAssignment 
    implements IEmployeeAssignment, IComparable<IEmployeeAssignment> {
    public _id?: ObjectId | undefined;
    public teamID: ObjectId;
    public siteID: ObjectId;
    public employeeID: ObjectId;
    public start_date: Date;
    public end_date?: Date | undefined;
    public departure_reason?: string | undefined;

    constructor(other?: IEmployeeAssignment) {
        this._id = (other && other._id) ? other._id : undefined;
        this.teamID = (other) ? other.teamID : new ObjectId(0);
        this.siteID = (other) ? other.siteID : new ObjectId(0);
        this.employeeID = (other) ? other.employeeID : new ObjectId(0);
        this.start_date = (other) ? other.start_date : new Date(0);
        this.end_date = (other && other.end_date) 
            ? other.end_date : new Date(9999,12,31);
        this.departure_reason = (other && other.departure_reason) 
            ? other.departure_reason : "";
    }

    compareTo(other: EmployeeAssignment): number {
        if (this.teamID === other.teamID) {
            if (this.siteID === other.siteID) {
                return (this.start_date.getTime() < other.start_date.getTime())
                    ? -1 : 1;
            }
            return (this.siteID < other.siteID) ? -1 : 1;
        }
        return (this.teamID < other.teamID) ? -1 : 1;
    }
}