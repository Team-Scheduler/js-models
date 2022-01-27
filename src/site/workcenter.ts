import { ObjectId } from "mongodb";
import { Employee, IEmployee } from "..";
import { IComparable } from "../utilities/comparable";

export interface IPosition {
    id?: ObjectId;
    title: string;
    is_displayed: boolean;
    display_order: number;
    employees?: IEmployee[];
}

export class Position implements IPosition, IComparable<IPosition> {
    public id?: ObjectId | undefined;
    public title: string;
    public is_displayed: boolean;
    public display_order: number;
    public employees?: Employee[] | undefined;

    constructor(other?: IPosition) {
        this.id = (other && other.id) ? other.id : new ObjectId();
        this.title = (other) ? other.title : "";
        this.is_displayed = (other) ? other.is_displayed : false;
        this.display_order = (other) ? other.display_order : 0;
        this.employees = new Array();
        if (other && other.employees) {
            for (let emp of other.employees) {
                this.employees.push(new Employee(emp));
            }
        }
    }

    compareTo(other: IPosition): number {
        return (this.display_order < other.display_order) ? -1 : 1;
    }
}

export interface IShift {
    id?: ObjectId;
    title: string;
    display_order: number;
    shift_codes: string[];
    minimums: number;
    employees?: Employee[];
}

export class Shift implements IShift, IComparable<IShift> {
    public id?: ObjectId | undefined;
    public title: string;
    public display_order: number;
    public shift_codes: string[];
    public minimums: number;
    public employees?: Employee[] | undefined;

    constructor(other?: IShift) {
        this.id = (other && other.id) ? other.id : new ObjectId();
        this.title = (other) ? other.title : "";
        this.display_order = (other) ? other.display_order : 0;
        this.shift_codes = new Array();
        if (other && other.shift_codes.length > 0) {
            for (let shft of other.shift_codes) {
                this.shift_codes.push(shft);
            }
        }
        this.minimums = (other) ? other.minimums : 0;
        this.employees = new Array();
        if (other && other.employees) {
            for (let emp of other.employees) {
                this.employees.push(new Employee(emp));
            }
        }
    }

    compareTo(other: IShift): number {
        return (this.display_order < other.display_order) ? -1 : 1;
    }
}

export interface IWorkcenter {
    id?: ObjectId;
    title: string;
    display_order: number;
    positions?: IPosition[];
    shifts?: IShift[];
    employees?: IEmployee[];
}

export class Workcenter implements IWorkcenter, IComparable<IWorkcenter> {
    public id?: ObjectId | undefined;
    public title: string;
    public display_order: number;
    public positions?: IPosition[] | undefined;
    public shifts?: IShift[] | undefined;
    public employees?: IEmployee[] | undefined;

    constructor(other?: IWorkcenter) {
        this.id = (other && other.id) ? other.id : new ObjectId();
        this.title = (other) ? other.title : "";
        this.display_order = (other) ? other.display_order : 0;
        this.positions = new Array();
        if (other && other.positions) {
            for (let pos of other.positions) {
                this.positions.push(new Position(pos));
            }
        }
        this.shifts = new Array();
        if (other && other.shifts) {
            for (let shft of other.shifts) {
                this.shifts.push(new Shift(shft));
            }
        }
        this.employees = new Array();
        if (other && other.employees) {
            for (let emp of other.employees) {
                this.employees.push(new Employee(emp));
            }
        }
    }

    compareTo(other: IWorkcenter): number {
        return (this.display_order < other.display_order) ? -1 : 1;
    }

    addShift(title: string, shiftCodes: string[], mins: number) {
        let order = 0;
        if (this.shifts) {
            for (let shft of this.shifts) {
                if (shft.display_order > order) {
                    order = shft.display_order;
                }
            }
        } else {
            this.shifts = [];
        }
        const s = new Shift();
        s.display_order = order + 1;
        s.minimums = mins;
        s.shift_codes = shiftCodes;
        s.title = title;
        this.shifts.push(s);
    }

    addPosition(title: string, display: boolean) {
        let order = 0;
        if (this.positions) {
            for (let pos of this.positions) {
                if (pos.display_order > order) {
                    order = pos.display_order;
                }
            }
        } else {
            this.positions = [];
        }
        const pos = new Position();
        pos.title = title;
        pos.display_order = order + 1;
        pos.is_displayed = display;
        this.positions.push(pos);
    }
}