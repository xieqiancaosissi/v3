import { OrderlyWSConnection } from "@/interfaces/orderbook";
export const generateMarketDataFlow = ({ symbol }: { symbol: string }) => {
  const data: OrderlyWSConnection[] = [
    {
      id: `request-order-${symbol}`,
      event: "request",
      params: {
        symbol,
        type: "orderbook",
      },
    },
    {
      id: `${symbol}@orderbookupdate`,
      event: "subscribe",
      topic: `${symbol}@orderbookupdate`,
    },
    {
      id: `${symbol}@trade-sub`,
      event: "subscribe",
      topic: `${symbol}@trade`,
    },
    {
      id: `${symbol}@trade-req`,
      event: "request",
      topic: `${symbol}@trade`,
      params: {
        type: "trade",
        symbol,
        limit: 50,
      },
    },

    {
      id: `${symbol}@estfundingrate`,
      event: "subscribe",
      topic: `${symbol}@estfundingrate`,
    },

    {
      id: `openinterests`,
      event: "subscribe",
      topic: `openinterests`,
    },

    {
      id: `markprices`,
      event: "subscribe",
      topic: `markprices`,
      ts: Date.now(),
    },
    {
      id: `tickers`,
      event: "subscribe",
      topic: `tickers`,
    },
    {
      id: `indexprices`,
      event: "subscribe",
      topic: `indexprices`,
    },
  ];

  return data;
};
