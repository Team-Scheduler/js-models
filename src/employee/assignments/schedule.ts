import { ObjectId } from "mongodb";
import { IComparable } from "../../utilities/comparable";
import { IWorkDay, WorkDay } from "./workday";

export interface ISchedule {
    id: number;
    days_in_schedule: number;
    workdays?: IWorkDay[];
}

export class Schedule implements ISchedule, IComparable<ISchedule> {
    public id: number;
    public days_in_schedule: number;
    public workdays?: WorkDay[] | undefined;

    constructor(other?: ISchedule) {
        this.id = (other && other.id) ? other.id : 0;
        this.days_in_schedule = (other) ? other.days_in_schedule : 7;
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
        return (this.id < other.id) ? -1 : 1;
    }

    setDaysInSchedule(days: number): Error | undefined {
        if (days % 7 !== 0) {
            return new Error("Value not a multiple of seven (7)");
        }
        if (days === 0) {
            return new Error("Value cannot be zero (0)");
        }
        if (days > this.days_in_schedule) {
            for (let i = this.days_in_schedule; i < days; i++) {
                const wd = new WorkDay();
                wd.day = i;
                this.workdays?.push(wd);
            }
        } else if (days < this.days_in_schedule) {
            if (this.workdays) {
                while (this.workdays.length > days) {
                    this.workdays.pop();
                }
            }
        }
        this.days_in_schedule = days;
        return undefined;
    }

    setWorkday(day: number, wkctr: string, code: string, start: number, hours: number) {
        if (this.workdays) {
            for (let i=0; i < this.workdays.length; i++) {
                const wd = this.workdays[i];
                if (wd.day === day) {
                    wd.work_center = (wkctr !== "") 
                        ? wd.work_center = new ObjectId(wkctr) : undefined;
                    wd.work_code = code;
                    wd.start_hour = start;
                    wd.hours_worked = hours;
                    this.workdays[i] = wd;
                }
            }
        }
    }
}