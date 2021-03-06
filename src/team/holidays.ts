import { IComparable } from "../utilities/comparable";

export interface IHoliday {
    code: string;
    title: string;
    actual_dates: Date[];
    display_order: number;
}

export class Holiday implements IHoliday, IComparable<IHoliday> {
    public code: string;
    public title: string;
    public actual_dates: Date[];
    public display_order: number;

    constructor(other?: IHoliday) {
        this.code = (other && other.code) ? other.code : "";
        this.title = (other && other.title) ? other.title : "";
        this.display_order = (other && other.display_order) ? other.display_order : 0;
        this.actual_dates = new Array();
        if (other && other.actual_dates && other.actual_dates.length > 0) {
            other.actual_dates.forEach(dt => {
                this.actual_dates.push(new Date(dt));
            });
            this.actual_dates.sort((a,b) => {
                return (a.getTime() < b.getTime()) ? -1 : 1;
            });
        }
    }

    public compareTo(other: IHoliday): number {
        if (other.display_order === this.display_order) {
            return (this.code < other.code) ? -1 : 1;
        }
        return (this.display_order < other.display_order) ? -1 : 1;
    }
}