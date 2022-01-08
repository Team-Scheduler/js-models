import { ObjectId } from "mongodb";

export interface ISite {
    id: ObjectId;
    code: string;
    title: string;
    utc_difference: number;
}