import { create } from "zustand";
import {
  Orders,
  MarketTrade,
  MarkPrice,
  IndexPrice,
  EstFundingrate,
  OpenInterest,
  Ticker,
} from "@/interfaces/orderbook";
export interface IOrderbookWSDataStore {
  getAllTickers: () => Ticker[];
  setAllTickers: (allTickers: Ticker[]) => void;
  getOrders: () => Orders;
  setOrders: (orders: Orders) => void;
  getTicker: () => Ticker;
  setTicker: (ticker: Ticker) => void;
  getMarketTrade: () => MarketTrade[];
  setMarketTrade: (marketTrade: MarketTrade[]) => void;
  getMarkPrices: () => MarkPrice[];
  setMarkPrices: (markPrices: MarkPrice[]) => void;
  getOrdersUpdate: () => Orders;
  setOrdersUpdate: (ordersUpdate: Orders) => void;
  getIndexprices: () => IndexPrice[];
  setIndexprices: (indexprices: IndexPrice[]) => void;
  getEstFundingRate: () => EstFundingrate;
  setEstFundingRate: (estFundingRate: EstFundingrate) => void;
  getOpeninterests: () => OpenInterest[];
  setOpeninterests: (openinterests: OpenInterest[]) => void;
}
export const useOrderbookWSDataStore = create<IOrderbookWSDataStore>(
  (set: any, get: any) => ({
    allTickers: [],
    orders: null,
    ticker: null,
    marketTrade: null,
    markPrices: null,
    ordersUpdate: null,
    indexprices: null,
    estFundingRate: null,
    openinterests: null,
    getOpeninterests: () => get().openinterests,
    setOpeninterests: (openinterests: OpenInterest[]) => set({ openinterests }),
    getEstFundingRate: () => get().estFundingRate,
    setEstFundingRate: (estFundingRate: EstFundingrate) =>
      set({ estFundingRate }),
    getIndexprices: () => get().indexprices,
    setIndexprices: (indexprices: IndexPrice[]) => set({ indexprices }),
    getOrdersUpdate: () => get().ordersUpdate,
    setOrdersUpdate: (ordersUpdate: Orders) => set({ ordersUpdate }),
    getMarkPrices: () => get().markPrices,
    setMarkPrices: (markPrices: MarkPrice[]) => set({ markPrices }),
    getMarketTrade: () => get().marketTrade,
    setMarketTrade: (marketTrade: MarketTrade[]) => set({ marketTrade }),
    getTicker: () => get().ticker,
    setTicker: (ticker: Ticker) => set({ ticker }),
    getOrders: () => get().orders,
    setOrders: (orders: Orders) => set({ orders }),
    getAllTickers: () => get().allTickers,
    setAllTickers: (allTickers: Ticker[]) =>
      set({
        allTickers,
      }),
  })
);
