import { ObjectId } from "mongodb";

export namespace Teams {

    export interface ITeam {
        _id?: ObjectId
        name: string
    }
}