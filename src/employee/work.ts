import { IComparable } from "../utilities/comparable";

export interface IWork {
    date_worked: Date;
    company_id: string;
    charge_number: string;
    extension: string;
    hours: number;
    shift_code: number;
}

export class Work implements IWork, IComparable<IWork> {
    public date_worked: Date;
    public company_id: string;
    public charge_number: string;
    public extension: string;
    public hours: number;
    public shift_code: number;

    constructor(other?: IWork) {
        this.date_worked = (other) ? new Date(other.date_worked) : new Date();
        this.company_id = (other) ? other.company_id : "";
        this.charge_number = (other) ? other.charge_number : "";
        this.extension = (other) ? other.extension : "";
        this.hours = (other) ? other.hours : 0;
        this.shift_code = (other) ? other.shift_code : 1;
    }

    compareTo(other: Work): number {
        if (this.date_worked.getTime() === other.date_worked.getTime()) {
            if (this.company_id === other.company_id) {
                if (this.charge_number === other.charge_number) {
                    if (this.extension === other.extension) {
                        return (this.shift_code < other.shift_code) ? -1 : 1;
                    }
                    return (this.extension < other.extension) ? -1 : 1;
                }
                return (this.charge_number < other.charge_number) ? -1 : 1;
            }
            return (this.company_id < other.company_id) ? -1 : 1;
        }
        return (this.date_worked.getTime() < other.date_worked.getTime()) ? -1 : 1;
    }
}