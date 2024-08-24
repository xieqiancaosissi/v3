import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IConnectStatus } from "@/interfaces/orderbook";

export interface IPersistOrderbookDataStore {
  getConnectStatusx: () => IConnectStatus;
  setConnectStatusx: (connectStatusx: IConnectStatus) => void;
}

export const usePersistOrderbookDataStore = create(
  persist(
    (set: any, get: any) => ({
      connectStatusx: "",
      getConnectStatusx: () => get().connectStatusx,
      setConnectStatusx: (connectStatusx: IConnectStatus) =>
        set({ connectStatusx }),
    }),
    {
      name: "_cached_orderbook",
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
