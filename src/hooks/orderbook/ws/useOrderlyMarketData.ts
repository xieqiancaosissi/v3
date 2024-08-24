import { useEffect, useState } from "react";
import useOrderlyWS from "./useOrderlyWS";
import { getFundingRateSymbol } from "@/services/orderbook/perp-off-chain-api";
import { generateMarketDataFlow } from "@/services/orderbook/off-chain-ws";
import { useOrderbookWSDataStore } from "@/stores/orderbook/orderbookWSDataStore";
import {
  Orders,
  Ticker,
  MarketTrade,
  MarkPrice,
  IndexPrice,
  EstFundingrate,
  OpenInterest,
} from "@/interfaces/orderbook";
const useOrderlyMarketData = ({ symbol }: { symbol: string }) => {
  const { lastJsonMessage, sendMessage, connectionStatus } = useOrderlyWS();
  const [orders, setOrders] = useState<Orders>();
  const [ticker, setTicker] = useState<Ticker>();
  const [allTickers, setAllTickers] = useState<Ticker[]>();
  const [marketTrade, setMarketTrade] = useState<MarketTrade[]>();
  const [markPrices, setMarkPrices] = useState<MarkPrice[]>();
  const [ordersUpdate, setOrdersUpdate] = useState<Orders>();
  const [indexprices, setIndexprices] = useState<IndexPrice[]>();
  const [estFundingRate, setEstFundingRate] = useState<EstFundingrate>();
  const [openinterests, setOpeninterests] = useState<OpenInterest[]>();
  const orderbookWSDataStore = useOrderbookWSDataStore();

  useEffect(() => {
    if (connectionStatus !== "Open") return;
    const msgFlow = generateMarketDataFlow({
      symbol,
    });
    msgFlow.forEach((msg) => {
      const id = msg.id;
      if (!id) return;
      sendMessage(JSON.stringify(msg));
    });
  }, [symbol, connectionStatus]);

  useEffect(() => {
    // update orderbook
    if (connectionStatus !== "Open") return;

    if (lastJsonMessage?.event === "ping") {
      const ts = lastJsonMessage?.ts;
      sendMessage(JSON.stringify({ event: "pong", ts: Number(ts) }));
    }

    if (
      lastJsonMessage?.id === `request-order-${symbol}` &&
      lastJsonMessage?.event === "request"
    ) {
      setOrders(lastJsonMessage?.data);
      setOrdersUpdate(lastJsonMessage?.data);
      orderbookWSDataStore.setOrders(lastJsonMessage?.data);
      orderbookWSDataStore.setOrdersUpdate(lastJsonMessage?.data);
    }

    if (lastJsonMessage?.topic === `${symbol}@orderbookupdate` && !!orders) {
      setOrdersUpdate(lastJsonMessage?.data);
      orderbookWSDataStore.setOrdersUpdate(lastJsonMessage?.data);

      const asks = orders.asks;

      lastJsonMessage?.data.asks.forEach((ask: number[]) => {
        const price = ask[0];
        const quantity = ask[1];
        const index = asks.findIndex((a) => a[0] === price);

        if (index === -1) {
          asks.push(ask);
        } else {
          if (quantity === 0) {
            asks.splice(index, 1);
          } else {
            asks[index] = ask;
          }
        }
      });

      const bids = orders.bids;

      lastJsonMessage?.data.bids.forEach((bid: number[]) => {
        const price = bid[0];
        const quantity = bid[1];
        const index = bids.findIndex((a) => a[0] === price);

        if (index === -1) {
          bids.push(bid);
        } else {
          if (quantity === 0) {
            bids.splice(index, 1);
          } else {
            bids[index] = bid;
          }
        }
      });

      setOrders({
        ...orders,
        asks: asks.sort((a1, a2) => a1[0] - a2[0]),
        bids: bids.sort((b1, b2) => b2[0] - b1[0]),
        ts: lastJsonMessage?.ts,
      });
      orderbookWSDataStore.setOrders({
        ...orders,
        asks: asks.sort((a1, a2) => a1[0] - a2[0]),
        bids: bids.sort((b1, b2) => b2[0] - b1[0]),
        ts: lastJsonMessage?.ts,
      });
    }

    if (lastJsonMessage?.topic === `${symbol}@estfundingrate`) {
      setEstFundingRate(lastJsonMessage?.data);
      orderbookWSDataStore.setEstFundingRate(lastJsonMessage?.data);
    }

    if (lastJsonMessage?.topic === `openinterests`) {
      setOpeninterests(lastJsonMessage?.data);
      orderbookWSDataStore.setOpeninterests(lastJsonMessage?.data);
    }

    //  process trade
    if (
      (lastJsonMessage?.id &&
        lastJsonMessage?.id.includes(`${symbol}@trade-req`)) ||
      lastJsonMessage?.topic === `${symbol}@trade`
    ) {
      if (lastJsonMessage?.event === "request") {
        setMarketTrade(
          lastJsonMessage?.data.map((t: MarketTrade) => ({ ...t, symbol }))
        );
        orderbookWSDataStore.setMarketTrade(
          lastJsonMessage?.data.map((t: MarketTrade) => ({ ...t, symbol }))
        );
      } else
        setMarketTrade([
          {
            ...lastJsonMessage?.data,
            symbol,
            ts: lastJsonMessage?.ts,
          },
          ...(marketTrade || []),
        ]);
      orderbookWSDataStore.setMarketTrade([
        {
          ...lastJsonMessage?.data,
          symbol,
          ts: lastJsonMessage?.ts,
        },
        ...(marketTrade || []),
      ]);
    }

    if (lastJsonMessage?.topic === "tickers") {
      const tickers = lastJsonMessage?.data;

      setAllTickers(tickers);
      orderbookWSDataStore.setAllTickers(tickers);

      const ticker = tickers.find((t: Ticker) => t.symbol === symbol);

      if (ticker) {
        setTicker(ticker);
        orderbookWSDataStore.setTicker(ticker);
      }
    }

    if (lastJsonMessage?.topic === "indexprices") {
      const indexPrices = lastJsonMessage?.data;

      setIndexprices(indexPrices);
      orderbookWSDataStore.setIndexprices(indexPrices);
    }

    if (lastJsonMessage?.topic === "markprices") {
      const markPrices = lastJsonMessage?.data;

      setMarkPrices(markPrices);
      orderbookWSDataStore.setMarkPrices(markPrices);
    }
  }, [lastJsonMessage, symbol, connectionStatus]);

  // change funding rate
  useEffect(() => {
    if (!symbol) return;

    getFundingRateSymbol(symbol).then((res) => {
      setEstFundingRate({
        symbol,
        fundingRate: res.data?.est_funding_rate,
        fundingTs: res.data?.next_funding_time,
      });
      orderbookWSDataStore.setEstFundingRate({
        symbol,
        fundingRate: res.data?.est_funding_rate,
        fundingTs: res.data?.next_funding_time,
      });
    });
  }, [symbol]);

  return {
    lastJsonMessage,
    marketTrade,
    orders,
    ticker,
    markPrices,
    allTickers,
    ordersUpdate,
    openinterests,
    estFundingRate,
    indexprices,
  };
};
export default useOrderlyMarketData;
