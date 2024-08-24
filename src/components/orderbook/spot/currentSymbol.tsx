import { useEffect, useState } from "react";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
import SymbolSelector from "./SymbolSelector";
import { TokenIcon } from "../common";
import { ArrowDownIcon } from "@/components/swap/icons";
import { parseSymbol } from "@/services/orderbook/utils";

export default function CurrentSymbol() {
  const [show, setShow] = useState<boolean>(false);
  const orderbookDataStore = useOrderbookDataStore();
  const tokensMetaMap = orderbookDataStore.getTokensMetaMap();
  const symbol = orderbookDataStore.getSymbol();
  const { symbolFrom, symbolTo } = parseSymbol(symbol);
  const symbolFromToken = tokensMetaMap[symbolFrom];
  const symbolToToken = tokensMetaMap[symbolTo];
  useEffect(() => {
    const clickEvent = (e: any) => {
      const path = e.composedPath();
      const el = path.find((el: any) => el.id == "symbolContainer");
      if (!el) {
        setShow(false);
      }
    };
    document.addEventListener("click", clickEvent);
    return () => {
      document.removeEventListener("click", clickEvent);
    };
  }, []);
  function switchStatus() {
    setShow(!show);
  }
  return (
    <div className="relative select-none" id="symbolContainer">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={switchStatus}
      >
        <div className="flex items-center">
          <TokenIcon src={symbolFromToken?.icon} size={7} />
          <TokenIcon src={symbolToToken?.icon} size={7} className="-ml-1.5" />
        </div>
        <div className="flex items-center text-xl text-white font-bold">
          {symbolFrom}/{symbolTo}
        </div>
        <ArrowDownIcon
          className={`${
            show ? "transform rotate-180 text-primaryGreen" : "text-white "
          }`}
        />
      </div>
      <SymbolSelector
        className={`absolute top-10 left-0 ${show ? "" : "hidden"}`}
        setShow={setShow}
        show={show}
      />
    </div>
  );
}
