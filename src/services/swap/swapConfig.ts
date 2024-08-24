import getConfig from "@/utils/config";
import getStablePoolConfig from "@/utils/getStablePoolConfig";
export const {
  BTCIDS,
  CUSDIDS,
  BTC_STABLE_POOL_ID,
  CUSD_STABLE_POOL_ID,
  STNEAR_POOL_ID,
  STNEARIDS,
  BTC_STABLE_POOL_INDEX,
  CUSD_STABLE_POOL_INDEX,
  STNEAR_POOL_INDEX,
  LINEARIDS,
  LINEAR_POOL_INDEX,
  LINEAR_POOL_ID,
  NEARX_POOL_ID,
  NEARX_POOL_INDEX,
  NEARXIDS,
  NEW_NEARXIDS,
  NEW_NEARX_POOL_ID,
  NEW_NEARX_POOL_INDEX,
  USDTIDS,
  USDT_POOL_ID,
  USDT_POOL_INDEX,
  USDTT_USDCC_USDT_USDC_POOL_INDEX,
  USDT_USDC_POOL_INDEX,
  FRAX_USDC_POOL_INDEX,
  DEGEN_POOLS_IDS,
} = getStablePoolConfig();
const {
  USDTT_USDCC_USDT_USDC_POOL_ID,
  STABLE_POOL_ID,
  STABLE_POOL_USN_ID,
  STABLE_TOKEN_INDEX,
  STABLE_TOKEN_USN_INDEX,
  USDT_USDC_POOL_ID,
  FRAX_USDC_POOL_ID,
  STABLE_TOKEN_USN_IDS,
  USDTT_USDCC_USDT_USDC_TOKEN_IDS,
  USDT_USDC_TOKEN_IDS,
  FRAX_USDC_TOKEN_IDS,
  STABLE_TOKEN_IDS,
  DEGEN_POOLS_TOKEN_IDS,
} = getConfig();
export const ALL_STABLE_POOL_IDS = [
  USDTT_USDCC_USDT_USDC_POOL_ID,
  STABLE_POOL_ID,
  STABLE_POOL_USN_ID,
  BTC_STABLE_POOL_ID,
  STNEAR_POOL_ID,
  CUSD_STABLE_POOL_ID,
  LINEAR_POOL_ID,
  NEARX_POOL_ID,
  NEW_NEARX_POOL_ID,
  USDT_POOL_ID,
  USDT_USDC_POOL_ID,
  FRAX_USDC_POOL_ID,
]
  .filter((_) => _)
  .map((id) => id.toString());
export const getStableTokenIndex = (stable_pool_id: string | number) => {
  const id = stable_pool_id.toString();
  switch (id) {
    case STABLE_POOL_ID.toString():
      return STABLE_TOKEN_INDEX;
    case STABLE_POOL_USN_ID.toString():
      return STABLE_TOKEN_USN_INDEX;
    case BTC_STABLE_POOL_ID:
      return BTC_STABLE_POOL_INDEX;
    case STNEAR_POOL_ID:
      return STNEAR_POOL_INDEX;
    case CUSD_STABLE_POOL_ID:
      return CUSD_STABLE_POOL_INDEX;
    case LINEAR_POOL_ID:
      return LINEAR_POOL_INDEX;
    case NEARX_POOL_ID:
      return NEARX_POOL_INDEX;
    case NEW_NEARX_POOL_ID:
      return NEW_NEARX_POOL_INDEX;

    case USDT_POOL_ID:
      return USDT_POOL_INDEX;
    case USDTT_USDCC_USDT_USDC_POOL_ID.toString():
      return USDTT_USDCC_USDT_USDC_POOL_INDEX;
    case USDT_USDC_POOL_ID.toString():
      return USDT_USDC_POOL_INDEX;
    case FRAX_USDC_POOL_ID.toString():
      return FRAX_USDC_POOL_INDEX;
    default:
      return {};
  }
};
export const extraStableTokenIds = BTCIDS.concat(LINEARIDS)
  .concat(USDTIDS)
  .concat(STNEARIDS)
  .concat(NEARXIDS)
  .concat(CUSDIDS)
  .concat(NEW_NEARXIDS)
  .concat(USDTIDS)
  .filter((_) => !!_);
export const AllStableTokenIds = new Array(
  ...new Set(
    STABLE_TOKEN_USN_IDS.concat(STABLE_TOKEN_IDS)
      .concat(extraStableTokenIds)
      .concat(USDTT_USDCC_USDT_USDC_TOKEN_IDS)
      .concat(USDT_USDC_TOKEN_IDS)
      .concat(FRAX_USDC_TOKEN_IDS)
      .concat(DEGEN_POOLS_TOKEN_IDS)
  )
);
