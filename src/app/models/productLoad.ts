
export interface ProductLoad {
    key: string | undefined;
    keyProduct: string | undefined;
    loadTo: string;
    loadType: string;
    currentStock: number;
    quantityLoad: number;
    newStock: number;
    dateLoad: Date;
    commentsLoad: string;
}