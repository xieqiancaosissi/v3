import { Ticker } from "@/interfaces/orderbook";
import { parseSymbol } from "@/services/orderbook/utils";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
import TickerDisplayComponent from "./tickerDisplayComponent";

import { TokenIcon } from "../common";
import { TokenMetadata } from "@/services/ft-contract";
export default function SymbolLine({
  ticker,
  tokenIn,
  setShow,
}: {
  ticker: Ticker;
  tokenIn: TokenMetadata;
  setShow: (show: boolean) => void;
}) {
  const orderbookDataStore = useOrderbookDataStore();
  const { symbolFrom, symbolTo } = parseSymbol(ticker.symbol);
  const symbol = orderbookDataStore.getSymbol();
  return (
    <div
      className={`px-1.5 text-sm mb-1 cursor-pointer ${
        ticker.symbol === symbol ? "bg-gray-40" : ""
      } text-white rounded-md hover:bg-gray-40 py-1.5 flex items-center justify-between`}
      onClick={() => {
        orderbookDataStore.setSymbol(ticker.symbol);
        setShow(false);
      }}
    >
      <div className="flex items-center">
        <TokenIcon src={tokenIn?.icon} />

        <div className="ml-2 whitespace-nowrap">
          <span>{symbolFrom}</span>

          <span className="text-primaryOrderly">{` / ${symbolTo}`} </span>
        </div>
      </div>

      <div className="flex flex-col text-xs items-end">
        <span>${ticker.close}</span>
        <TickerDisplayComponent ticker={ticker} />
      </div>
    </div>
  );
}
