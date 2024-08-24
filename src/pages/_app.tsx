import { useEffect, useState } from "react";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/router";
import { IntlProvider } from "react-intl";
import type { AppProps } from "next/app";
import LoadingBar from "react-top-loading-bar";
import Modal from "react-modal";
import dynamic from "next/dynamic";
import getConfig from "../utils/config";
import { ALL_STABLE_POOL_IDS } from "@/services/swap/swapConfig";
import LedgerTransactionModal from "@/components/common/ledger/ledgerTransactionModal";
import "@/components/common/ModalDefaultStyle";
import "@/components/modalGAPrivacy/modalGAPrivacy.css";
import "@/components/customModal/customModal.css";
import RpcList from "@/components/rpc";
import { useAccountStore } from "@/stores/account";
import { addUserWallet } from "@/services/indexer";
import { ThemeProvider as _ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";
const Footer = dynamic(() => import("../components/footer"), { ssr: false });
const ModalGAPrivacy = dynamic(
  () => import("@/components/modalGAPrivacy/modalGAPrivacy"),
  { ssr: false }
);
const ToastContainerEle = dynamic(() => import("../components/common/Toast"), {
  ssr: false,
});
const RiskModal = dynamic(
  () => import("../components/riskCheckModal/WalletRiskCheckBoxModal"),
  {
    ssr: false,
  }
);
const Menu = dynamic(() => import("../components/menu"), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const accountStore = useAccountStore();
  const accountId = accountStore.getAccountId();
  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(30);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });
  }, []);
  useEffect(() => {
    UIInit();
    DBInit();
  }, []);
  useEffect(() => {
    if (accountId) {
      const selectedWalletId =
        window.selector?.store?.getState()?.selectedWalletId;
      if (selectedWalletId) {
        addUserWallet({
          account_id: accountId,
          wallet_address: selectedWalletId,
        });
      }
    }
  }, [accountId]);
  function UIInit() {
    Modal.setAppElement("#root");
  }
  function DBInit() {
    const myWorker = new Worker(new URL("../db/worker.ts", import.meta.url), {
      type: "module",
    });
    sendWorkerData(myWorker);
  }
  function sendWorkerData(myWorker: Worker) {
    const config = getConfig();
    myWorker.postMessage({
      config,
      ALL_STABLE_POOL_IDS,
    });
  }
  return (
    <IntlProvider messages={{}} locale={"en"}>
      <LoadingBar
        color="#9EFF00"
        height={3}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="flex flex-col bg-primaryDark min-h-screen">
        <Menu />
        <div className="flex-grow lg:mt-20 xsm:mt-10">
          <_ThemeProvider theme={original}>
            <NextUIProvider>
              <Component {...pageProps} />
            </NextUIProvider>
          </_ThemeProvider>
        </div>
        <RpcList />
        <Footer />
        <ToastContainerEle />
        {/* <ModalGAPrivacy /> */}
        <RiskModal />
        <LedgerTransactionModal />
      </div>
    </IntlProvider>
  );
}
