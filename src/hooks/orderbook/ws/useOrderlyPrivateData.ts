import { useEffect, useState } from "react";
import usePrivateOrderlyWS from "./usePrivateOrderlyWS";
import { useAccountStore } from "@/stores/account";
import { useOrderbookPrivateWSDataStore } from "@/stores/orderbook/orderbookPrivateWSDataStore";
import {
  generateRequestSignatureHeader,
  getPublicKey,
} from "@/services/orderbook/utils";
import {
  Balance,
  LiquidationPushType,
  PositionPushType,
} from "@/interfaces/orderbook";
export const useOrderlyPrivateData = ({
  validAccountSig,
}: {
  validAccountSig: boolean;
}) => {
  const { sendMessage, lastJsonMessage, connectionStatus, needRefresh } =
    usePrivateOrderlyWS();
  const orderbookPrivateWSDataStore = useOrderbookPrivateWSDataStore();
  const [authPass, setAuthPass] = useState(false);
  const accountStore = useAccountStore();
  const accountId = accountStore.getAccountId();

  const [balances, setBalances] = useState<Record<string, Balance>>({});

  const [balanceTimeStamp, setBalanceTimeStamp] = useState<number>(0);

  const [futureLeverage, setFutureLeverage] = useState<number>();

  const [orderlyKey, setOrderlyKey] = useState("");

  const [requestSignature, setRequestSignature] = useState("");

  const [liquidations, setLiquidations] = useState<LiquidationPushType[]>([]);

  const [positionPush, setPositionPush] = useState<PositionPushType[]>();

  const [positionPushReceiver, setPositionPushReceiver] =
    useState<boolean>(false);
  const [positionTimeStamp, setPositionTimeStamp] = useState<number>(0);

  const [signatureTs, setSignatureTs] = useState<number>();

  useEffect(() => {
    if (!accountId || !validAccountSig) return;

    const time_stamp = Date.now();

    setSignatureTs(time_stamp);

    generateRequestSignatureHeader({
      accountId,
      time_stamp,
      url: null,
      body: null,
    }).then(setRequestSignature);
  }, [accountId, validAccountSig, connectionStatus]);

  useEffect(() => {
    if (!accountId) return;

    getPublicKey(accountId).then((res) => {
      setOrderlyKey(res);
    });
  }, [accountId]);

  useEffect(() => {
    if (!orderlyKey || !requestSignature || !validAccountSig || !signatureTs)
      return;

    const authData = {
      id: "auth",
      event: "auth",
      params: {
        timestamp: signatureTs,
        sign: requestSignature,
        orderly_key: orderlyKey,
      },
    };

    sendMessage(JSON.stringify(authData));
  }, [orderlyKey, requestSignature, accountId, validAccountSig]);

  useEffect(() => {
    if (connectionStatus !== "Open") return;

    if (
      lastJsonMessage &&
      lastJsonMessage?.event === "auth" &&
      lastJsonMessage?.success === true
    ) {
      setAuthPass(true);
    }

    if (lastJsonMessage?.event === "ping") {
      const ts = lastJsonMessage?.ts;
      sendMessage(JSON.stringify({ event: "pong", ts: Number(ts) }));
    }

    if (lastJsonMessage?.topic === "balance") {
      setBalanceTimeStamp(lastJsonMessage?.ts);
      setBalances(lastJsonMessage?.data.balances);
      orderbookPrivateWSDataStore.setBalances(lastJsonMessage?.data.balances);
      orderbookPrivateWSDataStore.setBalanceTimeStamp(lastJsonMessage?.ts);
    }

    if (lastJsonMessage?.topic === "position") {
      setPositionTimeStamp(lastJsonMessage?.ts);
      setPositionPush(lastJsonMessage?.data.positions);
      setPositionPushReceiver((b) => !b);
    }

    if (lastJsonMessage?.topic === "liquidatorliquidations") {
      setLiquidations((liquidations) => [
        lastJsonMessage?.data,
        ...liquidations,
      ]);
    }

    if (lastJsonMessage?.topic === "account") {
      setFutureLeverage(
        lastJsonMessage?.data?.accountDetail?.futuresLeverage || undefined
      );
    }
  }, [lastJsonMessage, connectionStatus]);

  // others
  useEffect(() => {
    if (!authPass) return;
    if (connectionStatus !== "Open") return;

    sendMessage(
      JSON.stringify({
        id: "balance",
        topic: "balance",
        event: "subscribe",
      })
    );

    sendMessage(
      JSON.stringify({
        id: "position",
        topic: "position",
        event: "subscribe",
      })
    );

    sendMessage(
      JSON.stringify({
        id: "account",
        topic: "account",
        event: "subscribe",
      })
    );

    sendMessage(
      JSON.stringify({
        id: "liquidatorliquidations",
        topic: "liquidatorliquidations",
        event: "subscribe",
      })
    );
  }, [authPass, connectionStatus]);

  return {
    balances,
    balanceTimeStamp,
    positionPush,
    positionTimeStamp,
    liquidations,
    setLiquidations,
    futureLeverage,
    positionPushReceiver,
    needRefresh,
  };
};
export default useOrderlyPrivateData;
