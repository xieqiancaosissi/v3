import getOrderlyConfig from "@/utils/orderlyConfig";
import {
  OFF_CHAIN_METHOD,
  generateRequestSignatureHeader,
  getPublicKey,
  get_orderly_public_key_path,
  tradingKeyMap,
} from "@/utils/orderlyUtils";

export interface IOrderKeyInfo {
  ip_restriction_list: any[];
  ip_restriction_status: string;
  key_status: "ACTIVE" | "REMOVING" | "REMOVED";
  orderly_key: string;
  trading_key: string;
}

export const getOrderlyHeaders = async ({
  url,
  accountId,
  trading,
  method,
  param,
  contentType,
}: {
  url?: string;
  accountId: string;
  trading?: boolean;
  method: OFF_CHAIN_METHOD;
  param?: object;
  contentType?: string;
}) => {
  const time_stamp = Date.now();

  const headers: Record<string, any> = {
    "Content-Type": contentType || "application/x-www-form-urlencoded",
    "orderly-timestamp": `${time_stamp}`,
    "orderly-account-id": accountId,
    "orderly-key": await getPublicKey(accountId),
    "orderly-signature": await generateRequestSignatureHeader({
      accountId,
      time_stamp,
      url: url || "",
      body: param || null,
      method,
    }),
  };

  if (trading) {
    const storedPublicKey = localStorage.getItem(get_orderly_public_key_path());

    const mapTradingKey = tradingKeyMap.get(get_orderly_public_key_path());

    if (!storedPublicKey && !mapTradingKey) {
      alert("not trading key");
    }

    headers["orderly-trading-key"] = storedPublicKey || mapTradingKey;
  }

  return headers;
};

export const requestOrderly = async ({
  ct,
  url,
  accountId,
  param,
}: {
  url?: string;
  accountId: string;
  param?: object;
  ct?: string;
}) => {
  const headers = await getOrderlyHeaders({
    url,
    accountId,
    trading: false,
    method: "GET",
    param,
    contentType: ct,
  });
  return await fetch(`${getOrderlyConfig().OFF_CHAIN_END_POINT}${url || ""}`, {
    method: "GET",

    headers,
  }).then((res) => {
    return res.json();
  });
};

export const getAccountKeyInfo = async (props: {
  accountId: string;
}): Promise<IOrderKeyInfo[]> => {
  const url = "/v1/client/key_info";

  const res = await requestOrderly({
    url,
    accountId: props.accountId,
  });
  return res?.data?.rows || [];
};
