import { create } from "zustand";

type PoolType = {
  poolListLoading: boolean;
  getPoolListLoading: () => boolean;
  setPoolListLoading: (status: boolean) => void;
  poolActiveTab: string;
  setPoolActiveTab: (tab: string) => void;
  stableAddLiqVisible: boolean;
  stableRemoveLiqVisible: boolean;
  setStableAddLiqVisible: (status: boolean) => void;
  setStableRemoveLiqVisible: (status: boolean) => void;
};
export const usePoolStore = create<PoolType>((set, get) => ({
  poolListLoading: true,
  getPoolListLoading: () => get().poolListLoading,
  setPoolListLoading: (poolListLoading: boolean) => {
    set({ poolListLoading });
  },
  poolActiveTab: "classic",
  setPoolActiveTab: (poolActiveTab: string) => {
    set({ poolActiveTab });
  },
  stableAddLiqVisible: false,
  stableRemoveLiqVisible: false,
  setStableAddLiqVisible: (stableAddLiqVisible: boolean) => {
    set({ stableAddLiqVisible });
  },
  setStableRemoveLiqVisible: (stableRemoveLiqVisible: boolean) => {
    set({ stableRemoveLiqVisible });
  },
}));
