import { IComparable } from "../../utilities/comparable";

export interface ICompanyInfo {
    company_code: string;
    company_employee_id: string;
    company_alternate_id?: string;
    division?: string;
    cost_center?: string;
    rank?: string;
}

export class CompanyInfo implements ICompanyInfo {
    public company_code: string;
    public company_employee_id: string;
    public company_alternate_id?: string | undefined;
    public division?: string | undefined;
    public cost_center?: string | undefined;
    public rank?: string | undefined;

    constructor(other?: ICompanyInfo) {
        this.company_code = (other) ? other.company_code : "";
        this.company_employee_id = (other) ? other.company_employee_id : "";
        this.company_alternate_id = (other && other.company_alternate_id) 
            ? other.company_alternate_id : undefined;
        this.division = (other && other.division) ? other.division : undefined;
        this.cost_center = (other && other.cost_center) 
            ? other.cost_center : undefined;
        this.rank = (other && other.rank) ? other.rank : undefined;
    }
}

export interface IName {
    first: string;
    middle?: string;
    last: string;
    suffix?: string;
    nickname?: string;
}

export class Name implements IName {
    public first: string;
    public middle?: string | undefined;
    public last: string;
    public suffix?: string | undefined;
    public nickname?: string | undefined;

    constructor(other?: IName) {
        this.first = (other) ? other.first : "";
        this.middle = (other && other.middle) ? other.middle : undefined;
        this.last = (other) ? other.last : "";
        this.suffix = (other && other.suffix) ? other.suffix : undefined;
        this.nickname = (other && other.nickname) ? other.nickname : undefined;
    }

    fullName(): string {
        let answer = this.first;
        if (this.middle) {
            answer += ` ${this.middle}`;
        }
        answer += ` ${this.last}`;
        if (this.suffix) {
            answer += `, ${this.suffix}`;
        }
        return answer;
    }

    lastFirst(bFull?: boolean): string {
        if (bFull && this.middle) {
            return `${this.last}, ${this.first} ${this.middle}`;
        }
        return `${this.last}, ${this.first}`;
    }

    lastFirstFull(): string {
        let answer = `${this.last}, ${this.first}`;
        if (this.middle) {
            answer += ` ${this.middle}`;
        }
        return answer;
    }
}