
import { ProductModel } from "./product.model";

export interface ProductPricesModel {
    key: number,
    keyProduct: number | undefined;
    basePrice: number;
    basePriceTaxes: number;
    listOne: number;
    listOneTaxes: number;
    listTwo: number;
    listTwoTaxes: number;
    listThree: number;
    listThreeTaxes: number;
    ieps: number;
    iva: number;
    priceReturn: number
    product: ProductModel | undefined;


    basePriceFormat: string;
    listOneFormat: string;
    listTwoFormat: string;
    listThreeFormat: string;
    iepsFormat: string;
    ivaFormat: string;
}