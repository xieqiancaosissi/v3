import { create } from "zustand";
import { Holding, ClientInfo, PositionsType } from "@/interfaces/orderbook";

export interface IUnknowStore {
  getName: () => string;
  setName: (name: string) => void;
}
export const useUnknowStore = create<IUnknowStore>((set: any, get: any) => ({
  name: "",
  getName: () => get().name,
  setName: (name: string) => set({ name }),
}));
