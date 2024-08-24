import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useOrderbookWSDataStore } from "@/stores/orderbook/orderbookWSDataStore";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
import SymbolLine from "./SymbolLine";
import { Ticker } from "@/interfaces/orderbook";
import { parseSymbol } from "@/services/orderbook/utils";
import { SearchIcon, CloseIcon } from "@/components/common/Icons";
import { CloseButttonIcon } from "@/components/common/SelectTokenModal/Icons";

export default function SymbolSelector({
  className,
  setShow,
  show,
}: {
  className?: string;
  setShow: (show: boolean) => void;
  show: boolean;
}) {
  const [searchList, setSearchList] = useState<Ticker[]>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const orderbookDataStore = useOrderbookDataStore();
  const orderbookWSDataStore = useOrderbookWSDataStore();
  const allTickers = orderbookWSDataStore.getAllTickers();
  const allTickersSpot = allTickers?.filter(
    (t) => t.symbol.indexOf("SPOT") > -1
  );
  const tokensMetaMap = orderbookDataStore.getTokensMetaMap();
  useEffect(() => {
    if (!allTickers) return;
    const searchList = allTickersSpot
      ?.filter((t) =>
        t.symbol.toLowerCase().includes(searchValue?.toLocaleLowerCase() || "")
      )
      .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
    setSearchList(searchList);
  }, [JSON.stringify(allTickers || []), searchValue]);
  useEffect(() => {
    if (!show) {
      setSearchValue("");
    }
  }, [show]);
  return (
    <div
      className={twMerge("bg-dark-70 rounded-lg py-4", className || "")}
      // onMouseLeave={() => {}}
      style={{
        minWidth: "300px",
      }}
    >
      {/* search filed */}
      <div
        className="flex items-center justify-between gap-2 bg-black bg-opacity-40 border border-gray-90 rounded-lg mb-2 mx-4 px-3"
        style={{ height: "46px" }}
      >
        <SearchIcon />
        <input
          type="text"
          className="bg-transparent w-full text-white "
          placeholder="Search token"
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          value={searchValue}
        />
        <CloseButttonIcon
          className={`cursor-pointer ${searchValue ? "" : "hidden"}`}
          onClick={() => {
            setSearchValue("");
          }}
        />
      </div>
      {/* pair list */}
      <div
        style={{ height: "400px" }}
        className="overflow-y-auto thinDarkscrollBar px-4"
      >
        {searchList.map((t: Ticker) => {
          const { symbolFrom } = parseSymbol(t.symbol);
          return (
            <SymbolLine
              ticker={t}
              key={t.symbol}
              tokenIn={tokensMetaMap[symbolFrom]}
              setShow={setShow}
            ></SymbolLine>
          );
        })}
      </div>
    </div>
  );
}
