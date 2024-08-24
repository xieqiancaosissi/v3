import { create } from "zustand";
import { Holding } from "@/interfaces/orderbook";
export const useOrderlyBalancesStore = create((set, get: any) => ({
  balances: [],
  getBalances: () => get().balances,
  setBalances: (balances: Holding[]) => set({ balances }),
}));
