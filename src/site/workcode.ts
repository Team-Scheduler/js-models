import { IComparable } from "../utilities/comparable";

export interface IWorkCode {
    code: string;
    starttime: number;
}

export class WorkCode implements IWorkCode, IComparable<IWorkCode> {
    public code: string;
    public starttime: number;

    constructor(other?: IWorkCode) {
        this.code = (other) ? other.code : "";
        this.starttime = (other) ? other.starttime : 8;
    }

    compareTo(other: IWorkCode): number {
        return (this.code < other.code) ? -1 : 1;
    }
}