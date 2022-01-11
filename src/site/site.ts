import { ObjectId } from "mongodb";
import { IEmployee, ISiteLaborCode, IWorkcenter, SiteLaborCode, Workcenter, WorkCode } from "..";
import { IComparable } from "../utilities/comparable";
import { IWorkCode } from "./workcode";

export interface ISite {
    id?: ObjectId;
    code: string;
    title: string;
    utc_difference: number;
    work_codes?: IWorkCode[];
    labor_codes?: ISiteLaborCode[];
    work_centers?: IWorkcenter[];
    employees?: IEmployee[];
}

export class Site implements ISite, IComparable<ISite> {
    public id?: ObjectId | undefined;
    public code: string;
    public title: string;
    public utc_difference: number;
    public work_codes?: IWorkCode[] | undefined;
    public labor_codes?: ISiteLaborCode[] | undefined;
    public work_centers?: IWorkcenter[] | undefined;
    public employees?: IEmployee[] | undefined;

    constructor(other?: ISite) {
        this.id = (other && other.id) ? other.id : undefined;
        this.code = (other) ? other.code : "";
        this.title = (other) ? other.title : "";
        this.utc_difference = (other) ? other.utc_difference : 0;
        this.work_codes = new Array();
        if (other && other.work_codes) {
            for (let wc of other.work_codes) {
                this.work_codes.push(new WorkCode(wc));
            }
        }
        this.labor_codes = new Array();
        if (other && other.labor_codes) {
            for (let lc of other.labor_codes) {
                this.labor_codes.push(new SiteLaborCode(lc));
            }
        }
        this.work_centers = new Array();
        if (other && other.work_centers) {
            for (let wc of other.work_centers) {
                this.work_centers.push(new Workcenter(wc));
            }
        }
    }

    compareTo(other: ISite): number {
        if (this.code === other.code) {
            return (this.title < other.title) ? -1 : 1;
        }
        return (this.code < other.code) ? -1 : 1;
    }
}