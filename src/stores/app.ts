import { create } from "zustand";

interface IAppStore {
  getShowRiskModal: () => boolean;
  setShowRiskModal: (showRiskModal: boolean) => void;
  getPersonalDataUpdatedSerialNumber: () => number;
  setPersonalDataUpdatedSerialNumber: (
    personalDataUpdatedSerialNumber: number
  ) => void;
  getPersonalDataReloadSerialNumber: () => number;
  setPersonalDataReloadSerialNumber: (
    personalDataReloadSerialNumber: number
  ) => void;
}
export const useAppStore = create<IAppStore>((set: any, get: any) => ({
  showRiskModal: false,
  getShowRiskModal: () => get().showRiskModal,
  setShowRiskModal: (showRiskModal: boolean) => set({ showRiskModal }),
  personalDataUpdatedSerialNumber: 0,
  personalDataReloadSerialNumber: 0,
  getPersonalDataReloadSerialNumber: () => get().personalDataReloadSerialNumber,
  setPersonalDataReloadSerialNumber: (personalDataReloadSerialNumber: number) =>
    set({ personalDataReloadSerialNumber }),
  getPersonalDataUpdatedSerialNumber: () =>
    get().personalDataUpdatedSerialNumber,
  setPersonalDataUpdatedSerialNumber: (
    personalDataUpdatedSerialNumber: number
  ) =>
    set({
      personalDataUpdatedSerialNumber,
    }),
}));
