export default function getStablePoolConfig(
  env: string | undefined = process.env.NEXT_PUBLIC_NEAR_ENV
) {
  switch (env) {
    case "production":
    case "mainnet":
      return {
        BTCIDS: [
          "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
          "0316eb71485b0ab14103307bf65a021042c6d380.factory.bridge.near",
        ],
        BTC_STABLE_POOL_INDEX: {
          "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near": 0,
          "0316eb71485b0ab14103307bf65a021042c6d380.factory.bridge.near": 1,
        },
        BTC_STABLE_POOL_ID: "3364",
        CUSDIDS: ["usn", "cusd.token.a11bd.near"],
        CUSD_STABLE_POOL_INDEX: {
          usn: 0,
          "cusd.token.a11bd.near": 1,
        },
        CUSD_STABLE_POOL_ID: "3433",
        STNEAR_POOL_ID: "3514",
        LINEAR_POOL_ID: "3515",
        STNEARIDS: ["meta-pool.near", "wrap.near"],
        LINEARIDS: ["linear-protocol.near", "wrap.near"],
        STNEAR_POOL_INDEX: {
          "meta-pool.near": 0,
          "wrap.near": 1,
        },
        LINEAR_POOL_INDEX: {
          "linear-protocol.near": 0,
          "wrap.near": 1,
        },
        NEARX_POOL_ID: "3612",
        NEARXIDS: ["nearx.stader-labs.near", "wrap.near"],
        NEARX_POOL_INDEX: {
          "nearx.stader-labs.near": 0,
          "wrap.near": 1,
        },
        NEW_NEARX_POOL_ID: "3688",
        NEW_NEARXIDS: ["v2-nearx.stader-labs.near", "wrap.near"],
        NEW_NEARX_POOL_INDEX: {
          "v2-nearx.stader-labs.near": 0,
          "wrap.near": 1,
        },
        USDT_POOL_ID: "3689",
        USDTIDS: [
          "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
          "usdt.tether-token.near",
        ],
        USDT_POOL_INDEX: {
          "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near": 0,
          "usdt.tether-token.near": 1,
        },

        RATED_POOLS_IDS: [
          "3514",
          "3515",
          "3612",
          "3688",
          "3689",
          "4179",
          "4513",
          "4514",
        ],
        DEGEN_POOLS_IDS: [""],
        USDTT_USDCC_USDT_USDC_POOL_INDEX: {
          "usdt.tether-token.near": 0,
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1": 1,
          "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near": 2,
          "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near": 3,
        },
        USDT_USDC_POOL_INDEX: {
          "usdt.tether-token.near": 0,
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1": 1,
        },
        FRAX_USDC_POOL_INDEX: {
          "853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near": 0,
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1": 1,
        },
      };
    case "development":
    case "pub-testnet":
      return {
        BTCIDS: ["wbtc.fakes.testnet", "hbtc.fakes.testnet"],
        BTC_STABLE_POOL_INDEX: {
          "wbtc.fakes.testnet": 0,
          "hbtc.fakes.testnet": 1,
        },
        BTC_STABLE_POOL_ID: "456",
        CUSDIDS: ["usdn.testnet", "cusd.fakes.testnet"],
        CUSD_STABLE_POOL_INDEX: {
          "usdn.testnet": 0,
          "cusd.fakes.testnet": 1,
        },
        CUSD_STABLE_POOL_ID: "494",
        STNEAR_POOL_ID: "568",
        LINEAR_POOL_ID: "571",
        STNEARIDS: ["meta-v2.pool.testnet", "wrap.testnet"],
        LINEARIDS: ["linear-protocol.testnet", "wrap.testnet"],
        STNEAR_POOL_INDEX: {
          "meta-v2.pool.testnet": 0,
          "wrap.testnet": 1,
        },
        LINEAR_POOL_INDEX: {
          "linear-protocol.testnet": 0,
          "wrap.testnet": 1,
        },
        NEARXIDS: ["nearx.staderlabs.testnet", "wrap.testnet"],
        NEARX_POOL_ID: "1044",
        NEARX_POOL_INDEX: {
          "nearx.staderlabs.testnet": 0,
          "wrap.testnet": 1,
        },
        NEW_NEARX_POOL_ID: "1751",
        NEW_NEARXIDS: ["v2-nearx.staderlabs.testnet", "wrap.testnet"],
        NEW_NEARX_POOL_INDEX: {
          "v2-nearx.staderlabs.testnet": 0,
          "wrap.testnet": 1,
        },

        USDT_POOL_ID: "1752",
        USDTIDS: ["usdt.fakes.testnet", "usdtt.fakes.testnet"],
        USDT_POOL_INDEX: {
          "usdt.fakes.testnet": 0,
          "usdtt.fakes.testnet": 1,
        },
        RATED_POOLS_IDS: ["568", "571", "1044", "1751", "1752", "1843"],
        DEGEN_POOLS_IDS: ["2022", "2031", "2065"],
        USDTT_USDCC_USDT_USDC_POOL_INDEX: {
          "usdtt.fakes.testnet": 0,
          "3e2210e1184b45b64c8a434c0a7e7b23cc04ea7eb7a6c3c32520d03d4afcb8af": 1,
          "usdt.fakes.testnet": 2,
          "usdc.fakes.testnet": 3,
        },
        USDT_USDC_POOL_INDEX: {},
        FRAX_USDC_POOL_INDEX: {},
      };
    case "testnet":
      return {
        BTCIDS: ["wbtc.fakes.testnet", "hbtc.fakes.testnet"],
        BTC_STABLE_POOL_INDEX: {
          "wbtc.fakes.testnet": 0,
          "hbtc.fakes.testnet": 1,
        },
        BTC_STABLE_POOL_ID: "604",
        CUSDIDS: ["usdn.testnet", "cusd.fakes.testnet"],
        CUSD_STABLE_POOL_INDEX: {
          "usdn.testnet": 0,
          "cusd.fakes.testnet": 1,
        },
        CUSD_STABLE_POOL_ID: "608",
        STNEAR_POOL_ID: "621",
        LINEAR_POOL_ID: "622",
        NEARX_POOL_ID: "666",
        STNEARIDS: ["meta-v2.pool.testnet", "wrap.testnet"],
        LINEARIDS: ["linear-protocol.testnet", "wrap.testnet"],
        NEARXIDS: ["nearx.staderlabs.testnet", "wrap.testnet"],
        STNEAR_POOL_INDEX: {
          "meta-v2.pool.testnet": 0,
          "wrap.testnet": 1,
        },
        LINEAR_POOL_INDEX: {
          "linear-protocol.testnet": 0,
          "wrap.testnet": 1,
        },
        NEARX_POOL_INDEX: {
          "nearx.staderlabs.testnet": 0,
          "wrap.testnet": 1,
        },
        NEW_NEARX_POOL_ID: "685",
        NEW_NEARXIDS: ["v2-nearx.staderlabs.testnet", "wrap.testnet"],
        NEW_NEARX_POOL_INDEX: {
          "v2-nearx.staderlabs.testnet": 0,
          "wrap.testnet": 1,
        },
        USDT_POOL_ID: "686",
        USDTIDS: ["usdt.fakes.testnet", "usdtt.fakes.testnet"],
        USDT_POOL_INDEX: {
          "usdt.fakes.testnet": 0,
          "usdtt.fakes.testnet": 1,
        },

        RATED_POOLS_IDS: ["621", "622", "666", "685", "686", "711"],
        DEGEN_POOLS_IDS: ["736"],
        USDTT_USDCC_USDT_USDC_POOL_INDEX: {
          "usdtt.fakes.testnet": 0,
          "usdcc.fakes.testnet": 1,
          "usdt.fakes.testnet": 2,
          "usdc.fakes.testnet": 3,
        },
        USDT_USDC_POOL_INDEX: {},
        FRAX_USDC_POOL_INDEX: {},
      };
    default:
      return {
        BTCIDS: [
          "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
          "0316eb71485b0ab14103307bf65a021042c6d380.factory.bridge.near",
        ],
        BTC_STABLE_POOL_INDEX: {
          "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near": 0,
          "0316eb71485b0ab14103307bf65a021042c6d380.factory.bridge.near": 1,
        },
        BTC_STABLE_POOL_ID: "3364",
        CUSDIDS: ["usn", "cusd.token.a11bd.near"],
        CUSD_STABLE_POOL_INDEX: {
          usn: 0,
          "cusd.token.a11bd.near": 1,
        },
        CUSD_STABLE_POOL_ID: "3433",
        STNEAR_POOL_ID: "3514",
        LINEAR_POOL_ID: "3515",
        STNEARIDS: ["meta-pool.near", "wrap.near"],
        LINEARIDS: ["linear-protocol.near", "wrap.near"],
        STNEAR_POOL_INDEX: {
          "meta-pool.near": 0,
          "wrap.near": 1,
        },
        LINEAR_POOL_INDEX: {
          "linear-protocol.near": 0,
          "wrap.near": 1,
        },
        NEARX_POOL_ID: "3612",
        NEARXIDS: ["nearx.stader-labs.near", "wrap.near"],
        NEARX_POOL_INDEX: {
          "nearx.stader-labs.near": 0,
          "wrap.near": 1,
        },
        NEW_NEARX_POOL_ID: "3688",
        NEW_NEARXIDS: ["v2-nearx.stader-labs.near", "wrap.near"],
        NEW_NEARX_POOL_INDEX: {
          "v2-nearx.stader-labs.near": 0,
          "wrap.near": 1,
        },
        USDT_POOL_ID: "3689",
        USDTIDS: [
          "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
          "usdt.tether-token.near",
        ],
        USDT_POOL_INDEX: {
          "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near": 0,
          "usdt.tether-token.near": 1,
        },

        RATED_POOLS_IDS: [
          "3514",
          "3515",
          "3612",
          "3688",
          "3689",
          "4179",
          "4513",
          "4514",
        ],
        DEGEN_POOLS_IDS: [""],
        USDTT_USDCC_USDT_USDC_POOL_INDEX: {
          "usdt.tether-token.near": 0,
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1": 1,
          "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near": 2,
          "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near": 3,
        },
        USDT_USDC_POOL_INDEX: {
          "usdt.tether-token.near": 0,
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1": 1,
        },
        FRAX_USDC_POOL_INDEX: {
          "853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near": 0,
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1": 1,
        },
      };
  }
}
