import { MyModel } from "./myModel";

export interface SaleDetailModel extends MyModel{
    keyProduct: number;
    sku: string;
    nameProduct: string;
    listSelected: string;
    basePriceTaxes: number;
    price: number;
    priceReturn: number;
    quantity: number;
    quantityReturn: number;
    quantityPackaging: number;
    quantityRefund: number;
    return: boolean;
    iva: number;
    ieps: number;
    subtotalOriginal: number;
    subtotal: number;
    total: number;
    
    totalCost: number;
    refundAmount: number;
    packagingAmount: number;

    iepsPercentage:number;
    ivaPercentage:number;
    unityTotal:number;

    priceFormat: string;
    quantityFormat: string;
    subtotalOriginalFormat: string;
    subtotalFormat: string;
    ivaFormat: string;
    iepsFormat: string;
    totalFormat: string;
   
    totalCostFormat: string;
    refundAmountFormat: string;
    packagingAmountFormat: string | undefined;
}