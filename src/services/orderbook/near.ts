import getConfig from "@/utils/config";
import { Near, keyStores, utils } from "near-api-js";
import { Transaction as WSTransaction } from "@near-wallet-selector/core";
import * as math from "mathjs";

import BN from "bn.js";
import getOrderlyConfig from "@/utils/orderlyConfig";
import { TokenMetadata } from "@/interfaces/orderbook";
import { ftGetTokenMetadata } from "@/services/token";
import { nearMetadata } from "@/services/wrap-near";
export interface ViewFunctionOptions {
  methodName: string;
  args?: object;
}

export const getGas = (gas?: string) =>
  gas ? new BN(gas) : new BN("100000000000000");

export const getAmount = (amount: string) =>
  amount ? new BN(utils.format.parseNearAmount(amount)!) : new BN("0");

export const ONE_YOCTO_NEAR = "0.000000000000000000000001";
export interface FunctionCallOptions extends ViewFunctionOptions {
  gas?: string;
  amount?: string;
}

export interface Transaction {
  receiverId: string;
  functionCalls: FunctionCallOptions[];
}

export const keyStore = new keyStores.BrowserLocalStorageKeyStore();
export const keyStoreKeypom = new keyStores.BrowserLocalStorageKeyStore(
  undefined,
  "keypom:"
);

export const config = getConfig();

export const near = new Near({
  keyStore,
  headers: {},
  ...config,
});
export const nearKeypom = new Near({
  keyStore: keyStoreKeypom,
  headers: {},
  ...config,
});

export const ORDERLY_ASSET_MANAGER = getOrderlyConfig().ORDERLY_ASSET_MANAGER;

export const orderlyViewFunction = async ({
  methodName,
  args,
}: ViewFunctionOptions) => {
  const nearConnection = await near.account(ORDERLY_ASSET_MANAGER);

  return nearConnection.viewFunction({
    contractId: ORDERLY_ASSET_MANAGER,
    methodName,
    args,
  });
};

export const getFunctionCallTransaction = async (
  transactions: Transaction[]
) => {
  const signerId = await window.selector?.store?.getState()?.accounts[0]
    ?.accountId;

  const wsTransactions: WSTransaction[] = [];

  transactions.forEach((transaction) => {
    wsTransactions.push({
      signerId: signerId!,
      receiverId: transaction.receiverId,
      actions: transaction.functionCalls.map((fc) => {
        return {
          type: "FunctionCall",
          params: {
            methodName: fc.methodName,
            args: fc.args || [],
            gas: getGas(fc.gas).toNumber().toFixed(),
            deposit: utils.format.parseNearAmount(fc.amount || "0")!,
          },
        };
      }),
    });
  });

  return wsTransactions;
};

export const getAddFunctionCallKeyTransaction = async ({
  receiverId,
  publicKey,
}: {
  receiverId: string;
  publicKey: string;
}) => {
  const signerId = await window.selector?.store?.getState()?.accounts[0]
    ?.accountId;

  if (!signerId) throw Error("Please sign in first.");

  const wsTransactions: WSTransaction[] = [];
  wsTransactions.push({
    signerId: signerId!,
    receiverId: signerId,
    actions: [
      {
        type: "AddKey",
        params: {
          publicKey,
          accessKey: {
            permission: {
              receiverId,
            },
          },
        },
      },
    ],
  });

  return wsTransactions;
};

export const getFTmetadata = async (token: string): Promise<TokenMetadata> => {
  if (token === "near" || token === "NEAR") return nearMetadata;

  const data = await ftGetTokenMetadata(token);

  return {
    ...data,
    id: token,
  };
};

export const btcMetadata = {
  id: "WBTC",
  name: "WBTC",
  symbol: "WBTC",
  decimals: 8,
  icon: 'data:image/svg+xml,%3Csvg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none"%3E%3Ccircle fill="%23201A2D" cx="16" cy="16" r="16"/%3E%3Cg fill="%23FFF"%3E%3Cpath d="M22.818 9.586l-.6.6a8.494 8.494 0 010 11.464l.6.6a9.352 9.352 0 000-12.678v.014zM10.2 9.638a8.494 8.494 0 0111.464 0l.6-.6a9.352 9.352 0 00-12.678 0l.614.6zm-.562 12.018a8.494 8.494 0 010-11.458l-.6-.6a9.352 9.352 0 000 12.678l.6-.62zm12.018.554a8.494 8.494 0 01-11.464 0l-.6.6a9.352 9.352 0 0012.678 0l-.614-.6zm-1.942-8.286c-.12-1.252-1.2-1.672-2.566-1.8V10.4h-1.056v1.692h-.844V10.4H14.2v1.736h-2.142v1.13s.78-.014.768 0a.546.546 0 01.6.464v4.752a.37.37 0 01-.128.258.366.366 0 01-.272.092c.014.012-.768 0-.768 0l-.2 1.262h2.122v1.764h1.056V20.12h.844v1.73h1.058v-1.744c1.784-.108 3.028-.548 3.184-2.218.126-1.344-.506-1.944-1.516-2.186.614-.302.994-.862.908-1.778zm-1.48 3.756c0 1.312-2.248 1.162-2.964 1.162v-2.328c.716.002 2.964-.204 2.964 1.166zm-.49-3.28c0 1.2-1.876 1.054-2.472 1.054v-2.116c.596 0 2.472-.188 2.472 1.062z"/%3E%3Cpath d="M15.924 26.852C9.89 26.851 5 21.959 5 15.925 5 9.892 9.892 5 15.925 5c6.034 0 10.926 4.89 10.927 10.924a10.926 10.926 0 01-10.928 10.928zm0-21c-5.559.004-10.062 4.513-10.06 10.072.002 5.559 4.51 10.064 10.068 10.064 5.559 0 10.066-4.505 10.068-10.064A10.068 10.068 0 0015.924 5.852z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E',
};

export const ftGetBalance = async (tokenId: string) => {
  const account_id = window.accountId;

  const nearConnection = await near.account(account_id);

  if (tokenId === "NEAR" || tokenId === "near") {
    return nearConnection
      .getAccountBalance()
      .then(({ available }) => available)
      .catch((e) => {
        return "0";
      });
  }

  return nearConnection
    .viewFunction({
      contractId: tokenId,
      methodName: "ft_balance_of",
      args: {
        account_id,
      },
    })
    .catch(() => "0");
};

function formatWithCommas(value: string): string {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.replace(pattern, "$1,$2");
  }
  return value;
}

export const toPrecision = (
  number: string,
  precision: number,
  withCommas: boolean = false,
  atLeastOne: boolean = true
): string => {
  if (typeof number === "undefined") return "0";

  const [whole, decimal = ""] = number.split(".");

  let str = `${withCommas ? formatWithCommas(whole) : whole}.${decimal.slice(
    0,
    precision
  )}`.replace(/\.$/, "");
  if (atLeastOne && Number(str) === 0 && str.length > 1) {
    const n = str.lastIndexOf("0");
    str = str.slice(0, n) + str.slice(n).replace("0", "1");
  }

  return str;
};

export const percent = (numerator: string, denominator: string) => {
  return math.evaluate(`(${numerator} / ${denominator}) * 100`);
};

export function scientificNotationToString(strParam: string) {
  const flag = /e/.test(strParam);
  if (!flag) return strParam;

  let sysbol = true;
  if (/e-/.test(strParam)) {
    sysbol = false;
  }

  const negative = Number(strParam) < 0 ? "-" : "";

  const index = Number(strParam.match(/\d+$/)![0]);

  const basis = strParam.match(/[\d\.]+/)![0];

  const ifFraction = basis.includes(".");

  let wholeStr;
  let fractionStr;

  if (ifFraction) {
    wholeStr = basis.split(".")[0];
    fractionStr = basis.split(".")[1];
  } else {
    wholeStr = basis;
    fractionStr = "";
  }

  if (sysbol) {
    if (!ifFraction) {
      return negative + wholeStr.padEnd(index + wholeStr.length, "0");
    } else {
      if (fractionStr.length <= index) {
        return negative + wholeStr + fractionStr.padEnd(index, "0");
      } else {
        return (
          negative +
          wholeStr +
          fractionStr.substring(0, index) +
          "." +
          fractionStr.substring(index)
        );
      }
    }
  } else {
    if (!ifFraction)
      return (
        negative +
        wholeStr.padStart(index + wholeStr.length, "0").replace(/^0/, "0.")
      );
    else {
      return (
        negative +
        wholeStr.padStart(index + wholeStr.length, "0").replace(/^0/, "0.") +
        fractionStr
      );
    }
  }
}

export const percentOfBigNumber = (
  percent: number,
  num: number | string,
  precision: number
) => {
  const valueBig = math.bignumber(num);
  const percentBig = math.bignumber(percent).div(100);

  return toPrecision(
    scientificNotationToString(valueBig.mul(percentBig).toString()),
    precision
  );
};
