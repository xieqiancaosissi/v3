import { useState } from "react";
import Big from "big.js";
import SeeAll from "./seeAll";
import { useSpotStore } from "@/stores/spot";
import { NearIcon, OrderlyIcon, DepositIcon, WithdrawIcon } from "../icons";
import orderbookStyle from "../orderbook.module.css";
import AssetManagerModal from "../assetManagerModal";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
import { useOrderbookPrivateWSDataStore } from "@/stores/orderbook/orderbookPrivateWSDataStore";
import { parseSymbol } from "@/services/orderbook/utils";
import { toPrecision } from "@/utils/numbers";
import { usePerpData } from "@/services/orderbook/UserBoardPerp/state";

export default function Account() {
  const [operationType, setOperationType] = useState<"deposit" | "withdraw">();
  const orderbookDataStore = useOrderbookDataStore();
  const orderbookPrivateWSDataStore = useOrderbookPrivateWSDataStore();
  const symbol = orderbookDataStore.getSymbol();
  const tokensMetaMap = orderbookDataStore.getTokensMetaMap();
  const holdings = orderbookDataStore.getHoldings();
  const tokensInfo = orderbookDataStore.getTokensInfo();
  const balances = orderbookPrivateWSDataStore.getBalances();
  const spotStore = useSpotStore();
  const orderTab = spotStore.getOrderTab();
  const { symbolFrom, symbolTo } = parseSymbol(symbol);
  const tokenIn = tokensMetaMap[symbolFrom];
  const tokenOut = tokensMetaMap[symbolTo];
  const { freeCollateral } = usePerpData();
  const curHoldingIn = holdings?.find((h) => h.token === symbolFrom);
  const curHoldingOut = holdings?.find((h) => h.token === symbolTo);
  const tokenInHolding = curHoldingIn
    ? toPrecision(
        new Big(curHoldingIn.holding + curHoldingIn.pending_short).toString(),
        Math.min(8, tokenIn?.decimals || 8),
        false
      )
    : balances && balances[symbolFrom]?.holding;
  return (
    <div className="mt-10">
      <div className="flexBetween">
        <span className="text-lg font-bold bg-textWhiteGradient text-transparent bg-clip-text">
          Balance
        </span>
        <SeeAll />
      </div>
      <div className="bg-dark-10 bg-opacity-40 p-4 rounded-lg mt-3">
        <div>
          <div className="grid grid-cols-3 text-sm text-gray-60">
            <span>Assets</span>
            <span className="flex items-center gap-1 justify-self-center">
              <NearIcon />
              Wallet
            </span>
            <span className="flex items-center gap-1 justify-self-end">
              <OrderlyIcon />
              Available
            </span>
          </div>
          <div className="grid grid-cols-3 text-sm text-gray-60 mt-3.5">
            <span>NEAR</span>
            <span className="flex items-center gap-1 justify-self-center">
              54.678
            </span>
            <span className="flex items-center gap-1 justify-self-end">
              0.009
            </span>
          </div>
          <div className="grid grid-cols-3 text-sm text-gray-60 mt-3.5">
            <span>NEAR</span>
            <span className="flex items-center gap-1 justify-self-center">
              54.678
            </span>
            <span className="flex items-center gap-1 justify-self-end">
              0.009
            </span>
          </div>
        </div>
        {/* button areas */}
        <div className="flexBetween gap-3 mt-6">
          <div
            className={orderbookStyle.actionButton}
            onClick={() => {
              setOperationType("deposit");
            }}
          >
            Deposit
            <DepositIcon />
          </div>
          <div
            className={orderbookStyle.actionButton}
            onClick={() => {
              setOperationType("withdraw");
            }}
          >
            Withdraw
            <WithdrawIcon />
          </div>
        </div>
        <AssetManagerModal
          isOpen={!!operationType}
          onRequestClose={() => {
            setOperationType(undefined);
          }}
          type={operationType}
          onClick={(amount: string, tokenId: string) => {
            // if (!tokenId) return;
            // return depositOrderly(tokenId, amount);
          }}
          tokenId={tokenIn.id}
          tokensInfo={tokensInfo}
          freeCollateral={freeCollateral}
          curHoldingOut={curHoldingOut}
        />
      </div>
    </div>
  );
}
