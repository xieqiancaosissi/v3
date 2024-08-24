import { useEffect } from "react";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
import { useAccountStore } from "@/stores/account";
import { checkConnectStatus } from "@/services/orderbook/contract";
import { get_orderly_public_key_path } from "@/utils/orderlyUtils";
import { generateTradingKeyPair } from "@/services/orderbook/utils";
export default function OrderlyKeyInit(props: any) {
  const orderbookDataStore = useOrderbookDataStore();
  const accountStore = useAccountStore();
  const accountId = accountStore.getAccountId();
  // get connect status
  useEffect(() => {
    if (accountId) {
      checkConnectStatus().then((res) => {
        orderbookDataStore.setConnectStatus(res);
      });
    }
  }, [accountId]);
  // generate trading key
  useEffect(() => {
    const pubkey = localStorage.getItem(get_orderly_public_key_path());
    if (!pubkey && accountId) {
      generateTradingKeyPair();
    }
  }, [accountId]);
  return null;
}
