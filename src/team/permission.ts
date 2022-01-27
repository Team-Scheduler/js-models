import { ObjectId } from "mongodb";

export enum PermissionLevel {
    employee = 0,
    site,
    team,
    master
}

export interface IPermission {
    _id?: ObjectId;
    title: string;
    level: PermissionLevel;
    read?: boolean;
    write?: boolean;
    approver?: boolean;
    admin?: boolean;
}

export class Permission implements IPermission {
    public _id?: ObjectId | undefined;
    public title: string;
    public level: PermissionLevel;
    public read?: boolean | undefined;
    public write?: boolean | undefined;
    public approver?: boolean | undefined;
    public admin?: boolean | undefined;

    constructor(other: IPermission) {
        this._id = (other && other._id) ? other._id : undefined;
        this.title = (other) ? other.title : "";
        this.level = (other) ? other.level : PermissionLevel.site;
        this.read = (other && other.read) ? other.read : false;
        this.write = (other && other.write) ? other.write : false;
        this.approver = (other && other.approver) ? other.approver : false;
        this.admin = (other && other.admin) ? other.admin : false;
    }
}