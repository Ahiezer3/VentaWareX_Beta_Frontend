
export interface ProductModel {
    key: number | null
    name: string | null;
    description: string | null;
    provider: string | null;
    provider_sku: string | null;
    category: string | null;
    measure: string | null;
    quantity: number | null;
    image: string | null;
    keyWarehouse: number | null;
    currentStock: number | null;
    currentStockReturn: number | null;
    return: boolean;
}
