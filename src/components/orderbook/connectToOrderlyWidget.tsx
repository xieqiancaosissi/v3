import { useEffect, useMemo, useState } from "react";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
import { useAccountStore } from "@/stores/account";
import { LoadingIcon } from "@/components/common/Icons";
import ConnectConfirmModal from "./connectConfirmModal";
import { storageDeposit } from "@/services/orderbook/contract";
import { ConnnectIcon } from "@/components/menu/icons";
import { IExecutionResult } from "@/interfaces/wallet";
import failToast from "@/components/common/toast/failToast";
import {
  is_orderly_key_announced,
  is_trading_key_set,
} from "@/services/orderbook/on-chain-api";
import { announceKey, setTradingKey } from "@/services/orderbook/key_set";
import { IUiType } from "@/interfaces/orderbook";
import { RightArrowIcon } from "./icons";
import { checkConnectStatus } from "@/services/orderbook/contract";
import { getSelectedWalletId } from "@/utils/wallet";
export default function ConnectToOrderlyWidget({
  uiType,
}: {
  uiType: IUiType;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [authorization, setAuthorization] = useState<boolean>(false);
  const orderbookDataStore = useOrderbookDataStore();
  const connectStatus = orderbookDataStore.getConnectStatus();
  const accountStore = useAccountStore();
  const walletLoading = accountStore.getWalletLoading();
  const accountId = accountStore.getAccountId();
  const authorizationRequiredWalletIds = ["here-wallet", "ledger", "nightly"];
  const walletId = getSelectedWalletId();
  const needAuthorization = authorizationRequiredWalletIds.includes(walletId);
  useEffect(() => {
    if (
      connectStatus == "need_key_set" &&
      (!needAuthorization || (needAuthorization && authorization))
    ) {
      is_orderly_key_announced(accountId)
        .then(async (key_announce) => {
          if (!key_announce) {
            await announceKey();
          } else return;
        })
        .then(() => {
          is_trading_key_set(accountId).then(async (trading_key_set) => {
            if (!trading_key_set) {
              await setTradingKey();
            }
            orderbookDataStore.setConnectStatus("has_connected");
          });
        })
        .catch((e) => {
          if (needAuthorization) {
            failToast(e.message);
            setAuthorization(false);
          } else {
            console.log(e?.message);
          }
        });
    }
  }, [connectStatus, needAuthorization, authorization]);
  const isLoading = useMemo(() => {
    if (walletLoading) return true;
    if (
      accountId &&
      (connectStatus == "status_fetching" ||
        (!needAuthorization && connectStatus == "need_key_set") ||
        (needAuthorization && authorization && connectStatus == "need_key_set"))
    )
      return true;
    return false;
  }, [
    walletLoading,
    connectStatus,
    accountId,
    authorization,
    needAuthorization,
  ]);
  function closeConfirmModal() {
    setIsOpen(false);
  }
  function showConfirmModal(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  }
  function onConfirm() {
    setIsConfirmed(true);
    storageDeposit().then((res: IExecutionResult | undefined) => {
      if (!res) return;
      if (res.status == "success") {
        checkConnectStatus().then((res) => {
          orderbookDataStore.setConnectStatus(res);
        });
      } else if (res.status == "error") {
        failToast(res.errorResult?.message);
      }
    });
  }
  if (connectStatus == "has_connected") return null;
  return (
    <div className="flex justify-center items-center">
      {/* top state */}
      <div className="flex flex-col items-center w-full">
        {isLoading ? (
          <div
            className={uiType == "orderlyKey" ? "my-20" : "relative bottom-2"}
          >
            <LoadingIcon />
          </div>
        ) : (
          <div>
            {uiType == "orderlyKey" ? (
              <OrderlyKeyUI
                showConfirmModal={showConfirmModal}
                isConfirmed={isConfirmed}
                needAuthorization={needAuthorization}
                setAuthorization={setAuthorization}
              />
            ) : (
              <OrderlyAssetsUI
                showConfirmModal={showConfirmModal}
                isConfirmed={isConfirmed}
                needAuthorization={needAuthorization}
                setAuthorization={setAuthorization}
              />
            )}
          </div>
        )}
      </div>
      {/* confirm modal */}
      <ConnectConfirmModal
        onRequestClose={closeConfirmModal}
        onConfirm={onConfirm}
        isOpen={isOpen}
      />
    </div>
  );
}
function OrderlyKeyUI({
  showConfirmModal,
  isConfirmed,
  needAuthorization,
  setAuthorization,
}: any) {
  function connectAction(e: any) {
    if (needAuthorization) {
      setAuthorization(true);
    } else {
      showConfirmModal(e);
    }
  }
  return (
    <div className="flex flex-col items-center my-20">
      <ConnnectIcon />
      {isConfirmed ? (
        <div className="flex items-center gap-2 text-sm text-primaryGreen mt-10">
          <LoadingIcon />
          Connecting
        </div>
      ) : (
        <div className="text-sm text-gray-60 text-center mt-10">
          Please{" "}
          <a
            className="underline text-white cursor-pointer"
            onClick={connectAction}
          >
            connect Orderly
          </a>{" "}
          first
        </div>
      )}
    </div>
  );
}
function OrderlyAssetsUI({
  showConfirmModal,
  isConfirmed,
  needAuthorization,
  setAuthorization,
}: any) {
  function connectAction(e: any) {
    if (needAuthorization) {
      setAuthorization(true);
    } else {
      showConfirmModal(e);
    }
  }
  return (
    <div className="flex flex-col items-center">
      {isConfirmed ? (
        <div className="flex items-center gap-2 text-sm text-primaryGreen">
          <LoadingIcon />
          Connecting
        </div>
      ) : (
        <span
          className="flex items-center gap-2 text-sm text-primaryGreen cursor-pointer"
          onClick={connectAction}
        >
          Connect <RightArrowIcon />
        </span>
      )}
    </div>
  );
}
