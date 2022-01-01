export interface IHoliday {
    code: string;
    title: string;
    actual_dates: Date[];
    display_order: number;
}

export class Holiday implements IHoliday {
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
            })
        }
    }
}