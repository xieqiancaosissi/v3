import { create } from "zustand";
import {
  Balance,
  PositionPushType,
  LiquidationPushType,
} from "@/interfaces/orderbook";
export interface IOrderbookPrivateWSDataStore {
  getNeedRefresh: () => boolean;
  setNeedRefresh: (needRefresh: boolean) => void;
  getPositionPushReceiver: () => boolean;
  setPositionPushReceiver: (positionPushReceiver: boolean) => void;
  getFutureLeverage: () => number;
  setFutureLeverage: (futureLeverage: number) => void;
  getLiquidations: () => LiquidationPushType[];
  setLiquidations: (liquidations: LiquidationPushType[]) => void;
  getPositionTimeStamp: () => number;
  setPositionTimeStamp: (positionTimeStamp: number) => void;
  getPositionPush: () => PositionPushType[];
  setPpositionPush: (positionPush: PositionPushType[]) => void;
  getBalanceTimeStamp: () => number;
  setBalanceTimeStamp: (balanceTimeStamp: number) => void;
  getBalances: () => Record<string, Balance>;
  setBalances: (balances: Record<string, Balance>) => void;
}
export const useOrderbookPrivateWSDataStore =
  create<IOrderbookPrivateWSDataStore>((set: any, get: any) => ({
    balances: {},
    balanceTimeStamp: 0,
    positionPush: undefined,
    positionTimeStamp: 0,
    liquidations: [],
    futureLeverage: undefined,
    positionPushReceiver: false,
    needRefresh: false,
    getNeedRefresh: () => get().needRefresh,
    setNeedRefresh: (needRefresh: boolean) => set({ needRefresh }),
    getPositionPushReceiver: () => get().positionPushReceiver,
    setPositionPushReceiver: (positionPushReceiver: boolean) =>
      set({ positionPushReceiver }),
    getFutureLeverage: () => get().futureLeverage,
    setFutureLeverage: (futureLeverage: number) => set({ futureLeverage }),
    getLiquidations: () => get().liquidations,
    setLiquidations: (liquidations: LiquidationPushType[]) =>
      set({ liquidations }),
    getPositionTimeStamp: () => get().positionTimeStamp,
    setPositionTimeStamp: (positionTimeStamp: number) =>
      set({ positionTimeStamp }),
    getPositionPush: () => get().positionPush,
    setPpositionPush: (positionPush: PositionPushType[]) =>
      set({ positionPush }),
    getBalanceTimeStamp: () => get().balanceTimeStamp,
    setBalanceTimeStamp: (balanceTimeStamp: number) =>
      set({ balanceTimeStamp }),
    getBalances: () => get().balances,
    setBalances: (balances: Record<string, Balance>) => set({ balances }),
  }));
