import { IComparable } from "../../utilities/comparable";

export interface ILeaveBalance {
    year: number;
    carryover: number;
    annual_leave: number;
}

export class LeaveBalance implements ILeaveBalance, IComparable<ILeaveBalance> {
    public year: number;
    public carryover: number;
    public annual_leave: number;

    constructor(other?: ILeaveBalance) {
        this.year = (other) ? other.year : new Date().getFullYear();
        this.carryover = (other) ? other.carryover : 0;
        this.annual_leave = (other) ? other.annual_leave : 0;
    }

    compareTo(other: LeaveBalance): number {
        return (this.year < other.year) ? -1 : 1;
    }
}