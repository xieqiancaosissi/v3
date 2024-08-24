import { useEffect, useState } from "react";
import Big from "big.js";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
import { useOrderbookWSDataStore } from "@/stores/orderbook/orderbookWSDataStore";
export default function useHoldings() {
  const [totalUsd, setTotalUsd] = useState<string>("0");
  const orderbookDataStore = useOrderbookDataStore();
  const orderbookWSDataStore = useOrderbookWSDataStore();
  const holding = orderbookDataStore.getHoldings();
  const markPrices = orderbookWSDataStore.getMarkPrices();
  useEffect(() => {
    if ((holding || []).length > 0 && markPrices?.length > 0) {
      getTotalUsd();
    }
  }, [JSON.stringify(holding || []), JSON.stringify(markPrices || [])]);
  function getTotalUsd() {
    const total = holding.reduce((acc, cur) => {
      const markPrice =
        markPrices?.find((item) => item.symbol === `SPOT_${cur.token}_USDC.e`)
          ?.price || 1;
      const value =
        cur.token == "USDC.e"
          ? parseFloat(cur.holding.toString())
          : parseFloat(cur.holding.toString()) * markPrice;

      return new Big(value).plus(acc);
    }, new Big(0));
    setTotalUsd(total.toFixed());
  }
  return totalUsd;
}
