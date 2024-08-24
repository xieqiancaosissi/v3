import React, { useEffect, useState } from "react";
import { useAccountStore } from "@/stores/account";
import { toRoundedReadableNumber } from "@/utils/numbers";
import { getStablePoolDecimal } from "@/services/swap/swapUtils";
import { usePool } from "@/hooks/usePools";
import { scientificNotationToString } from "@/utils/numbers";
import { useYourliquidity } from "@/hooks/useStableShares";
import { PoolAvailableAmount } from "./ShareInFarm";
import { getYourPools } from "@/services/indexer";
import { isStablePool } from "@/services/swap/swapUtils";
import { getVEPoolId } from "@/services/referendum";
export default function ShareNumber(props: any) {
  const { id } = props;
  const { shares, pool } = usePool(id);
  const accountStore = useAccountStore();
  const { userTotalShare } = useYourliquidity(id);
  const [pools, setPools] = useState<any>([]);
  const [vePool, setVePool] = useState<any>([]);
  const isSignedIn = accountStore.isSignedIn;
  // useEffect(() => {
  //   if (!isSignedIn) return;
  //   // get all simple pools;
  //   getYourPools().then((res) => {
  //     // setPools(res.filter((p) => !isStablePool(p.id.toString())));
  //     const pools = res.filter((p) => !isStablePool(p.id.toString()));

  //     const vePools = pools?.find(
  //       (p: any) => Number(p.id) === Number(getVEPoolId())
  //     );
  //     console.log(vePools);
  //     setVePool(vePools);
  //   });
  // }, [isSignedIn]);
  // const vePool = pools?.find(
  //   (p: any) => Number(p.id) === Number(getVEPoolId())
  // );
  return (
    <div>
      {/* <span className="text-white">
        {accountStore.isSignedIn
          ? toRoundedReadableNumber({
              decimals: getStablePoolDecimal(id),
              number: shares,
              precision: 3,
            })
          : "- "}
      </span> */}
      {accountStore.isSignedIn && pool && shares ? (
        <PoolAvailableAmount
          shares={shares}
          pool={pool}
          className={"text-white"}
        />
      ) : (
        "-"
      )}
      <span className={`text-gray-10`}>
        {accountStore.isSignedIn
          ? ` / ${toRoundedReadableNumber({
              decimals: getStablePoolDecimal(id, pool),
              number: scientificNotationToString(
                userTotalShare.toExponential()
              ),
              precision: 3,
            })}`
          : "/ -"}
      </span>
    </div>
  );
}
