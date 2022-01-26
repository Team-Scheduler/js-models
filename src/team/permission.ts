import { ObjectId } from "mongodb";

export interface IPermission {
    _id?: ObjectId;
    title: string;
    read?: boolean;
    write?: boolean;
    admin?: boolean;
}

export class Permission implements IPermission {
    public _id?: ObjectId | undefined;
    public title: string;
    public read?: boolean | undefined;
    public write?: boolean | undefined;
    public admin?: boolean | undefined;

    constructor(other: IPermission) {
        this._id = (other && other._id) ? other._id : undefined;
        this.title = (other) ? other.title : "";
        this.read = (other && other.read) ? other.read : false;
        this.write = (other && other.write) ? other.write : false;
        this.admin = (other && other.admin) ? other.admin : false;
    }
}