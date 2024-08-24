import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useAccountStore } from "@/stores/account";
import getOrderlyConfig from "@/utils/orderlyConfig";
import { useMobile } from "@/utils/device";

const usePrivateOrderlyWS = () => {
  const accountStore = useAccountStore();
  const accountId = accountStore.getAccountId();
  const orderlySocketUrl =
    getOrderlyConfig().ORDERLY_WS_ENDPOINT_PRIVATE + `/${accountId}`;
  const [socketUrl, setSocketUrl] = useState(orderlySocketUrl);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const isMobile = useMobile();
  useEffect(() => {
    if (!accountId) {
      return;
    } else {
      setSocketUrl(orderlySocketUrl);
    }
  }, [accountId]);

  const { lastMessage, readyState, lastJsonMessage, sendMessage } =
    useWebSocket(!accountId ? null : socketUrl, {
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 15,
      reconnectInterval: 10000,
      share: false,
      onReconnectStop: (numAttempts) => {
        // TODO Wait for processing
        // const storedValid = localStorage.getItem(REF_ORDERLY_ACCOUNT_VALID);
        // storedValid && setNeedRefresh(true);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClose: (e) => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onError: (e) => {},
    });

  const checePongMsg = () => {
    //  find pong event in history messages
    const pongEvent = messageHistory
      .filter((msg) => msg?.event == "pong" && msg?.id === "ping-server")
      .at(-1);

    const lastPongTs = pongEvent?.ts;

    if (Date.now() - Number(lastPongTs) > 1000 * 20) {
      // TODO Wait for processing
      // const storedValid = localStorage.getItem(REF_ORDERLY_ACCOUNT_VALID);
      // storedValid && setNeedRefresh(true);
    }
  };

  useEffect(() => {
    if (isMobile) {
      document.addEventListener("visibilitychange", () => checePongMsg());
    } else {
      document.removeEventListener("visibilitychange", () => null);
    }

    return () => document.removeEventListener("visibilitychange", () => null);
  }, [isMobile]);

  useEffect(() => {
    const id = setInterval(() => {
      sendMessage(
        JSON.stringify({ event: "ping", ts: Date.now(), id: "ping-server" })
      );
    }, 5000);

    return () => clearInterval(id);
  }, []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessageHistory((prev: any) => prev.concat(lastJsonMessage));
    }
  }, [lastJsonMessage, setMessageHistory]);
  return {
    connectionStatus,
    messageHistory,
    lastMessage: lastMessage as any,
    sendMessage,
    lastJsonMessage: lastJsonMessage as any,
    needRefresh,
  };
};
export default usePrivateOrderlyWS;
