
export interface ProductLoad {
    key: number | undefined;
    keyProduct: number | undefined;
    loadTo: string;
    loadType: string;
    currentStock: number;
    quantityLoad: number;
    newStock: number;
    dateLoad: Date;
    commentsLoad: string;
}