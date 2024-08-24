import { keyStores, KeyPair } from "near-api-js";
import { getSelectedWalletId } from "./wallet";
import getConfig from "./config";

export type OFF_CHAIN_METHOD = "POST" | "GET" | "DELETE" | "PUT";

export const tradingKeyMap = new Map();
export const get_orderly_public_key_path = () =>
  `orderly-trading-key-public:${getConfig().networkId}`;

export const keyStore = new keyStores.BrowserLocalStorageKeyStore();
export const keyStoreKeypom = new keyStores.BrowserLocalStorageKeyStore(
  undefined,
  "keypom:"
);

export function getNearMobileWalletKeyPairObject() {
  const storage = JSON.parse(
    localStorage.getItem("near-mobile-signer:session") || "{}"
  );
  const networkId = getConfig().networkId;
  const privateKey =
    storage?.[networkId]?.accounts?.[storage?.[networkId]?.activeAccount];
  if (privateKey) {
    const keyPair = KeyPair.fromString(privateKey);
    return keyPair;
  }
  return null;
}
export const getPublicKey = async (accountId: string) => {
  const selectedWalletId = getSelectedWalletId();

  if (selectedWalletId === "sender") {
    // @ts-ignore

    return getSenderAccessKey()?.publicKey;
  }

  if (selectedWalletId === "meteor-wallet") {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore(
      window.localStorage,
      "_meteor_wallet"
    );
    const publicKey = (await keyStore.getKey(getConfig().networkId, accountId))
      ?.getPublicKey()
      ?.toString();

    return publicKey;
  }
  if (selectedWalletId === "keypom") {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore(
      window.localStorage,
      "keypom:"
    );
    const publicKey = (await keyStore.getKey(getConfig().networkId, accountId))
      ?.getPublicKey()
      ?.toString();

    return publicKey;
  }

  if (selectedWalletId === "near-mobile-wallet") {
    const keyPair = getNearMobileWalletKeyPairObject();
    return keyPair?.getPublicKey()?.toString();
  }

  const publicKey = (await keyStore.getKey(getConfig().networkId, accountId))
    ?.getPublicKey()
    ?.toString();

  return publicKey;
};

export const generateMessage = (
  time_stamp: number,
  method: OFF_CHAIN_METHOD | undefined,
  url: string | null,
  body: object | null
) => {
  return !!body
    ? `${time_stamp}${method || ""}${url || ""}${JSON.stringify(body)}`
    : `${time_stamp}${method || ""}${url || ""}`;
};

export const generateRequestSignatureHeader = async ({
  accountId,
  time_stamp,
  url,
  body,
  method,
}: {
  accountId: string;
  time_stamp: number;
  url: string | null;
  body: object | null;
  method?: OFF_CHAIN_METHOD;
}) => {
  const message = generateMessage(time_stamp, method, url, body);

  let signature;

  let keyPair;

  const selectedWalletId = getSelectedWalletId();

  if (selectedWalletId === "sender") {
    const accessKeys = getSenderAccessKey();

    keyPair = KeyPair.fromString("ed25519:" + accessKeys.secretKey);
    signature = keyPair?.sign(Buffer.from(message))?.signature;
  } else if (selectedWalletId === "near-mobile-wallet") {
    const keyPair = getNearMobileWalletKeyPairObject();
    signature = keyPair?.sign(Buffer.from(message))?.signature;
  } else if (selectedWalletId === "keypom") {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore(
      undefined,
      "keypom:"
    );
    const keyPair = await keyStore.getKey(getConfig().networkId, accountId);
    signature = keyPair?.sign(Buffer.from(message))?.signature;
  } else {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    if (selectedWalletId === "meteor-wallet") {
      const keyString = localStorage.getItem(
        "_meteor_wallet" + accountId + `:${getConfig().networkId}`
      );
      if (keyString) {
        keyPair = KeyPair.fromString(keyString);
      } else {
        throw new Error("Key not found in localStorage");
      }
    } else {
      keyPair = await keyStore.getKey(getConfig().networkId, accountId);
    }

    signature = keyPair?.sign(Buffer.from(message))?.signature;
  }

  return Buffer.from(signature ?? "")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const REF_FI_SENDER_WALLET_ACCESS_KEY =
  "REF_FI_SENDER_WALLET_ACCESS_KEY";

const getSenderAccessKey = () => {
  const storedKey = localStorage.getItem(REF_FI_SENDER_WALLET_ACCESS_KEY);

  if (storedKey && !!JSON.parse(storedKey)?.accessKey) {
    return JSON.parse(storedKey)?.accessKey;
  }

  // @ts-ignore
  const keyStoreSender = window?.near?.authData;

  if (!keyStoreSender) alert("no accessKey found in sender");

  localStorage.setItem(
    REF_FI_SENDER_WALLET_ACCESS_KEY,
    JSON.stringify(keyStoreSender)
  );

  return keyStoreSender.accessKey;
};
