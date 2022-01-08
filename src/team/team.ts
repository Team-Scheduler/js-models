import { ObjectId } from "mongodb";
import { ICompany, IContactType, IDisplayCode } from "..";
import { ISpecialtyGroup } from "./specialties";

export interface ITeam {
    _id?: ObjectId;
    name: string;
    companies?: ICompany[];
    displayCodes?: IDisplayCode[];
    specialtyGroups?: ISpecialtyGroup[];
    contactTypes?: IContactType[];
    
}