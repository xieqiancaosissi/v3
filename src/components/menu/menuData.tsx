import Image from "next/image";
import {
  SwapIcon,
  LimitIcon,
  OrderbookIcon,
  PoolIcon,
  FarmsIcon,
  YoursIcon,
  StakeIcon,
} from "./icons";
import { Rainbow, WalletCedeBridge, AggregateBridge } from "./icons2";

export interface IMenu {
  id: string;
  label: string | React.ReactElement;
  path?: string;
  children?: IMenuChild[];
  icon?: string | React.ReactElement;
}
export interface IMenuChild {
  id: string;
  label: string | React.ReactElement;
  icon: React.ReactElement;
  path?: string;
  externalLink?: string;
  bridgeConfirm?: boolean;
}
export function menuData(): IMenu[] {
  return [
    {
      id: "trade",
      label: "TRADE",
      children: [
        {
          id: "swap",
          label: "Swap",
          icon: <SwapIcon />,
          path: "/",
        },
        {
          id: "limit",
          label: "Limit",
          icon: <LimitIcon />,
          path: "/limit",
        },
        {
          id: "orderbook",
          label: "Orderbook",
          icon: <OrderbookIcon />,
          externalLink: "https://app.ref.finance/orderbook/spot",
        },
      ],
    },
    {
      id: "earn",
      label: "EARN",
      children: [
        {
          id: "pools",
          label: "Pools",
          icon: <PoolIcon />,
          path: "/pools",
        },
        {
          id: "farms",
          label: "Farms",
          icon: <FarmsIcon />,
          path: "/v2farms",
        },
        {
          id: "yours",
          label: "Yours",
          icon: <YoursIcon />,
          path: "/yours",
        },
        {
          id: "stake",
          label: "Stake",
          icon: <StakeIcon />,
          path: "/xref",
        },
      ],
    },
    {
      id: "bridge",
      label: "Bridge",
      children: [
        {
          id: "aggregate",
          label: "Aggregate",
          icon: <AggregateBridge />,
          externalLink: "https://app.ref.finance/bridge",
        },
        {
          id: "rainbow",
          label: "Rainbow",
          icon: <Rainbow />,
          externalLink: "https://rainbowbridge.app/transfer",
          bridgeConfirm: true,
        },
        {
          id: "cex",
          label: "CEX",
          icon: <WalletCedeBridge />,
          externalLink:
            "https://send.cede.store/?tokenSymbol=NEAR&network=near&source=ref_finance",
          bridgeConfirm: true,
        },
      ],
    },
    {
      id: "meme",
      icon: <Image src="/images/memeMenu.svg" width={24} height={24} alt="" />,
      label: "MEME SEASON",
      path: "/meme",
    },
  ];
}

export const routeMapIds = {
  "trade-swap": ["/"],
  "trade-limit": ["/limit"],
  "earn-pools": [
    "/pools",
    "/pools/[id]",
    "/sauce/[id]",
    "/poolV2/[id]",
    "/liquidity/[id]",
  ],
  "earn-farms": ["/v2farms", "/v2farms/[id]"],
  "earn-stake": ["/xref"],
  "earn-yours": ["/yours"],
  meme: ["/meme", "/memeAirdop"],
  "-": ["/risks"],
};
