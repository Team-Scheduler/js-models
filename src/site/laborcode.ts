import { IComparable } from "../utilities/comparable";

export interface ILaborCode {
    charge_number: string;
    extension: string;
    company_id: string;
}

export interface ISiteLaborCode extends ILaborCode {
    division: string;
    clin: string;
    slin: string;
    location: string;
    wbs: string;
    minimum: number;
    no_employee_placecard: string;
    contract_hours_per_employee: number;
    is_exercise: boolean;
    start_date: Date;
    end_date: Date;
}

export class EmployeeLaborCode implements ILaborCode, IComparable<ILaborCode> {
    public charge_number: string;
    public extension: string;
    public company_id: string;

    constructor(other?: ILaborCode) {
        this.charge_number = (other) ? other.charge_number : "";
        this.extension = (other) ? other.extension : "";
        this.company_id = (other) ? other.company_id : "";
    }

    compareTo(other: EmployeeLaborCode): number {
        if (this.charge_number === other.charge_number) {
            return (this.extension < other.extension) ? -1 : 1;
        }
        return (this.charge_number < other.charge_number) ? -1 : 1;
    }
}

export class SiteLaborCode implements ISiteLaborCode, IComparable<ILaborCode> {
    public charge_number: string;
    public extension: string;
    public company_id: string;
    public division: string;
    public clin: string;
    public slin: string;
    public location: string;
    public wbs: string;
    public minimum: number;
    public no_employee_placecard: string;
    public contract_hours_per_employee: number;
    public is_exercise: boolean;
    public start_date: Date;
    public end_date: Date;

    constructor(other?: ISiteLaborCode) {
        this.charge_number = (other) ? other.charge_number : "";
        this.extension = (other) ? other.extension : "";
        this.company_id = (other) ? other.company_id : "";
        this.division = (other) ? other.division : "";
        this.clin = (other) ? other.clin : "";
        this.slin = (other) ? other.slin : "";
        this.location = (other) ? other.location : "";
        this.wbs = (other) ? other.wbs : "";
        this.minimum = (other) ? other.minimum : 0;
        this.no_employee_placecard = (other) ? other.no_employee_placecard : "VACANT";
        this.contract_hours_per_employee = (other) ? other.contract_hours_per_employee : 0.0;
        this.is_exercise = (other) ? other.is_exercise : false;
        this.start_date = (other) ? other.start_date : new Date(0);
        this.end_date = (other) ? other.end_date : new Date(0);
    }

    compareTo(other: SiteLaborCode): number {
        if (this.charge_number === other.charge_number) {
            return (this.extension < other.extension) ? -1 : 1;
        }
        return (this.charge_number < other.charge_number) ? -1 : 1;
    }
}