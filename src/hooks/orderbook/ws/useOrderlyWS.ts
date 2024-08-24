import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getOrderlyWss } from "@/services/orderbook/orderbookUtils";

const useOrderlyWS = () => {
  const socketUrl = getOrderlyWss();
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const { lastMessage, readyState, lastJsonMessage, sendMessage } =
    useWebSocket(socketUrl, {
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 15,
      reconnectInterval: 10000,
      share: false,
    });
  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev: any) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  useEffect(() => {
    const id = setInterval(() => {
      sendMessage(JSON.stringify({ event: "ping", ts: Date.now(), id: "" }));
    }, 5000);

    return clearInterval(id);
  }, []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];
  return {
    connectionStatus,
    messageHistory,
    lastMessage: lastMessage as any,
    sendMessage,
    lastJsonMessage: lastJsonMessage as any,
  };
};
export default useOrderlyWS;
