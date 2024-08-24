import { KeyPair, utils } from "near-api-js";
import BN from "bn.js";
import Big from "big.js";
import {
  orderly_storage_deposit,
  user_deposit_native_token,
  deposit_exact_token,
  user_request_withdraw,
  storage_balance_of,
  storage_balance_bounds,
  get_cost_of_announce_key,
  user_account_exists,
  is_orderly_key_announced,
  storage_cost_of_token_balance,
  storage_balance_of_orderly,
  is_trading_key_set,
  user_request_settlement,
} from "./on-chain-api";
import {
  getNormalizeTradingKey,
  toNonDivisibleNumber,
  getNearMobileWalletKeyPairObject,
} from "./utils";
import {
  Transaction,
  keyStore,
  near,
  nearKeypom,
  keyStoreKeypom,
  ORDERLY_ASSET_MANAGER,
  getFTmetadata,
} from "./near";
import getOrderlyConfig from "@/utils/orderlyConfig";
import { registerAccountOnToken } from "@/services/creator/token";
import { ftViewFunction } from "@/services/ft-contract";
import { executeMultipleTransactions } from "@/utils/near";
import getConfig from "@/utils/config";
import { getAccountId } from "@/utils/wallet";
import { ledgerTipTrigger } from "@/components/common/ledger/ledger";
export const REF_ORDERLY_NEW_USER_TIP = "REF_ORDERLY_NEW_USER_TIP_KEY";

export const storageDeposit = async () => {
  const accountId = getAccountId();
  const functionCallList: any = [];

  const transactions: Transaction[] = [];

  const user_exists = await user_account_exists(accountId);

  const storage_balance = await storage_balance_of(accountId);

  const min_amount = await storage_balance_bounds();

  // TODO Wait for processing
  if (!user_exists) {
    localStorage.setItem(REF_ORDERLY_NEW_USER_TIP, "1");
  }

  if (
    !user_exists ||
    storage_balance === null ||
    new Big(storage_balance.total || 0).lt(min_amount.min)
  ) {
    const deposit_functionCall_register = orderly_storage_deposit(
      accountId,
      utils.format.formatNearAmount(min_amount.min),
      true
    );
    transactions.push({
      receiverId: ORDERLY_ASSET_MANAGER,
      functionCalls: [deposit_functionCall_register],
    });
  }

  if (
    new Big(storage_balance?.available || "0").lt(
      new Big(utils.format.parseNearAmount("0.01")!)
    )
  ) {
    const deposit_functionCall_announce_key = orderly_storage_deposit(
      accountId,
      "0.01"
    );
    functionCallList.push(deposit_functionCall_announce_key);

    transactions.push({
      receiverId: ORDERLY_ASSET_MANAGER,
      functionCalls: [deposit_functionCall_announce_key],
    });
  }

  if (transactions.length === 0) return;
  return executeMultipleTransactions(transactions, false);
};

export const checkConnectStatus = async () => {
  const accountId = getAccountId();
  const user_exists = await user_account_exists(accountId);
  const storage_balance = await storage_balance_of(accountId);
  const min_amount = await storage_balance_bounds();
  const isAnnounceKey = !user_exists
    ? false
    : await is_orderly_key_announced(accountId);
  const isTradingKeySet = !user_exists
    ? false
    : await is_trading_key_set(accountId);

  if (isAnnounceKey && isTradingKeySet) return "has_connected";
  if (
    !user_exists ||
    storage_balance === null ||
    new Big(storage_balance.total || 0).lt(min_amount.min)
  ) {
    return "need_register";
  }

  if (
    new Big(storage_balance?.available || "0").lt(
      new Big(utils.format.parseNearAmount("0.01")!)
    )
  ) {
    return "need_storage";
  }
  return "need_key_set";
};
