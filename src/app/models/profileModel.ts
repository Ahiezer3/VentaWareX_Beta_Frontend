import { MyModel } from "./myModel";

export interface ProfileModel extends MyModel{
    key: number;
    name: string;
    lastName: string;
    mothersLastName: string;
    birthday: Date;
    address: string;
    zipCode: number;
    country: string;
    email: string;
    phoneNumber: string;
    firstPassword: string;
    secondPassword: string;
    password: string;
    
}