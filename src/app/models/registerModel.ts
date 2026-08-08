import { MyModel } from "./myModel";

export interface RegisterModel extends MyModel{
    name: string;
    lastName: string;
    mothersLastName: string;
    birthday: Date;
    address: string;
    zipCode: number;
    country: string;
    email: string;
    phoneNumber: string;
    password: string;
    typeUser: number;
}
