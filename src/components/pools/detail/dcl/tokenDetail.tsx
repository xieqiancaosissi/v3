import React from "react";
import tokenIcons from "@/utils/tokenIconConfig";
import { TokenIconComponent } from "@/components/pools/TokenIconWithTkn/index";
import { useRiskTokens } from "@/hooks/useRiskTokens";
import styles from "./style.module.css";

export default function TokenDetail({
  poolDetail,
  updatedMapList,
}: {
  poolDetail: any;
  updatedMapList: any;
}) {
  const { pureIdList } = useRiskTokens();

  return (
    <div>
      {updatedMapList.map((item: any, index: any) => {
        return (
          <div
            className={styles.tokenImgContainer}
            key={"poolTokendetail_" + index}
          >
            {item?.token_account_ids?.map((ite: any, ind: number) => (
              <TokenIconComponent
                key={ite.tokenId + ind}
                ite={ite}
                tokenIcons={tokenIcons}
                pureIdList={pureIdList}
                ind={ind}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
