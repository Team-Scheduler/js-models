import { IWorkCode, WorkCode } from "../site/workcode";
import { IComparable } from "../utilities/comparable";
import { Holiday, IHoliday } from "./holidays";

export interface ICompany {
    code: string;
    title: string;
    time_card_system: string;
    holidays?: IHoliday[];
    workcodes?: IWorkCode[];
}

export class Company implements ICompany, IComparable<ICompany> {
    public code: string;
    public title: string;
    public time_card_system: string;
    public holidays?: Holiday[];
    public workcodes?: IWorkCode[] | undefined;

    constructor(other?: ICompany) {
        this.code = (other && other.code) ? other.code : "";
        this.title = (other && other.title) ? other.title : "";
        this.time_card_system = (other && other.time_card_system) 
            ? other.time_card_system : "manual";
        this.holidays = new Array();
        if (other && other.holidays && other.holidays.length > 0 
            && this.holidays) {
            other.holidays.forEach(hol => {
                this.holidays?.push(new Holiday(hol));
            })
        }
        this.workcodes = [];
        if (other && other.workcodes) {
            for (let wc of other.workcodes) {
                this.workcodes.push(new WorkCode(wc));
            }
        }
    }

    public compareTo(other: ICompany): number {
        if (this.code === other.code) {
            return (this.title < other.title) ? -1 : 1;
        }
        return (this.code < other.code) ? -1 : 1;
    }
}