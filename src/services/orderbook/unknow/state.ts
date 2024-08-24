import { useState, useEffect } from "react";
import _ from "lodash";
import {
  SymbolInfo,
  Holding,
  Balance,
  RequestOrder,
} from "@/interfaces/orderbook";
import getOrderlyConfig from "@/utils/orderlyConfig";

import { getOrderBook, getCurrentHolding } from "../off-chain-api";
import { useAccountStore } from "@/stores/account";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";

export function useAllSymbolInfo() {
  const [availableSymbols, setAvailableSymbols] = useState<SymbolInfo[]>();
  const orderbookDataStore = useOrderbookDataStore();
  useEffect(() => {
    fetch(`${getOrderlyConfig().OFF_CHAIN_END_POINT}/v1/public/info`)
      .then((res) => {
        res.json().then((data) => {
          setAvailableSymbols(data.data.rows);
          orderbookDataStore.setAvailableSymbols(data.data.rows);
        });
      })
      .catch((e) => {
        setAvailableSymbols([
          {
            symbol: "PERP_BTC_USDC",
            quote_min: 0,
            quote_max: 100000,
            quote_tick: 0.1,
            base_min: 0.00001,
            base_max: 20,
            base_tick: 0.00001,
            min_notional: 1,
            price_range: 0.02,
            price_scope: 0.4,
            std_liquidation_fee: 0.03,
            liquidator_fee: 0.015,
            claim_insurance_fund_discount: 0.0075,
            funding_period: 8,
            cap_funding: 0.000375,
            floor_funding: -0.000375,
            interest_rate: 0.0001,
            created_time: 1684140107326,
            updated_time: 1685345968053,
            imr_factor: 0.0000002512,
            base_mmr: 0.05,
            base_imr: 0.1,
          },
        ]);
        orderbookDataStore.setAvailableSymbols([
          {
            symbol: "PERP_BTC_USDC",
            quote_min: 0,
            quote_max: 100000,
            quote_tick: 0.1,
            base_min: 0.00001,
            base_max: 20,
            base_tick: 0.00001,
            min_notional: 1,
            price_range: 0.02,
            price_scope: 0.4,
            std_liquidation_fee: 0.03,
            liquidator_fee: 0.015,
            claim_insurance_fund_discount: 0.0075,
            funding_period: 8,
            cap_funding: 0.000375,
            floor_funding: -0.000375,
            interest_rate: 0.0001,
            created_time: 1684140107326,
            updated_time: 1685345968053,
            imr_factor: 0.0000002512,
            base_mmr: 0.05,
            base_imr: 0.1,
          },
        ]);
      });
  }, []);

  return availableSymbols;
}

export function useOrderBook({
  symbol,
  openSig,
}: {
  symbol: string;
  openSig: any[];
}) {
  const [orderBook, setOrderBook] = useState<RequestOrder>();
  const accountStore = useAccountStore();
  const accountId = accountStore.getAccountId();
  useEffect(() => {
    if (openSig.every((s) => !s)) return;
    getOrderBook({
      accountId,
      symbol,
    }).then((res) => {
      setOrderBook(res.data);
    });
  }, [...openSig, symbol]);
  return orderBook;
}

export function useCurHoldings(
  validAccountSig: boolean,
  balances: Record<string, Balance>
) {
  const [holdings, setHoldings] = useState<Holding[]>();
  const accountStore = useAccountStore();
  const accountId = accountStore.getAccountId();
  const orderbookDataStore = useOrderbookDataStore();
  useEffect(() => {
    if (!accountId || !validAccountSig) return;
    getCurrentHolding({ accountId }).then((res) => {
      const list = res?.data?.holding || [];
      setHoldings(list);
      orderbookDataStore.setHoldings(list);
    });
  }, [accountId, validAccountSig]);

  useEffect(() => {
    if (!_.isEmpty(balances) && holdings) {
      const updatedHoldings = holdings.map((holding) => {
        const newBalance = balances[holding.token];

        if (newBalance) {
          holding.holding = newBalance.holding;
          holding.pending_short = newBalance.pendingShortQty;
          holding.frozen = newBalance.frozen;
        }

        return holding;
      });

      const balancesKeyList = Object.keys(balances);

      const holdingKeyList = holdings.map((h) => h.token);

      balancesKeyList.forEach((key) => {
        const notFoundBalance =
          holdingKeyList.findIndex((h) => h === key) === -1;

        if (notFoundBalance) {
          const newBalance = balances[key];

          updatedHoldings.push({
            token: key,
            holding: newBalance.holding,
            pending_short: newBalance.pendingShortQty,
            frozen: newBalance.frozen,
            updated_time: Date.now(),
          });
        }
      });

      setHoldings(updatedHoldings);
      orderbookDataStore.setHoldings(updatedHoldings);
    }
  }, [JSON.stringify(balances || {})]);
  useEffect(() => {
    const newUserTip = !!(
      validAccountSig &&
      holdings &&
      holdings.every((h) => Number(h.holding) == 0)
    );
    orderbookDataStore.setNewUserTip(newUserTip);
  }, [validAccountSig, JSON.stringify(holdings || [])]);

  return holdings;
}
