import { create } from "zustand";
import { TokenMetadata } from "@/services/ft-contract";
import {
  IConnectStatus,
  TokenInfo,
  Holding,
  ClientInfo,
  PositionsType,
  SymbolInfo,
} from "@/interfaces/orderbook";
export interface IOrderbookDataStore {
  getTokensInfo: () => TokenInfo[];
  setTokensInfo: (tokensInfo: TokenInfo[]) => void;
  getSymbol: () => string;
  setSymbol: (symbol: string) => void;
  getTokensMetaMap: () => Record<string, TokenMetadata>;
  setTokensMetaMap: (tokensMetaMap: Record<string, TokenMetadata>) => void;
  getUserExists: () => boolean;
  setUserExists: (userExist: boolean) => void;
  getConnectStatus: () => IConnectStatus;
  setConnectStatus: (connectStatus: IConnectStatus) => void;
  getHoldings: () => Holding[];
  setHoldings: (holdings: Holding[]) => void;
  getMyPendingOrdersRefreshing: () => boolean;
  setYyPendingOrdersRefreshing: (myPendingOrdersRefreshing: boolean) => void;
  getValidAccountSig: () => boolean;
  setValidAccountSig: (validAccountSig: boolean) => void;
  getUserInfo: () => ClientInfo;
  setUserInfo: (userInfo: ClientInfo) => void;
  getPositions: () => PositionsType;
  setPositions: (positions: PositionsType) => void;
  getPositionTrigger: () => boolean;
  setPositionTrigger: (positionTrigger: boolean) => void;
  getAvailableSymbols: () => SymbolInfo[];
  setAvailableSymbols: (availableSymbols: SymbolInfo[]) => void;
  getNewUserTip: () => boolean;
  setNewUserTip: (newUserTip: boolean) => void;
}
export const useOrderbookDataStore = create<IOrderbookDataStore>(
  (set: any, get: any) => ({
    holdings: [],
    userInfo: null,
    positions: null,
    positionTrigger: false,
    tokensInfo: [],
    symbol: "SPOT_NEAR_USDC.e",
    tokensMetaMap: {},
    userExist: false,
    connectStatus: "status_fetching",
    availableSymbols: null,
    newUserTip: false,
    getNewUserTip: () => get().newUserTip,
    setNewUserTip: (newUserTip: boolean) => set({ newUserTip }),
    getAvailableSymbols: () => get().availableSymbols,
    setAvailableSymbols: (availableSymbols: SymbolInfo[]) =>
      set({ availableSymbols }),
    getConnectStatus: () => get().connectStatus,
    setConnectStatus: (connectStatus: IConnectStatus) => set({ connectStatus }),
    getUserExists: () => get().userExist,
    setUserExists: (userExist: boolean) =>
      set({
        userExist,
      }),
    getSymbol: () => get().symbol,
    setSymbol: (symbol: string) =>
      set({
        symbol,
      }),
    getTokensMetaMap: () => get().tokensMetaMap,
    setTokensMetaMap: (tokensMetaMap: Record<string, TokenMetadata>) =>
      set({
        tokensMetaMap,
      }),
    getTokensInfo: () => get().tokensInfo,
    setTokensInfo: (tokensInfo: TokenInfo[]) =>
      set({
        tokensInfo,
      }),
    getPositionTrigger: () => get().positionTrigger,
    setPositionTrigger: (positionTrigger: boolean) => set({ positionTrigger }),
    getPositions: () => get().positions,
    setPositions: (positions: PositionsType) => set({ positions }),
    getUserInfo: () => get().userInfo,
    setUserInfo: (userInfo: ClientInfo) => set({ userInfo }),
    myPendingOrdersRefreshing: false,
    validAccountSig: false,
    getValidAccountSig: () => get().validAccountSig,
    setValidAccountSig: (validAccountSig: boolean) => set({ validAccountSig }),
    getMyPendingOrdersRefreshing: () => get().myPendingOrdersRefreshing,
    setYyPendingOrdersRefreshing: (myPendingOrdersRefreshing: boolean) =>
      set({ myPendingOrdersRefreshing }),
    getHoldings: () => get().holdings,
    setHoldings: (holdings: Holding[]) => set({ holdings }),
  })
);
