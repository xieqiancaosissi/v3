import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import {
  OrderlyConnectIcon,
  RegisterIcon,
  PrimartGreenLoadingIcon,
} from "./icons";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
import { useAccountStore } from "@/stores/account";
import { LoadingIcon } from "@/components/common/Icons";
import Styles from "@/components/orderbook/orderbook.module.css";
import ConnectConfirmModal from "./connectConfirmModal";
import { storageDeposit } from "@/services/orderbook/contract";
import {
  is_orderly_key_announced,
  is_trading_key_set,
} from "@/services/orderbook/on-chain-api";
import { announceKey, setTradingKey } from "@/services/orderbook/key_set";
import { useAppStore } from "@/stores/app";
import { showWalletSelectorModal } from "@/utils/wallet";
export default function ConnectToOrderly() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const orderbookDataStore = useOrderbookDataStore();
  const connectStatus = orderbookDataStore.getConnectStatus();
  const accountStore = useAccountStore();
  const walletLoading = accountStore.getWalletLoading();
  const accountId = accountStore.getAccountId();
  const appStore = useAppStore();
  useEffect(() => {
    if (connectStatus == "need_key_set") {
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
          console.log("orderly key set error", e);
        });
    }
  }, [connectStatus]);
  const isLoading = useMemo(() => {
    if (walletLoading) return true;
    if (accountId && connectStatus == "status_fetching") return true;
    return false;
  }, [walletLoading, connectStatus, accountId]);
  const isUnLogin = !walletLoading && !accountId;
  const registerText = "* Registering will require a storage deposit.";
  const connectText =
    "* You mayneed to increase the storage deposit on your Orderly account.";
  const unLoginText =
    "* This Orderbook page is a graphical user interface for trading on Orderly Network, and is provided as a convenience to users of Ref Finance. ";
  function closeConfirmModal() {
    setIsOpen(false);
  }
  function showConfirmModal() {
    setIsOpen(true);
  }
  function onConfirm() {
    setIsConfirmed(true);
    storageDeposit();
  }
  if (connectStatus == "has_connected") return null;
  return (
    <div
      className="flex justify-center fixed right-0 top-0 bg-primaryDark bg-opacity-80 border-l border-gray-80 pt-60 px-7"
      style={{
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        minHeight: "100vh",
        width: "374px",
      }}
    >
      {/* top state */}
      <div className="flex flex-col items-center w-full">
        {/* loading */}
        {isLoading ? <LoadingIcon /> : null}
        {/* unLogin */}
        {isUnLogin ? (
          <div className="flex flex-col items-center w-full">
            <OrderlyConnectIcon />
            <div
              className={twMerge(
                Styles.connectStatusButton,
                "cursor-pointer bg-primaryGreenGradient text-black"
              )}
              style={{ height: "42px", marginTop: "82px" }}
              onClick={() => {
                showWalletSelectorModal(appStore.setShowRiskModal);
              }}
            >
              Connect Wallet
            </div>
          </div>
        ) : null}
        {/* register/contect */}
        {(connectStatus == "need_register" ||
          connectStatus == "need_storage") &&
        !isConfirmed ? (
          <div className="flex flex-col items-center w-full">
            <OrderlyConnectIcon />
            <div
              className={twMerge(
                Styles.connectStatusButton,
                "cursor-pointer bg-primaryGreenGradient text-black"
              )}
              style={{ height: "42px", marginTop: "82px" }}
              onClick={showConfirmModal}
            >
              {connectStatus == "need_storage"
                ? "Connect to Orderly"
                : "Register"}
            </div>
            <div className="mt-4 text-sm text-gray-60 text-center">
              {connectStatus == "need_storage" ? connectText : registerText}
            </div>
          </div>
        ) : null}
        {/* registering */}
        {connectStatus == "need_register" && isConfirmed ? (
          <div className="flex flex-col items-center w-full">
            <OrderlyConnectIcon />
            <div className="flex items-center gap-4 mt-7">
              <RegisterIcon />
              <div className="flex flex-col text-sm text-gray-60 gap-3.5">
                <span>Deposit storage fee</span>
                <span>Register Orderly Account</span>
              </div>
            </div>
            <div
              className={twMerge(
                Styles.connectStatusButton,
                "cursor-not-allowed bg-gray-40 text-gray-50 gap-2.5"
              )}
              style={{ height: "42px", marginTop: "82px" }}
            >
              <motion.div
                animate={{
                  transform: "rotate(360deg)",
                  transition: { duration: 1, repeat: Infinity, ease: "linear" },
                }}
              >
                <PrimartGreenLoadingIcon />
              </motion.div>
              Register
            </div>
          </div>
        ) : null}

        {/* connecting / need key set */}
        {(connectStatus == "need_storage" && isConfirmed) ||
        connectStatus == "need_key_set" ? (
          <div className="flex flex-col items-center w-full">
            <OrderlyConnectIcon />
            <div
              className={twMerge(
                Styles.connectStatusButton,
                "cursor-not-allowed bg-gray-40 text-gray-50 gap-2.5"
              )}
              style={{ height: "42px", marginTop: "82px" }}
            >
              <motion.div
                animate={{
                  transform: "rotate(360deg)",
                  transition: { duration: 1, repeat: Infinity, ease: "linear" },
                }}
              >
                <PrimartGreenLoadingIcon />
              </motion.div>
              Connect to Orderly
            </div>
          </div>
        ) : null}
      </div>
      {/* bottom doc */}
      <div
        className="absolute px-6 text-gray-60 text-sm"
        style={{ bottom: "100px" }}
      >
        {isUnLogin ? (
          <div className="flex flex-col">
            <span>{unLoginText}</span>
            <a href="_" className="underline">
              Learn more.
            </a>
          </div>
        ) : null}
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
