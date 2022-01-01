export interface IContactType {
    code: string;
    description: string;
    is_required: boolean;
    display_order: number;
}

export class ContactType implements IContactType {
    public code: string;
    public description: string;
    public is_required: boolean;
    public display_order: number;

    constructor(other?: IContactType) {
        this.code = (other && other.code) ? other.code : "";
        this.description = (other && other.description) 
            ? other.description : "";
        this.is_required = (other && other.is_required) 
            ? other.is_required : false;
        this.display_order = (other && other.display_order) 
            ? other.display_order : 1;
    }

    compareTo(other: IContactType): number {
        if (this.display_order === other.display_order) {
            return (this.code < other.code) ? -1 : 1;
        }
        return (this.display_order < other.display_order) ? -1 : 1;
    }
}