import { CustomerModel } from "./customerModel";
import { MyModel } from "./myModel";
import { SaleDetailModel } from "./saleDetail";

export interface SaleModel extends MyModel{
    key?: number | undefined;
    keyCustomer: number | undefined;
    listPrice: string | undefined;
    date: Date;
    totalProducts: number;
    totalReturn: number;
    quantityPackaging: number;
    quantityRefund: number;
    subtotalOriginal: number;
    subtotal: number;
    iva: number;
    ieps: number;
    total: number;
    
    totalCost: number;
    refundAmount: number;
    packagingAmount: number;
    customer?: CustomerModel | undefined;
    customerName?: string | undefined;

    dateFormat?:string;
    subtotalOriginalFormat: string;
    subtotalFormat?: string | undefined;
    ivaFormat?: string | undefined;
    iepsFormat?: string | undefined;
    totalFormat?: string | undefined;
    
    totalCostFormat: string;
    refundAmountFormat: string | undefined;
    packagingAmountFormat: string | undefined;

    details: SaleDetailModel[];

}