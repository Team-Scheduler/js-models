import { ObjectId } from "mongodb";
import { IComparable } from "../../utilities/comparable";
import { Leave, Statuses } from "./leave";

export interface ILeaveRequestComment {
    comment_date: Date;
    comment: string;
}

export class LeaveRequestComment 
    implements ILeaveRequestComment, IComparable<ILeaveRequestComment> {
    public comment_date: Date;
    public comment: string;

    constructor(other?: ILeaveRequestComment) {
        this.comment_date = (other) ? other.comment_date : new Date();
        this.comment = (other) ? other.comment : "";
    }

    compareTo(other: LeaveRequestComment): number {
        return (this.comment_date.getTime() < other.comment_date.getTime()) 
            ? -1 : 1;
    }
}

export interface ILeaveRequest {
    id?: ObjectId;
    date_of_request: Date;
    site_id: ObjectId;
    start_date: Date;
    end_date: Date;
    delete_request?: Date;
    updated_at?: Date;
    status: Statuses;
    comments?: LeaveRequestComment[];
    days?: Leave[];
    employeeID?: ObjectId;
}

export class LeaveRequest implements ILeaveRequest, IComparable<ILeaveRequest> {
    public id?: ObjectId | undefined;
    public date_of_request: Date;
    public site_id: ObjectId;
    public start_date: Date;
    public end_date: Date;
    public delete_request?: Date | undefined;
    public updated_at?: Date | undefined;
    public status: Statuses;
    public comments?: LeaveRequestComment[] | undefined;
    public days?: Leave[] | undefined;
    public employeeID?: ObjectId | undefined;

    constructor(other?: ILeaveRequest) {
        this.id = (other && other.id) ? other.id : undefined;
        this.date_of_request = (other) ? other.date_of_request : new Date();
        this.site_id = (other) ? other.site_id : new ObjectId("");
        this.start_date = (other) ? other.start_date : new Date();
        this.end_date = (other) ? other.end_date : new Date();
        this.delete_request = (other && other.delete_request) 
            ? other.delete_request : undefined;
        this.updated_at = (other && other.updated_at) 
            ? other.updated_at : undefined;
        this.status = (other) ? other.status : Statuses.REQUESTED;
        this.comments = new Array();
        if (other && other.comments && other.comments.length > 0) {
            for (let cmt of other.comments) {
                this.comments.push(new LeaveRequestComment(cmt));
            }
        }
        this.days = new Array();
        if (other && other.days && other.days.length > 0) {
            for (let day of other.days) {
                this.days.push(new Leave(day));
            }
        }
        this.employeeID = (other && other.employeeID) ? other.employeeID : undefined;
    }

    compareTo(other: LeaveRequest): number {
        if (this.start_date.getTime() === other.start_date.getTime()) {
            if (this.date_of_request.getTime() === other.date_of_request.getTime()) {
                return (this.end_date.getTime() < other.end_date.getTime()) 
                    ? -1 : 1;
            }
            return (this.date_of_request.getTime() < other.date_of_request.getTime())
                ? -1 : 1;
        }
        return (this.start_date.getTime() < other.start_date.getTime()) ? -1 : 1;
    }

    setDates(start: Date, end: Date) {
        if (start.getTime() > end.getTime()) {
            let temp = start;
            start = end;
            end = temp;
        }
        this.start_date = start;
        this.end_date = end;
        this.status = Statuses.REQUESTED;
        this.setDaysAfterChange();
    }

    setStartDate(start: Date) {
        this.start_date = start;
        if (this.end_date.getTime() < start.getTime()) {
            this.end_date = start;
        }
        this.status = Statuses.REQUESTED;
        this.setDaysAfterChange();
    }

    setEndDate(end: Date) {
        this.end_date = end;
        if (this.start_date.getTime() > end.getTime()) {
            this.start_date = end;
        }
        this.status = Statuses.REQUESTED;
        this.setDaysAfterChange();
    }

    private setDaysAfterChange() {
        // get rid of leave dates not included in the date range
        if (this.days) {
            for (let i = this.days?.length - 1; i >= 0; i--) {
                if (this.days[i].leave_date.getTime() < this.start_date.getTime()
                || this.days[i].leave_date.getTime() > this.end_date.getTime()) {
                    this.days.splice(i , 1);
                }
            }
        } else {
            this.days = new Array();
        }

        // now step through the days from start to end and add if not already
        // present in the array.
        let current = new Date(this.start_date);
        while (current.getTime() <= this.end_date.getTime()) {
            let found = false;
            for (let i=0; i < this.days.length && !found; i++) {
                if (this.days[i].leave_date.getTime() === current.getTime()) {
                    found = true;
                }
            }
            if (!found) {
                const lv = new Leave();
                lv.leave_date = current;
                lv.code = "";
                lv.hours = 0;
                this.days.push(lv);
            }
            current = new Date(current.getTime() + (24 * 60 * 60 * 1000));
        }

        // sort the days array to put them in date order
        this.days.sort((a,b) => a.compareTo(b));
    }

    setDay(day: Date, code: string, hours: number): boolean {
        let found = false;
        if (this.days) {
            for (let i=0; i < this.days?.length && !found; i++) {
                if (this.days[i].leave_date.getTime() === day.getTime()) {
                    found = true;
                    this.days[i].code = code;
                    this.days[i].hours = hours;
                }
            }
        }
        return found
    }
}