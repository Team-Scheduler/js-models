import { IComparable } from "../utilities/comparable";

export interface ISpecialty {
    code: string;
    title: string;
    description?: string
}

export class Specialty implements ISpecialty, IComparable<ISpecialty> {
    public code: string;
    public title: string;
    public description?: string | undefined;

    constructor(other?: ISpecialty) {
        this.code = (other && other.code) ? other.code : "";
        this.title = (other && other.title) ? other.title : "";
        this.description = (other && other.description) ? other.description : "";
    }

    public compareTo(other: ISpecialty): number {
        if (other.title.toLowerCase() === this.title.toLowerCase()) {
            return 0;
        }
        return (this.title.toLowerCase() < other.title.toLowerCase()) ? -1 : 1;
    }
}

export interface ISpecialtyGroup {
    code: string;
    title: string;
    areas?: ISpecialty[];
}

export class SpecialtyGroup 
    implements ISpecialtyGroup, IComparable<ISpecialtyGroup> {
    public code: string;
    public title: string;
    public areas?: Specialty[] | undefined;

    constructor(other?: ISpecialtyGroup) {
        this.code = (other && other.code) ? other.code : "";
        this.title = (other && other.title) ? other.title : "";
        this.areas = new Array();
        if (other && other.areas && this.areas) {
            other.areas.forEach(sa => {
                this.areas?.push(new Specialty(sa));
            });
            this.areas.sort((a,b) => a.compareTo(b))
        }
    }

    public compareTo(other: ISpecialtyGroup): number {
        if (other.title.toLowerCase() === this.title.toLowerCase()) {
            return 0;
        }
        return (this.title.toLowerCase() < other.title.toLowerCase()) ? -1 : 1;
    }
}

export enum SpecialtyLevels {
    NONE,
    INTRAINING,
    QUALIFIED,
    EXPERT
}