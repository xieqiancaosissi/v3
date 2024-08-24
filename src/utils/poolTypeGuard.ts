type PoolKind = "SIMPLE_POOL" | "DCL" | "RATED_SWAP" | "STABLE_SWAP" | string;

interface PoolResponse {
  pool_kind: PoolKind;
}

export const PoolRouterGuard = (
  res: PoolResponse,
  targetKind: PoolKind,
  fromStable?: boolean
): string => {
  if (targetKind != "" && res.pool_kind === targetKind) {
    return "";
  }
  switch (res.pool_kind) {
    case "DEGEN_SWAP":
      return "/sauce";
    case "SIMPLE_POOL":
      return "/pools";
    case "DCL":
      return "/poolV2";
    case "RATED_SWAP":
    case "STABLE_SWAP":
      return fromStable ? "" : "/sauce";
    default:
      return "/pools"; //
  }
};

export const PoolTypeGuard = (res: PoolResponse) => {
  switch (res.pool_kind) {
    case "DEGEN_SWAP":
      return "Degen";
    case "SIMPLE_POOL":
      return "Classic";
    case "DCL":
      return "DCL";
    case "RATED_SWAP":
    case "STABLE_SWAP":
      return "Stable";
  }
};
