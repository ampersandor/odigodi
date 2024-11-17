interface BasePropertyData {
    trade_ymd: string;
    offinm: string;
    excluusear: number;
}
  
export interface RentData extends BasePropertyData {
    deposit: number;
    monthlyRent?: number;
}

export interface TradeData extends BasePropertyData {
    dealamount: number;
}

export type PropertyType = "RENT" | "TRADE";
