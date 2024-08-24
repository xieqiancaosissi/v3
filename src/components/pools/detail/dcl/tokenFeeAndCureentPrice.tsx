import React, { useState, useEffect } from "react";
import { SplitRectangleIcon, ExchangeIcon } from "@/components/pools/icon";
import {
  formatPercentage,
  toInternationalCurrencySystem_usd,
} from "@/utils/uiNumber";

export default function TokenFeeAndCureentPrice({
  poolDetail,
}: {
  poolDetail: any;
}) {
  //
  return (
    <div className="flex items-center text-white h-10 lg:justify-around xsm:w-full lg:ml-9">
      <div className="text-sm">
        <h3 className="text-gray-50 font-normal">Fee</h3>
        <p>{formatPercentage(poolDetail?.total_fee * 100)}</p>
      </div>
      <SplitRectangleIcon className="mx-7" />
      <div className="text-sm lg:min-w-45">
        <h3 className="text-gray-50 font-normal">Top Bin APR(24h)</h3>
        <p>{formatPercentage(poolDetail?.apy)}</p>
      </div>
    </div>
  );
}
