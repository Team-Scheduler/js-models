import { ObjectId } from "mongodb";
import { IComparable } from "../../utilities/comparable";

export interface IWorkDay {
    day: number;
    work_center?: ObjectId;
    start_hour: number;
    work_code: string;
    hours_worked: number;
    isLeave?: boolean;
}

export class WorkDay implements IWorkDay, IComparable<IWorkDay> {
    public day: number;
    public work_center?: ObjectId | undefined;
    public start_hour: number;
    public work_code: string;
    public hours_worked: number;
    public isLeave?: boolean;

    constructor(other?: IWorkDay) {
        this.day = (other) ? other.day : 0;
        this.work_center = (other && other.work_center) 
            ? new ObjectId(other.work_center.toString()) : undefined;
        this.start_hour = (other) ? other.start_hour : -1;
        this.work_code = (other) ? other.work_code : "";
        this.hours_worked = (other) ? other.hours_worked : 0;
        this.isLeave = (other && other.isLeave) ? other.isLeave : false;
    }

    compareTo(other: WorkDay): number {
        return (this.day < other.day) ? -1 : 1;
    }
}