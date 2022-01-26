import { ObjectId } from "mongodb";
import { IComparable } from "../../utilities/comparable";
import { ISchedule, Schedule } from "./schedule";
import { WorkDay } from "./workday";

export interface IVariation {
    id?: ObjectId;
    start_date: Date;
    end_date: Date;
    is_mids: boolean;
    site: string;
    schedule: ISchedule;
}

export class Variation implements IVariation, IComparable<IVariation> {
    public id?: ObjectId | undefined;
    public start_date: Date;
    public end_date: Date;
    public is_mids: boolean;
    public site: string;
    public schedule: Schedule;

    constructor(other?: IVariation) {
        this.id = (other && other.id) ? other.id : undefined;
        this.start_date = (other) ? other.start_date : new Date(0);
        this.end_date = (other) ? other.end_date : new Date(0);
        this.is_mids = (other) ? other.is_mids : false;
        this.site = (other) ? other.site : "";
        if (other) {
            this.schedule = new Schedule(other.schedule);
        } else {
            this.schedule = new Schedule();
            this.schedule.setDaysInSchedule(7);
        }
    }

    compareTo(other: Variation): number {
        if (this.start_date.getTime() === other.start_date.getTime()) {
            return (this.end_date.getTime() < other.end_date.getTime()) ? -1 : 1;
        }
        return (this.start_date.getTime() < other.start_date.getTime()) ? -1 : 1;
    }

    isActive(ckDate: Date): boolean {
        return (this.start_date.getTime() <= ckDate.getTime() 
            && this.end_date.getTime() >= ckDate.getTime());
    }

    getWorkday(ckDate: Date): WorkDay | undefined {
        if (!this.isActive(ckDate)) return undefined;

        if (!this.schedule.workdays) return undefined;
        this.schedule.workdays.sort((a,b) => a.compareTo(b));
        let baseDate = new Date(this.start_date);
        while (baseDate.getDay() !== 0) {
            baseDate = new Date(baseDate.getTime() - (24 * 60 * 60 * 1000));
        }

        let days = Math.floor((ckDate.getTime() - baseDate.getTime())
            /(24 * 60 * 60 * 1000)) % this.schedule.days_in_schedule;
        return this.schedule.workdays[days];
    }

    setWorkday(day: number, code: string, wkctr: string, start: number, hours: number) {
        if (this.schedule.workdays && day < this.schedule.workdays.length) {
            const wd = this.schedule.workdays[day];
            wd.work_center = new ObjectId(wkctr);
            wd.work_code = code;
            wd.start_hour = start;
            wd.hours_worked = hours;
            this.schedule.workdays[day] = wd;
        }
    }
}