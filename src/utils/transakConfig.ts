export default function getOrderlyConfig(
  env: string | undefined = process.env.NEXT_PUBLIC_NEAR_ENV
) {
  switch (env) {
    case "production":
    case "mainnet":
      return {
        ORDERLY_ASSET_MANAGER: "asset-manager.orderly-network.near",
        OFF_CHAIN_END_POINT: "https://api.orderly.org",
        ORDERLY_WS_ENDPOINT: "wss://ws.orderly.org/ws/stream",
        ORDERLY_WS_ENDPOINT_PRIVATE:
          "wss://ws-private.orderly.org/v2/ws/private/stream",
      };
    case "development":
    case "pub-testnet":
      return {
        ORDERLY_ASSET_MANAGER: "asset-manager.orderly.testnet",
        OFF_CHAIN_END_POINT: "https://testnet-api.orderly.org",
        ORDERLY_WS_ENDPOINT: "wss://testnet-ws.orderly.org/ws/stream",
        ORDERLY_WS_ENDPOINT_PRIVATE:
          "wss://testnet-ws-private.orderly.org/v2/ws/private/stream",
      };
    case "testnet":
      return {
        ORDERLY_ASSET_MANAGER: "asset-manager.orderly.testnet",
        OFF_CHAIN_END_POINT: "https://testnet-api.orderly.org",
        ORDERLY_WS_ENDPOINT: "wss://testnet-ws.orderly.org/ws/stream",
        ORDERLY_WS_ENDPOINT_PRIVATE:
          "wss://testnet-ws-private.orderly.org/v2/ws/private/stream",
      };
    default:
      return {
        ORDERLY_ASSET_MANAGER: "asset-manager.orderly-network.near",
        OFF_CHAIN_END_POINT: "https://api.orderly.org",
        ORDERLY_WS_ENDPOINT: "wss://ws.orderly.org/ws/stream",
        ORDERLY_WS_ENDPOINT_PRIVATE:
          "wss://ws-private.orderly.org/v2/ws/private/stream",
      };
  }
}
