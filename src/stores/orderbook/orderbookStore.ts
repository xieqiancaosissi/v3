import { create } from "zustand";
import { IOrderTab } from "@/interfaces/orderbook";
export interface IOrderbookStore {
  getOrderTab: () => IOrderTab;
  setOrderTab: (orderTab: IOrderTab) => void;
}
export const useOrderbookStore = create<IOrderbookStore>(
  (set: any, get: any) => ({
    orderTab: "LIMIT",
    getOrderTab: () => get().orderTab,
    setOrderTab: (orderTab: IOrderTab) => set({ orderTab }),
  })
);
