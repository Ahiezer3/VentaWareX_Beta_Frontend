import { MyModel } from "./myModel";

export interface AuthModel extends MyModel{
    email:string;
    password:string;
}