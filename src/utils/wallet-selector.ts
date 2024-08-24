import { map, distinctUntilChanged } from "rxjs";

import { NetworkId, setupWalletSelector } from "@near-wallet-selector/core";
import type {
  WalletSelector,
  AccountState,
  Network,
} from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupNeth } from "@near-wallet-selector/neth";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet";
import { setupKeypom } from "@keypom/selector";
import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet";
import { setupOKXWallet } from "@near-wallet-selector/okx-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import getConfig from "./config";
import getOrderlyConfig from "./orderlyConfig";
import { getCustomAddRpcSelectorList, getRpcSelectorList } from "./rpc";
declare global {
  interface Window {
    selector: WalletSelector & { getAccountId: () => string };
    selectorSubscription: any;
    modal: WalletSelectorModal;
    accountId: string;
    sender?: any;
  }
}
interface GetWalletSelectorArgs {
  onAccountChange: (accountId: string) => Promise<void>;
}
export async function getWalletSelector({
  onAccountChange,
}: GetWalletSelectorArgs) {
  const KEYPOM_OPTIONS = {
    beginTrial: {
      landing: {
        title: "Welcome!",
      },
    },
    wallets: [
      {
        name: "MyNEARWallet",
        description: "Secure your account with a Seed Phrase",
        redirectUrl: `https://${
          getConfig().networkId
        }.mynearwallet.com/linkdrop/ACCOUNT_ID/SECRET_KEY`,
        iconUrl: "INSERT_ICON_URL_HERE",
      },
    ],
  };
  const signInContractId = getOrderlyConfig().ORDERLY_ASSET_MANAGER;
  let endPoint = "defaultRpc";
  const RPCLIST_system = getRpcSelectorList().RPC_LIST;
  const RPCLIST_custom = getCustomAddRpcSelectorList();
  const RPC_LIST = Object.assign(RPCLIST_system, RPCLIST_custom);
  try {
    endPoint = window.localStorage.getItem("endPoint") || endPoint;
    if (!RPC_LIST[endPoint]) {
      endPoint = "defaultRpc";
      localStorage.removeItem("endPoint");
    }
  } catch (error) {}
  const selector = await setupWalletSelector({
    network: {
      networkId: getConfig().networkId as NetworkId,
      nodeUrl: RPC_LIST[endPoint].url,
    } as Network,
    debug: false,
    modules: [
      setupOKXWallet({}),
      setupMyNearWallet(),
      setupHereWallet(),
      setupSender(),
      setupMeteorWallet(),
      setupNearMobileWallet({
        dAppMetadata: {
          name: "ref finance",
          logoUrl: "https://img.ref.finance/images/REF-black-logo.png",
          url: "https://app.ref.finance",
        },
      }),
      setupNeth({
        gas: "300000000000000",
        bundle: false,
      }) as any,
      setupNightly(),
      setupLedger(),
      setupWalletConnect({
        projectId: "87e549918631f833447b56c15354e450",

        metadata: {
          name: "ref finance",
          description: "Example dApp used by NEAR Wallet Selector",
          url: "https://github.com/ref-finance/ref-ui",
          icons: ["https://avatars.githubusercontent.com/u/37784886"],
        },
        chainId: `near:${getConfig().networkId}`,
      }),
      setupKeypom({
        networkId: getConfig().networkId as NetworkId,
        signInContractId,
        trialAccountSpecs: {
          url: "/trial-accounts/ACCOUNT_ID#SECRET_KEY",
          modalOptions: KEYPOM_OPTIONS,
        },
        instantSignInSpecs: {
          url: "/#instant-url/ACCOUNT_ID#SECRET_KEY/MODULE_ID",
        },
      }),
      setupMintbaseWallet({
        walletUrl: "https://wallet.mintbase.xyz",
        contractId: signInContractId,
        deprecated: false,
      }),
    ],
  });
  const modal = setupModal(selector, {
    contractId: getOrderlyConfig().ORDERLY_ASSET_MANAGER,
  });
  const { observable }: { observable: any } = selector.store;
  const subscription = observable
    .pipe(
      map((s: any) => s.accounts),
      distinctUntilChanged()
    )
    .subscribe((nextAccounts: any) => {
      console.info("Accounts Update", nextAccounts);
      window.accountId = nextAccounts[0]?.accountId;
      onAccountChange(window.accountId || "");
    });
  window.selector = selector as WalletSelector & { getAccountId: () => string };
  window.modal = modal;
  window.selectorSubscription = subscription;
}
