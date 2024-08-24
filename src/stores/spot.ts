import Big from "big.js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IOrderTab } from "@/interfaces/orderbook";
export interface ISpotStore {
  getOrderTab: () => IOrderTab;
  setOrderTab: (orderTab: IOrderTab) => void;
}

export const useSpotStore = create<ISpotStore>((set: any, get: any) => ({
  orderTab: "LIMIT",
  getOrderTab: () => get().orderTab,
  setOrderTab: (orderTab: IOrderTab) => set({ orderTab }),
}));
