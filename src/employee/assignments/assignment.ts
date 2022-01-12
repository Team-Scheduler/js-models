import { ObjectId } from "mongodb";
import { IComparable } from "../../utilities/comparable";
import { ISchedule, Schedule } from "./schedule";
import { WorkDay } from "./workday";

export interface IAssignment {
    id?: ObjectId;
    start_date: Date;
    end_date: Date;
    site: string;
    days_in_rotation: number;
    job_title: string;
    schedules?: ISchedule[];
}

export class Assignment implements IAssignment, IComparable<IAssignment> {
    public id?: ObjectId | undefined;
    public start_date: Date;
    public end_date: Date;
    public site: string;
    public days_in_rotation: number;
    public job_title: string;
    public schedules?: Schedule[] | undefined;

    constructor(other?: IAssignment) {
        this.id = (other && other.id) ? new ObjectId(other.id.toString()) : undefined;
        this.start_date = (other) ? new Date(other.start_date) : new Date(0);
        this.end_date = (other) ? new Date(other.end_date) : new Date(9999, 12, 31);
        this.site = (other) ? other.site : "";
        this.days_in_rotation = (other) ? other.days_in_rotation : 7;
        this.job_title = (other) ? other.job_title : "";
        this.schedules = new Array();
        if (other && other.schedules) {
            for (let sch of other.schedules) {
                this.schedules.push(new Schedule(sch));
            }
        }
    }

    compareTo(other: Assignment): number {
        if (this.start_date.getTime() === other.start_date.getTime()) {
            return (this.end_date.getTime() < other.end_date.getTime())
                ? -1 : 1;
        }
        return (this.start_date.getTime() < other.start_date.getTime()) ? -1 : 1;
    }

    addSchedule(days: number): Error | undefined {
        let schID: number = -1;
        if (this.schedules) {
            for (let sch of this.schedules) {
                if (sch.id > schID) {
                    schID = sch.id;
                }
            }
        } else {
            this.schedules = new Array();
        }
        const sch = new Schedule();
        sch.id = schID + 1;
        let err = sch.setDaysInSchedule(days);
        if (err) {
            return err;
        } else {
            this.schedules.push(sch);
        }
        return undefined;
    }

    isActiveOnDate(ckDate: Date): boolean {
        if (this.start_date.getTime() === 0) return false;
        if (this.start_date.getTime() <= ckDate.getTime() 
            && this.end_date.getTime() >= ckDate.getTime()) return true;
        return false;
    }

    isActiveDuringPeriod(start: Date, end: Date): boolean {
        if (this.start_date.getTime() === 0) return false;
        if (this.end_date.getTime() >= start.getTime() 
            && this.start_date.getTime() <= end.getTime()) return true;
        return false;
    }

    getSchedule(ckDate: Date): Schedule | undefined {
        if (this.schedules) {
            if (this.schedules.length === 0) return undefined;
            this.schedules.sort((a,b) => a.compareTo(b));
            if (this.days_in_rotation === 0) return this.schedules[0];
            let days = Math.floor((ckDate.getTime() - this.start_date.getTime()) 
                / (24 * 60 * 60 * 1000));
            let schID = Math.abs(Math.floor(days/this.days_in_rotation)) 
                % this.schedules.length;
            return this.schedules[schID];
        }
        return undefined;
    }

    getWorkday(ckDate: Date): WorkDay | undefined {
        const sched = this.getSchedule(ckDate);
        if (!sched) return undefined;
        if (sched.workdays) {
            sched.workdays.sort((a,b) => a.compareTo(b));
            let day = Math.floor((ckDate.getTime() - this.start_date.getTime()) 
                / (24 * 60 * 60 * 1000)) & sched.days_in_schedule;
            return sched.workdays[day];
        }
        return undefined;
    }

    getWorkcenterForPeriod(start: Date, end: Date): [string, number] {
        let wkctrMap = new Map<string, number>();
        if (!this.isActiveDuringPeriod(start, end)) return ["", 0]
        let current = new Date(start);

        while (current.getTime() < end.getTime()) {
            const wd = this.getWorkday(current);
            if (wd && wd.work_center && wd.start_hour >= 0) {
                if (wkctrMap.has(wd.work_center.toString())) {
                    let num = wkctrMap.get(wd.work_center.toString());
                    if (num) {
                        num++;
                        wkctrMap.set(wd.work_center.toString(), num);
                    }

                } else {
                    wkctrMap.set(wd.work_center.toString(), 1);
                }
            }
            current = new Date(current.getTime() + (24 * 60 * 60 * 1000));
        }

        let wkctr = "";
        let amount = 0;

        for (let key of wkctrMap.keys()) {
            let num = wkctrMap.get(key);
            if (num && num > amount) {
                amount = num;
                wkctr = key;
            }
        }
        return [wkctr, amount];
    }

    getStandardDailyHours(): number {
        let workhours = 0;
        if (this.schedules && this.schedules.length > 0) {
            const sched = this.schedules[0];
            if (sched.workdays) {
                for (let i=0; i < sched.workdays.length; i++ ) {
                    if (sched.workdays[i].hours_worked > workhours) {
                        workhours = sched.workdays[i].hours_worked;
                    }
                }
            }
        }
        return workhours;
    }
}