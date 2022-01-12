import { ObjectId } from "mongodb";
import { IComparable } from "../../utilities/comparable";
import { IWorkDay, WorkDay } from "./workday";

export interface ISchedule {
    id?: ObjectId;
    days_in_schedule: number;
    display_order: number;
    workdays?: IWorkDay[];
}

export class Schedule implements ISchedule, IComparable<ISchedule> {
    public id?: ObjectId | undefined;
    public days_in_schedule: number;
    public display_order: number;
    public workdays?: WorkDay[] | undefined;

    constructor(other?: ISchedule) {
        this.id = (other && other.id) 
            ? new ObjectId(other.id.toString()) : undefined;
        this.days_in_schedule = (other) ? other.days_in_schedule : 7;
        this.display_order = (other) ? other.display_order : 0;
        this.workdays = new Array();
        if (other && other.workdays) {
            for (let wd of other.workdays) {
                this.workdays.push(new WorkDay(wd));
            }
            if (this.workdays.length !== this.days_in_schedule) {
                if (this.workdays.length < this.days_in_schedule) {
                    for (let i = this.workdays.length; i < this.days_in_schedule; i++) {
                        const wd = new WorkDay();
                        wd.day = i;
                        this.workdays.push(wd);
                    }
                } else {
                    this.workdays.sort((a,b) => a.compareTo(b))
                    while (this.workdays.length > this.days_in_schedule) {
                        this.workdays.pop();
                    }
                }
            }
        } else {
            for (let i=0; i < this.days_in_schedule; i++) {
                const wd = new WorkDay();
                wd.day = i;
                this.workdays.push(wd);
            }
        }
    }

    compareTo(other: Schedule): number {
        return (this.display_order < other.display_order) ? -1 : 1;
    }
}