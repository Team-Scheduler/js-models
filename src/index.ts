import { IHoliday as _IHoliday, Holiday as _Holiday } from "team/holidays";
import { ICompany as _ICompany, Company as _Company } from "team/company";
import { IContactType as _IContactType, ContactType as _ContactType } from "team/contacts";
import { IDisplayCode as _IDC, DisplayCode as _DC } from "team/displaycode";

export namespace Teams {
    export type IHoliday = _IHoliday;
    export const Holiday = _Holiday;
    export type ICompany = _ICompany;
    export const Company = _Company;
    export type IContactType = _IContactType;
    export const ContactType = _ContactType;
    export type IDisplayCode = _IDC;
    export const DisplayCode = _DC;
}