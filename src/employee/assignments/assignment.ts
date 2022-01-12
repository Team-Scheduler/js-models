import { ObjectId } from "mongodb";
import { ISchedule } from "./schedule";

export interface IAssigment {
    id?: ObjectId;
    start_date: Date;
    end_date: Date;
    site: string;
    days_in_rotation: number;
    job_title: string;
    schedules?: ISchedule[];
}