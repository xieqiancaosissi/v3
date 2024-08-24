import { useEffect, useState } from "react";
import { LedgerIcon } from "./icons2";
import { transform } from "lodash";

export const walletIconConfig: Record<string, any> = {
  ledger: <LedgerIcon className="" style={{ transform: "scale(0.2)" }} />,
};
