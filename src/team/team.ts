import { ObjectId } from "mongodb";
import { Company, ContactType, DisplayCode, ICompany, IContactType, IDisplayCode } from "..";
import { ISpecialtyGroup, SpecialtyGroup } from "./specialties";

export interface ITeam {
    _id?: ObjectId;
    name: string;
    companies?: ICompany[];
    displayCodes?: IDisplayCode[];
    specialtyGroups?: ISpecialtyGroup[];
    contactTypes?: IContactType[];
}

export class Team implements ITeam {
    public _id?: ObjectId | undefined;
    public name: string;
    public companies?: ICompany[] | undefined;
    public displayCodes?: IDisplayCode[] | undefined;
    public specialtyGroups?: ISpecialtyGroup[] | undefined;
    public contactTypes?: IContactType[] | undefined;

    constructor(other: ITeam) {
        this._id = (other && other._id) ? other._id : undefined;
        this.name = (other) ? other.name : "";
        this.companies = []
        if (other && other.companies) {
            for (let co of other.companies) {
                this.companies.push(new Company(co));
            }
        }
        this.displayCodes = [];
        if (other && other.displayCodes) {
            for (let dc of other.displayCodes) {
                this.displayCodes.push(new DisplayCode(dc));
            }
        }
        this.specialtyGroups = [];
        if (other && other.specialtyGroups) {
            for (let sg of other.specialtyGroups) {
                this.specialtyGroups.push(new SpecialtyGroup(sg));
            }
        }
        this.contactTypes = [];
        if (other && other.contactTypes) {
            for (let ct of other.contactTypes) {
                this.contactTypes.push(new ContactType(ct));
            }
        }
    }
}