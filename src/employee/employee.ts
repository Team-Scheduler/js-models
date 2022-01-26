import { ObjectId } from "mongodb";
import { IAssignment, Assignment } from './assignments/assignment';
import { IVariation, Variation } from "./assignments/variation"; 
import { ICompanyInfo, CompanyInfo, IContact, Contact, IEmployeeSpecialty, 
    EmployeeSpecialty, IName, Name} from './employeeInfo/companyInfo'; 
import { ICredentials, Credentials } from './employeeInfo/credentials';
import { ILeave, Leave, Statuses } from './leaves/leave';
import { ILeaveBalance, LeaveBalance } from './leaves/leaveBalance';
import { ILeaveRequest, LeaveRequest } from './leaves/leaveRequest';
import { IComparable } from "../utilities/comparable";
import { IWork, Work } from "./work";
import { IEmployeeLaborCode, EmployeeLaborCode, SiteLaborCode } from "../site/laborcode";
import { WorkDay } from './assignments/workday';
import { Team } from "../team/team";
import { WorkCode } from "../site/workcode";

export interface IEmployee {
    _id?: ObjectId;
    position_assigned?: ObjectId;
    assignments?: IAssignment[];
    variations?: IVariation[];
    name: IName;
    companyinfo: ICompanyInfo;
    creds: ICredentials;
    contacts?: IContact[];
    specialties?: IEmployeeSpecialty[];
    labor?: IEmployeeLaborCode[];
    leaves?: ILeave[];
    balances?: ILeaveBalance[];
    leaveRequests?: ILeaveRequest[];
    work?: IWork[];
}

export class Employee implements IEmployee, IComparable<IEmployee> {
    public _id?: ObjectId | undefined;
    public position_assigned?: ObjectId | undefined;
    public assignments?: Assignment[] | undefined;
    public variations?: Variation[] | undefined;
    public name: Name;
    public companyinfo: CompanyInfo;
    public creds: Credentials;
    public contacts?: Contact[] | undefined;
    public specialties?: EmployeeSpecialty[] | undefined;
    public labor?: EmployeeLaborCode[] | undefined;
    public leaves?: Leave[] | undefined;
    public balances?: LeaveBalance[] | undefined;
    public leaveRequests?: LeaveRequest[] | undefined;
    public work?: Work[] | undefined;
    
    constructor(other?: IEmployee) {
        this._id = (other && other._id) ? other._id : undefined;
        this.position_assigned = (other && this.position_assigned) 
            ? other.position_assigned : undefined;
        this.assignments = [];
        if (other && other.assignments) {
            for (let asgmt of other.assignments) {
                this.assignments.push(new Assignment(asgmt));
            }
        }
        this.variations = [];
        if (other && other.variations) {
            for (let vari of other.variations) {
                this.variations.push(new Variation(vari));
            }
        }
        this.name = (other) ? new Name(other.name) : new Name();
        this.creds = (other) ? new Credentials(other.creds) : new Credentials();
        this.companyinfo = (other) ? new CompanyInfo(other.companyinfo)
            : new CompanyInfo();
        this.contacts = [];
        if (other && other.contacts) {
            for (let contact of other.contacts) {
                this.contacts.push(new Contact(contact));
            }
        }
        this.specialties = [];
        if (other && other.specialties) {
            for (let spec of other.specialties) {
                this.specialties.push(new EmployeeSpecialty(spec));
            }
        }
        this.labor = [];
        if (other && other.labor) {
            for (let lc of other.labor) {
                this.labor.push(new EmployeeLaborCode(lc));
            }
        }
        this.leaves = [];
        if (other && other.leaves) {
            for (let lv of other.leaves) {
                this.leaves.push(new Leave(lv));
            }
        }
        this.balances = [];
        if (other && other.balances) {
            for (let bal of other.balances) {
                this.balances.push(new LeaveBalance(bal));
            }
        }
        this.leaveRequests = [];
        if (other && other.leaveRequests) {
            for (let lr of other.leaveRequests) {
                this.leaveRequests.push(new LeaveRequest(lr));
            }
        }
        this.work = [];
        if (other && other.work) {
            for (let wk of other.work) {
                this.work.push(new Work(wk));
            }
        }
    }

    // function used in sorting
    compareTo(other: Employee): number {
        if (this.name.last === other.name.last) {
            if (this.name.first === other.name.first) {
                if (this.name.middle === other.name.middle) {
                    if (this.name.suffix && other.name.suffix) {
                        return (this.name.suffix < other.name.suffix) ? -1 : 1;
                    } 
                    return 0;
                }
                if (this.name.middle && other.name.middle) {
                    return (this.name.middle < other.name.middle) ? -1 : 1;
                }
                return 0
            }
            return (this.name.first < other.name.first) ? -1 : 1;
        }
        return (this.name.last < other.name.last) ? -1 : 1;
    }

    // this method will be used to determine this employee's current site within
    // the team.
    getCurrentSite(start: Date, end: Date): string {
        if (this.assignments) {
            for (let i=0; i < this.assignments?.length; i++) {
                if (this.assignments[i].isActiveDuringPeriod(start, end)) {
                        return this.assignments[i].site;
                    }
            }
        }
        return "";
    }

    // this method will provide the date of the last work record from the object
    getLastWorkday(): Date {
        if (this.work) {
            this.work.sort((a,b) => a.compareTo(b));
            return this.work[this.work.length - 1].date_worked;
        }
        return new Date(0);
    }

    // this method will retrieve the workday object for the date given.  The
    // method uses the following order to determine the workday for a particular
    // date (lowest to highest precedence):
    // 1) active assignment
    // 2) an active variation for the date
    // 3) approved leaves
    // In this way the order of precedence is solidified where leaves are the
    // highest.
    // The 3rd parameter will allow the application to get the workday without
    // reference to leaves
    getWorkday(start: Date, site: string, useLeaves: boolean = true): WorkDay {
        let workday: WorkDay | undefined;
        
        if (this.assignments) {
            this.assignments.sort((a,b) => a.compareTo(b));
            for (let asgmt of this.assignments) {
                if (asgmt.isActiveOnDate(start) 
                    && asgmt.site.toLowerCase() === site.toLowerCase()) {
                    workday = asgmt.getWorkday(start);
                }
            }
        }
        if (this.variations) {
            this.variations.sort((a,b) => a.compareTo(b));
            for (let vari of this.variations) {
                if (vari.isActive(start) && vari.site.toLowerCase() === site.toLowerCase()) {
                    workday = vari.getWorkday(start);
                }
            }
        }
        if (useLeaves) {
            if (this.leaves) {
                this.leaves.sort((a,b) => a.compareTo(b));
                for (let lv of this.leaves) {
                    if (lv.leave_date === start 
                        && (lv.status === Statuses.APPROVED 
                            || lv.status === Statuses.ACTUAL)) {
                        if (!workday) {
                            workday = new WorkDay();
                        }
                        workday.day = start.getDay();
                        workday.work_code = lv.code;
                        workday.hours_worked = lv.hours;
                        workday.work_center = undefined;
                        workday.start_hour = 0;
                        workday.isLeave = true;
                    }
                }
            }
        }
        if (!workday) {
            workday = new WorkDay();
        }
        return workday;
    }

    // this method will provide the workcenter to list this employee in and is
    // based on the workcenter the employee is present at the most during the
    // period.
    getWorkcenter(start: Date, end: Date, site: string): ObjectId | undefined {
        const workcenters = new Map<ObjectId, number>();
        let current = new Date(start);
        while (current.getTime() <= end.getTime()) {
            const wd = this.getWorkday(current, site, false);
            if (wd && wd.work_center) {
                let num = workcenters.get(wd.work_center);
                if (!num) {
                    num = 0;
                }
                num++;
                workcenters.set(wd.work_center, num);
            }
            current = new Date(current.getTime() + (24 + 3600000));
        }
        let num = 0;
        let ans: ObjectId | undefined;
        const keys = workcenters.keys();
        for (let key of keys) {
            const val = workcenters.get(key);
            if (val && val > num) {
                ans = key;
                num = val;
            }
        }
        return ans;
    }

    // this method will provide the number of work hours actually worked for
    // a period of time.  An optional parameter of shiftid, default value of 
    // zero (0), will get the actual work hours for the period for the work 
    // marked for that shift.  Shift code zero will be for all, no matter the
    // shift.
    getActualWorkHours(start: Date, end: Date, chgNo: string, ext: string, 
        shiftid: number = 0): number {
        let answer: number = 0.0;
        if (this.work) {
            this.work.sort((a,b) => a.compareTo(b));
            for (let wk of this.work) {
                if (wk.date_worked.getTime() >= start.getTime() 
                    && wk.date_worked.getTime() <= end.getTime() 
                    && wk.charge_number === chgNo && wk.extension === ext 
                    && (shiftid === 0 || wk.shift_code === shiftid)) {
                    answer += wk.hours;
                }
            }
        }
        return answer;
    }

    // this method will provide the number of forecasted work hours for a period
    // of time, based on dates and charge number/extension.  If an employee is
    // assigned to a labor code, forecast hours will be assigned to that labor
    // code.  Also, we check the last work day listed in their work records so
    // that forecasts are only for dates after this last day.
    getForecastHours(start: Date, end: Date, chgNo: string, ext: string, 
        site: string, team: Team, shiftid: number = 0): number {
        let answer: number = 0.0;
        let workcodes: WorkCode[] = [];
        if (team.companies) {
            for (let co of team.companies) {
                if (co.code === this.companyinfo.company_code) {
                    if (co.workcodes) {
                        for (let wc of co.workcodes) {
                            workcodes.push(new WorkCode(wc));
                        }
                    }
                }
            }
        }
        const lastWorkday = this.getLastWorkday();
        if (end.getTime() <= lastWorkday.getTime()) {
            return 0.0;
        }
        if (this.labor) {
            for (let lc of this.labor) {
                if (lc.charge_number === chgNo && lc.extension === ext
                    && lc.start_date.getTime() <= end.getTime()
                    && lc.end_date.getTime() >= start.getTime()) {
                    let current = new Date(start);
                    if (start.getTime() <= lastWorkday.getTime()) {
                        current = new Date(lastWorkday.getTime() + (24 * 3600000));
                    }
                    if (current.getTime() < lc.start_date.getTime()) {
                        current = new Date(lc.start_date.getTime())
                    }
                    while (current.getTime() <= end.getTime() && current.getTime() <= lc.end_date.getTime()) {
                        const wd = this.getWorkday(current, site);
                        if (wd && !wd.isLeave) {
                            if (shiftid === 0) {
                                answer += wd.hours_worked;
                            }
                        } else {
                            for (let wc of workcodes) {
                                if (wc.shift_pay_code) {
                                    if (wc.shift_pay_code === shiftid) {
                                        answer += wd.hours_worked;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return answer;
    }

    // this method is used to decide whether or not to display this employee
    // based on dates, charge number/extension and some other information.
    showEmployee(start: Date, end: Date, codes: SiteLaborCode[], site: string, 
        team: Team): boolean {
        for (let lc of codes) {
            const answer = this.getActualWorkHours(start, end, lc.charge_number, 
                lc.extension) + this.getForecastHours(start, end, 
                    lc.charge_number, lc.extension, site, team);
            if (answer > 0) {
                return true;
            }
        }
        return false;
    }

    // this method is used to provide the value for a certificate of service 
    // document based on multiple labor codes for a particular date.
    getCofSHours(oDate: Date, codes: SiteLaborCode[], isExercise: boolean): string {
        let hours = 0;
        for (let lc of codes) {
            if (this.work) {
                for (let w of this.work) {
                    if (w.date_worked.getTime() === oDate.getTime() 
                    && w.charge_number === lc.charge_number
                    && w.extension === lc.extension) {
                        hours += w.hours;
                    }
                }
            }
        }
        if (hours > 0) {
            return hours.toFixed(1);
        } else if (!isExercise) {
            // look for actual leave for the period
            if (this.leaves) {
                for (let lv of this.leaves) {
                    if (lv.leave_date.getTime() === oDate.getTime()) {
                        switch (lv.code.toLowerCase()) {
                            case "v":
                            case "p":
                                return "V";
                            case "h":
                                return "H";
                            case "br":
                                return "B";
                            case "td":
                                return "T";
                            case "pl":
                                return "F";
                            case "sd":
                            case "ld":
                                return "D";
                            case "ml":
                                return "M";
                            case "j":
                                return "J";
                        }
                    }
                }
            }
        }
        return "";
    }

    // This method will return the total  hours for a period and codes
    getLeaveHours(start: Date, end: Date, chgNo: string, ext: string, 
        codes: string[]): number {
        let process = false;
        if (this.labor) {
            for (let lc of this.labor) {
                if (lc.charge_number === chgNo && lc.extension === ext) {
                    process = true;
                }
            }
        }
        if (!process) {
            return 0.0;
        }

        let current = new Date(start);
        let hours = 0;
        while (current.getTime() <= end.getTime()) {
            if (this.leaves) {
                for (let lv of this.leaves) {
                    for (let c of codes) {
                        if (c.toLowerCase() === lv.code.toLowerCase()) {
                            hours += lv.hours;
                        }
                    }
                }
            }
            current = new Date(current.getTime() + (24 * 3600000));
        }
        return hours;
    }

    // this method will determine if this employee was active during a period
    // of time.
    isActive(start: Date, end: Date): boolean {
        if (this.assignments) {
            for (let asgmt of this.assignments) {
                if (asgmt.isActiveDuringPeriod(start, end)) {
                    return true;
                }
            }
        }
        return false;
    }

    getCurrentJobTitle(oDate: Date): string {
        if (this.assignments) {
            for (let asgmt of this.assignments) {
                if (asgmt.isActiveOnDate(oDate)) {
                    return asgmt.job_title;
                }
            }
        }
        return "";
    }
}