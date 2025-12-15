import { MyModel } from "./myModel";

export interface CustomerModel extends MyModel{
    key: number;
    name: string;
    lastName: string;
    mothersLastName: string;
    address: string;
    zipCode: number;
    phoneNumber: string;
    listPrice: string;
    rfc: string;
    keyBusiness:number;
}