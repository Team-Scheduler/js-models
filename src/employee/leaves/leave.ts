import { ObjectId } from "mongodb";
import { IComparable } from "../../utilities/comparable";

export enum Statuses {
    REQUESTED,
    APPROVED,
    ACTUAL,
    DELETED
}

export interface ILeave {
    id?: ObjectId;
    leave_date: Date;
    code: string;
    hours: number;
    status: Statuses;
    leave_request_id?: ObjectId;
}

export class Leave implements ILeave, IComparable<ILeave> {
    public id?: ObjectId | undefined;
    public leave_date: Date;
    public code: string;
    public hours: number;
    public status: Statuses;
    public leave_request_id?: ObjectId | undefined;

    constructor(other?: ILeave) {
        this.id = (other && other.id) ? other.id : undefined;
        this.leave_date = (other) ? other.leave_date : new Date(0);
        this.code = (other) ? other.code : "";
        this.hours = (other) ? other.hours : 0;
        this.status = (other) ? other.status : Statuses.REQUESTED;
        this.leave_request_id = (other && other.leave_request_id) 
            ? other.leave_request_id : undefined;
    }

    compareTo(other: Leave): number {
        if (this.leave_date.getTime() === other.leave_date.getTime()) {
            return (this.status < other.status) ? -1 : 1;
        }
        return (this.leave_date.getTime() < other.leave_date.getTime())
            ? -1 : 1;
    }
}