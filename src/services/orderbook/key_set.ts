import { KeyPair, utils, Contract } from "near-api-js";
import BN from "bn.js";
import {
  getNormalizeTradingKey,
  getNearMobileWalletKeyPairObject,
} from "./utils";
import {
  keyStore,
  near,
  nearKeypom,
  keyStoreKeypom,
  ORDERLY_ASSET_MANAGER,
} from "./near";
import getConfig from "@/utils/config";
import { getAccountId } from "@/utils/wallet";
import { getKeypomAccount, getAccount } from "@/utils/near";
import {
  ledgerTipClose,
  ledgerTipTrigger,
} from "@/components/common/ledger/ledger";
export const REF_ORDERLY_NEW_USER_TIP = "REF_ORDERLY_NEW_USER_TIP_KEY";
/**
 * No matter which wallet you are using, you need to get the private key of the current wallet after logging in.
 * Some wallets are exposed directly, and others can use addKey. If addKey is not supported, the orderly function is not supported. The orderly function requires the private key to sign the order information.
 */
export const announceKey = async () => {
  const accountId = getAccountId();
  const wallet = await window.selector.wallet();
  if (
    wallet.id === "ledger" ||
    wallet.id === "here-wallet" ||
    wallet.id === "nightly" ||
    wallet.id === "keypom" ||
    wallet.id === "near-mobile-wallet"
  ) {
    if (wallet.id == "near-mobile-wallet") {
      const keyPair = getNearMobileWalletKeyPairObject();
      keyStore.setKey(getConfig().networkId, accountId, keyPair!);
    } else {
      await addAccessKey();
    }
    const contract: any = await getContract();
    return await contract.user_announce_key();
  }

  if (wallet.id === "sender") {
    const near: any = window.near;
    return near
      .account()
      .functionCall(ORDERLY_ASSET_MANAGER, "user_announce_key", {});
  }
  return await wallet.signAndSendTransaction({
    signerId: accountId,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: "user_announce_key",
          args: {},
          gas: utils.format.parseNearAmount("0.00000000003")!,
          deposit: utils.format.parseNearAmount("0")!,
        },
      },
    ],
  });
};
export const setTradingKey = async () => {
  const accountId = getAccountId();
  const wallet = await window.selector.wallet();
  if (
    wallet.id === "ledger" ||
    wallet.id === "here-wallet" ||
    wallet.id === "nightly" ||
    wallet.id === "keypom" ||
    wallet.id === "near-mobile-wallet"
  ) {
    const contract: any = await getContract();
    return await contract.user_request_set_trading_key({
      key: getNormalizeTradingKey(),
    });
  }

  if (wallet.id === "sender") {
    const near: any = window.near;
    return near
      .account()
      .functionCall(ORDERLY_ASSET_MANAGER, "user_request_set_trading_key", {
        key: getNormalizeTradingKey(),
      });
  }
  return await wallet.signAndSendTransaction({
    signerId: accountId,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: "user_request_set_trading_key",
          args: {
            key: getNormalizeTradingKey(),
          },
          gas: utils.format.parseNearAmount("0.00000000003")!,
          deposit: utils.format.parseNearAmount("0")!,
        },
      },
    ],
  });
};
const addAccessKey = async () => {
  const accountId = getAccountId();
  const keyPairLedger = KeyPair.fromRandom("ed25519");

  const wallet = await window.selector.wallet();

  if (wallet.id === "ledger") {
    await ledgerTipTrigger();
  }
  if (wallet.id === "keypom") {
    keyStoreKeypom.setKey(getConfig().networkId, accountId, keyPairLedger);
    const fullKey = localStorage.getItem(
      `near-api-js:keystore:${accountId}:${getConfig().networkId}`
    );
    const keyPair = KeyPair.fromString(fullKey!);
    keyStore.setKey(getConfig().networkId, accountId, keyPair);
    const account = await near.account(accountId);
    await account.addKey(
      keyPairLedger.getPublicKey().toString(),
      ORDERLY_ASSET_MANAGER,
      [
        "addMessage",
        "user_deposit_native_token",
        "user_request_withdraw",
        "user_announce_key",
        "user_request_set_trading_key",
        "create_user_account",
      ],
      new BN(utils.format.parseNearAmount("0.25")!)
    );
  } else {
    keyStore.setKey(getConfig().networkId, accountId, keyPairLedger);
    await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: accountId,
      actions: [
        {
          type: "AddKey",
          params: {
            publicKey: keyPairLedger.getPublicKey().toString(),
            accessKey: {
              permission: {
                receiverId: ORDERLY_ASSET_MANAGER,

                methodNames: [
                  "addMessage",
                  "user_deposit_native_token",
                  "user_request_withdraw",
                  "user_announce_key",
                  "user_request_set_trading_key",
                  "create_user_account",
                ],
                allowance: "250000000000000000000000",
              },
            },
          },
        },
      ],
    });
  }
  ledgerTipClose();
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 2000);
  });
};
async function getContract() {
  let account: any;
  const walletId = window.selector.store.getState().selectedWalletId;
  if (walletId === "keypom") {
    account = await getKeypomAccount();
  } else {
    account = await getAccount();
  }
  const contract = new Contract(account, ORDERLY_ASSET_MANAGER, {
    viewMethods: [
      "user_token_balance",
      "user_trading_key",
      "is_orderly_key_announced",
      "is_trading_key_set",
      "user_account_exists",
    ],
    changeMethods: [
      "addMessage",
      "user_deposit_native_token",
      "user_request_withdraw",
      "user_announce_key",
      "user_request_set_trading_key",
      "create_user_account",
    ],
    useLocalViewExecution: true,
  });
  return contract;
}
