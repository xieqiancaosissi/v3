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
import { getAccountId } from "@/utils/wallet";
export const REF_ORDERLY_NEW_USER_TIP = "REF_ORDERLY_NEW_USER_TIP_KEY";

const signAndSendTransactions = async (transactions: Transaction[]) => {
  return executeMultipleTransactions(transactions);
};

// @ts-ignore
export let contract;

const storageDeposit = async () => {
  const accountId = getAccountId();
  const functionCallList: any = [];

  const transactions: Transaction[] = [];

  const user_exists = await user_account_exists(accountId);

  const storage_balance = await storage_balance_of(accountId);

  const min_amount = await storage_balance_bounds();

  const deposit_functionCall_register = orderly_storage_deposit(
    accountId,
    utils.format.formatNearAmount(min_amount.min),
    true
  );

  const deposit_functionCall_announce_key = orderly_storage_deposit(
    accountId,
    "0.01"
  );

  if (!user_exists) {
    localStorage.setItem(REF_ORDERLY_NEW_USER_TIP, "1");
  }

  if (
    !user_exists ||
    storage_balance === null ||
    new Big(storage_balance.total || 0).lt(min_amount.min)
  ) {
    transactions.push({
      receiverId: ORDERLY_ASSET_MANAGER,
      functionCalls: [deposit_functionCall_register],
    });
  }

  if (
    !user_exists ||
    new Big(storage_balance?.available || "0").lt(
      new Big(utils.format.parseNearAmount("0.01")!)
    )
  ) {
    functionCallList.push(deposit_functionCall_announce_key);

    transactions.push({
      receiverId: ORDERLY_ASSET_MANAGER,
      functionCalls: [deposit_functionCall_announce_key],
    });
  }

  if (transactions.length === 0) return;

  return signAndSendTransactions(transactions);
};

const checkStorageDeposit = async (accountId: string) => {
  const functionCallList: any = [];

  const user_exists = await user_account_exists(accountId);

  const storage_balance = await storage_balance_of(accountId);

  const min_amount = await storage_balance_bounds();

  const isAnnounceKey = !user_exists
    ? false
    : await is_orderly_key_announced(accountId);

  const isTradingKeySet = !user_exists
    ? false
    : await is_trading_key_set(accountId);

  if (isAnnounceKey && isTradingKeySet) return true;

  const announce_key_amount = await get_cost_of_announce_key();

  const deposit_functionCall_register = orderly_storage_deposit(
    accountId,
    utils.format.formatNearAmount(min_amount.min)
  );

  const deposit_functionCall_announce_key = orderly_storage_deposit(
    accountId,
    utils.format.formatNearAmount(announce_key_amount)
  );
  if (
    !user_exists ||
    storage_balance === null ||
    new Big(storage_balance.total || 0).lt(min_amount.min)
  ) {
    functionCallList.push(deposit_functionCall_register);
  }

  if (
    !user_exists ||
    new Big(storage_balance?.available || "0").lt(
      new Big(utils.format.parseNearAmount("0.01")!)
    )
  ) {
    functionCallList.push(deposit_functionCall_announce_key);
  }

  if (functionCallList.length === 0) return true;

  return false;
};

const depositNEAR = async (amount: string) => {
  const transactions: Transaction[] = [];
  const account_id = window.accountId;
  if (!account_id) return;

  const storageBound = await storage_cost_of_token_balance();

  const balance = await storage_balance_of(account_id);

  if (
    balance === null ||
    new Big(storageBound).gt(new Big(balance.available))
  ) {
    transactions.push({
      receiverId: ORDERLY_ASSET_MANAGER,
      functionCalls: [
        orderly_storage_deposit(
          account_id,
          utils.format.formatNearAmount(storageBound),
          false
        ),
      ],
    });
  }
  transactions.push({
    receiverId: ORDERLY_ASSET_MANAGER,
    functionCalls: [await user_deposit_native_token(amount)],
  });

  return signAndSendTransactions(transactions);
};

const depositFT = async (token: string, amount: string) => {
  const transactions: Transaction[] = [];

  const metaData = await getFTmetadata(token);

  const account_id = window.accountId;
  if (!account_id) return;

  const storageBound = await storage_cost_of_token_balance();

  const balance = await storage_balance_of(account_id);

  if (
    balance === null ||
    new Big(storageBound).gt(new Big(balance.available))
  ) {
    transactions.push({
      receiverId: ORDERLY_ASSET_MANAGER,
      functionCalls: [
        orderly_storage_deposit(
          account_id,
          utils.format.formatNearAmount(storageBound),
          false
        ),
      ],
    });
  }

  transactions.push({
    receiverId: token,
    functionCalls: [
      await deposit_exact_token(
        toNonDivisibleNumber(metaData.decimals, amount)
      ),
    ],
  });

  return signAndSendTransactions(transactions);
};

const depositOrderly = async (token: string, amount: string) => {
  if (token === "near" || token === "NEAR") {
    return depositNEAR(amount);
  } else {
    return depositFT(token, amount);
  }
};

const withdrawOrderly = async (token: string, amount: string) => {
  const transactions: Transaction[] = [];

  if (!window.accountId) {
    return;
  }

  if (token.toLocaleLowerCase() !== "near") {
    const registeredOrderly = await storage_balance_of_orderly(token);

    if (!registeredOrderly) {
      transactions.push({
        receiverId: token,
        functionCalls: [
          {
            methodName: "storage_deposit",
            args: {
              receiver_id: getOrderlyConfig().ORDERLY_ASSET_MANAGER,
              msg: "",
            },
            gas: "30000000000000",
            amount: "0.00125",
          },
        ],
      });
    }

    const registeredAccount = await ftViewFunction(token, {
      methodName: "storage_balance_of",
      args: {
        account_id: window.accountId,
      },
    });

    if (!registeredAccount) {
      transactions.push({
        receiverId: token,
        functionCalls: [registerAccountOnToken()],
      });
    }
  }

  const account_id = window.accountId;
  if (!account_id) return;

  const storageBound = await storage_cost_of_token_balance();

  const balance = await storage_balance_of(account_id);

  if (
    balance === null ||
    new Big(storageBound).gt(new Big(balance.available))
  ) {
    transactions.push({
      receiverId: ORDERLY_ASSET_MANAGER,
      functionCalls: [
        orderly_storage_deposit(
          account_id,
          utils.format.formatNearAmount(storageBound),
          false
        ),
      ],
    });
  }

  const metaData = await getFTmetadata(token);

  transactions.push({
    receiverId: getOrderlyConfig().ORDERLY_ASSET_MANAGER,
    functionCalls: [
      await user_request_withdraw(
        token.toLowerCase() === "near" ? "near" : token,
        toNonDivisibleNumber(metaData.decimals, amount)
      ),
    ],
  });

  return signAndSendTransactions(transactions);
};

const perpSettlementTx = async () => {
  const transaction: Transaction = {
    receiverId: ORDERLY_ASSET_MANAGER,
    functionCalls: [await user_request_settlement()],
  };

  return transaction;
};

export {
  signAndSendTransactions,
  withdrawOrderly,
  depositOrderly,
  storageDeposit,
  depositNEAR,
  depositFT,
  checkStorageDeposit,
  perpSettlementTx,
};
