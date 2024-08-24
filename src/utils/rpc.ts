export function getRpcSelectorList(
  env: string | undefined = process.env.NEXT_PUBLIC_NEAR_ENV
) {
  switch (env) {
    case "production":
    case "mainnet":
      return {
        RPC_LIST: {
          defaultRpc: {
            url: "https://rpc.mainnet.near.org",
            simpleName: "official rpc",
          },
          lavaRpc: {
            url: "https://near.lava.build",
            simpleName: "lava rpc",
          },
          betaRpc: {
            url: "https://beta.rpc.mainnet.near.org",
            simpleName: "official beta rpc",
          },
          fastnearRpc: {
            url: "https://free.rpc.fastnear.com",
            simpleName: "fastnear rpc",
          },
        },
        pool_protocol: "indexer",
      };
    case "development":
    case "pub-testnet":
      return {
        RPC_LIST: {
          defaultRpc: {
            url: "https://rpc.testnet.near.org",
            simpleName: "official rpc",
          },
          lavaRpc: {
            url: "https://g.w.lavanet.xyz/gateway/neart/rpc-http/a6e88c7710da77f09430aacd6328efd6",
            simpleName: "lava rpc",
          },
        },
        pool_protocol: "indexer",
      };
    case "testnet":
      return {
        RPC_LIST: {
          defaultRpc: {
            url: "https://rpc.testnet.near.org",
            simpleName: "official rpc",
          },
          lavaRpc: {
            url: "https://g.w.lavanet.xyz/gateway/neart/rpc-http/a6e88c7710da77f09430aacd6328efd6",
            simpleName: "lava rpc",
          },
        },
        pool_protocol: "indexer",
      };
    default:
      return {
        RPC_LIST: {
          defaultRpc: {
            url: "https://rpc.mainnet.near.org",
            simpleName: "official rpc",
          },
          lavaRpc: {
            url: "https://near.lava.build",
            simpleName: "lava rpc",
          },
          betaRpc: {
            url: "https://beta.rpc.mainnet.near.org",
            simpleName: "official beta rpc",
          },
          fastnearRpc: {
            url: "https://free.rpc.fastnear.com",
            simpleName: "fastnear rpc",
          },
        },
        pool_protocol: "indexer",
      };
  }
}
export function getCustomAddRpcSelectorList() {
  let customRpcMapStr: string | null = null;
  try {
    customRpcMapStr = window.localStorage.getItem("customRpcList");
  } catch (error) {}

  let customRpcMap: CustomRpcMap = {};
  if (customRpcMapStr) {
    try {
      customRpcMap = JSON.parse(customRpcMapStr);
    } catch (error) {}
  }
  return customRpcMap;
}

export function getRPCList() {
  const RPC_LIST_system = getRpcSelectorList().RPC_LIST;
  const RPC_LIST_custom = getCustomAddRpcSelectorList();
  const RPC_LIST = Object.assign(RPC_LIST_system, RPC_LIST_custom) as any;
  return RPC_LIST;
}
export function getSelectedRpc() {
  const RPC_LIST = getRPCList();
  let endPoint = "defaultRpc";
  try {
    endPoint = window.localStorage.getItem("endPoint") || endPoint;
    if (!RPC_LIST[endPoint]) {
      endPoint = "defaultRpc";
      localStorage.removeItem("endPoint");
    }
  } catch (error) {}
  return RPC_LIST[endPoint];
}

type CustomRpcEntry = {
  url: string;
  simpleName: string;
  custom: boolean;
};

type CustomRpcMap = Record<string, CustomRpcEntry>;
