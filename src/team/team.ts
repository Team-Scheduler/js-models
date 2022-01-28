import { ObjectId } from "mongodb";
import { Company, ContactType, DisplayCode, ICompany, IContactType, IDisplayCode } from "..";
import { IPermission, Permission } from "./permission";
import { ISpecialtyGroup, SpecialtyGroup } from "./specialties";
import { ISite, Site } from "../site/site";
import { IWriteable } from "../utilities/writable";

export interface ITeam {
    _id?: ObjectId;
    name: string;
    companies?: ICompany[];
    displayCodes?: IDisplayCode[];
    specialtyGroups?: ISpecialtyGroup[];
    contactTypes?: IContactType[];
    permissions?: IPermission[];
    sites?: ISite[];
}

export class Team implements ITeam, IWriteable<Team> {
    public _id?: ObjectId | undefined;
    public name: string;
    public companies?: ICompany[] | undefined;
    public displayCodes?: IDisplayCode[] | undefined;
    public specialtyGroups?: ISpecialtyGroup[] | undefined;
    public contactTypes?: IContactType[] | undefined;
    public permissions?: IPermission[] | undefined;
    public sites?: Site[];

    constructor(other?: ITeam) {
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
        this.permissions = [];
        if (other && other.permissions) {
            for (let p of other.permissions) {
                const perm = new Permission(p);
                if (!perm._id) {
                    perm._id = new ObjectId();
                }
                this.permissions.push(new Permission(perm));
            }
        }
        this.sites = [];
        if (other && other.sites) {
            for (let site of other.sites) {
                this.sites.push(new Site(site));
            }
        }
    }

    createWriteable(): Team {
        const team = new Team();
        team._id = this._id;
        team.name = this.name;
        team.companies = [];
        if (this.companies) {
            for (let co of this.companies) {
                team.companies.push(new Company(co));
            }
        }
        team.displayCodes = [];
        if (this.displayCodes) {
            for (let dc of this.displayCodes) {
                team.displayCodes.push(new DisplayCode(dc));
            }
        }
        team.specialtyGroups = [];
        if (this.specialtyGroups) {
            for (let sg of this.specialtyGroups) {
                team.specialtyGroups.push(new SpecialtyGroup(sg));
            }
        }
        team.contactTypes = [];
        if (this.contactTypes) {
            for (let ct of this.contactTypes) {
                team.contactTypes.push(new ContactType(ct));
            }
        }
        team.permissions = [];
        if (this.permissions) {
            for (let p of this.permissions) {
                team.permissions.push(new Permission(p));
            }
        }
        team.sites = [];
        if (this.sites) {
            for (let s of this.sites) {
                const site = new Site(s);
                if (!site.id) {
                    site.id = new ObjectId();
                }
                team.sites.push(site.createWriteable());
            }
        }
        return team;
    }
}