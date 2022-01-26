import { IComparable } from "../utilities/comparable";

export interface IWorkCode {
    code: string;
    starttime?: number;
    shift_pay_code?: number
}

export class WorkCode implements IWorkCode, IComparable<IWorkCode> {
    public code: string;
    public starttime?: number | undefined;
    public shift_pay_code?: number | undefined;

    constructor(other?: IWorkCode) {
        this.code = (other) ? other.code : "";
        this.starttime = (other && other.starttime) ? other.starttime : 8;
        this.shift_pay_code = (other && other.shift_pay_code) 
            ? other.shift_pay_code : 0;
    }

    compareTo(other: IWorkCode): number {
        return (this.code < other.code) ? -1 : 1;
    }
}