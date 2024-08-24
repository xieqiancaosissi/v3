import React from "react";
import { toast } from "react-toastify";
import getConfig from "@/utils/config";
import { FormattedMessage } from "react-intl";
import { CloseIcon } from "@/components/common/Icons";
import { isMobile, isClientMobie } from "../../utils/device";
import { getAccountId } from "@/utils/wallet";
import { ErrorTriangle } from "@/components/common/Icons";
export enum TRANSACTION_WALLET_TYPE {
  NEAR_WALLET = "transactionHashes",
  SENDER_WALLET = "transactionHashesSender",
  WalletSelector = "transactionHashesWallets",
}

export enum TRANSACTION_ERROR_TYPE {
  SLIPPAGE_VIOLATION = "Slippage Violation",
  INVALID_PARAMS = "Invalid Params",
  RATES_EXPIRED = "Rates Expired",
  INTEGEROVERFLOW = "Integer Overflow",
  SHARESUPPLYOVERFLOW = "Share Supply Overflow",
  TOKEN_FROZEN = "Token Frozen",
  POOL_BALANCE_LESS = "Pool Balance Less Than MIN_RESERVE",
  NETH_ERROR = "Smart contract panicked",
}

const ERROR_PATTERN = {
  slippageErrorPattern: /ERR_MIN_AMOUNT|slippage error/i,
  invaliParamsErrorPattern: /invalid params/i,
  ratesExpiredErrorPattern: /Rates expired/i,
  integerOverflowErrorPattern: /Integer overflow/i,
  ShareSupplyOverflowErrorPattern: /shares_total_supply overflow/i,
  tokenFrozenErrorPattern: /token frozen/i,
  poolBalanceLessPattern: /pool reserved token balance less than MIN_RESERVE/i,
  nethErrorPattern: /Smart contract panicked: explicit guest panic/i,
};

export enum TRANSACTION_STATE {
  SUCCESS = "success",
  FAIL = "fail",
}

export const getURLInfo = () => {
  const search = window.location.search;

  const pathname = window.location.pathname;

  const errorType = new URLSearchParams(search).get("errorType");

  const errorCode = new URLSearchParams(search).get("errorCode");

  const signInErrorType = new URLSearchParams(search).get("signInErrorType");

  const txHashes = (
    new URLSearchParams(search).get(TRANSACTION_WALLET_TYPE.NEAR_WALLET) ||
    new URLSearchParams(search).get(TRANSACTION_WALLET_TYPE.SENDER_WALLET) ||
    new URLSearchParams(search).get(TRANSACTION_WALLET_TYPE.WalletSelector)
  )?.split(",");

  return {
    txHash:
      txHashes && txHashes.length > 0 ? txHashes[txHashes.length - 1] : "",
    pathname,
    errorType,
    signInErrorType,
    errorCode,
    txHashes,
  };
};

export const failToast = (txHash: string, errorType?: string) => {
  toast(
    <a
      className="text-error w-full h-full pl-1.5 py-1 flex flex-col text-sm"
      href={`${getConfig().explorerUrl}/txns/${txHash}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      style={{
        lineHeight: "20px",
      }}
    >
      <span className=" flex items-center">
        <span className="mr-2.5">
          <ErrorTriangle />
        </span>

        <span>
          <FormattedMessage
            id="transaction_failed"
            defaultMessage="Transaction failed"
          />
          {". "}
        </span>
      </span>

      <span>
        <FormattedMessage id="Type" defaultMessage="Type" />: {` `}
        <span className="whitespace-nowrap">{errorType}</span>
        {". "}
        <span
          className="underline decoration-1"
          style={{
            textDecorationThickness: "1px",
          }}
        >
          <FormattedMessage id="click_to_view" defaultMessage="Click to view" />
        </span>
      </span>
    </a>,
    {
      autoClose: false,
      closeOnClick: true,
      hideProgressBar: false,
      closeButton: <CloseIcon />,
      progressStyle: {
        background: "#FF7575",
        borderRadius: "8px",
      },
      style: {
        background: "#1D2932",
        boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.15)",
        border: "1px solid #FF7575",
        borderRadius: "8px",
      },
    }
  );
};

export const failToastAccount = (errorMsg?: string) => {
  toast(
    <a
      className="text-error w-full h-full pl-1.5 py-1 flex flex-col text-sm"
      href={`${getConfig().explorerUrl}/address/${getAccountId()}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      style={{
        lineHeight: "20px",
      }}
    >
      <span className=" flex items-center">
        <span className="mr-2.5">
          <ErrorTriangle />
        </span>

        <span>
          <FormattedMessage
            id="transaction_failed"
            defaultMessage="Transaction failed"
          />
          {". "}
        </span>
      </span>
      <span
        className="underline"
        style={{
          textDecorationThickness: "1px",
        }}
      >
        <FormattedMessage id="click_to_view" defaultMessage="Click to view" />
      </span>
    </a>,
    {
      autoClose: false,
      closeOnClick: true,
      hideProgressBar: false,
      closeButton: <CloseIcon />,
      progressStyle: {
        background: "#FF7575",
        borderRadius: "8px",
      },
      style: {
        background: "#1D2932",
        boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.15)",
        border: "1px solid #FF7575",
        borderRadius: "8px",
      },
    }
  );
};

export const parsedTransactionSuccessValue = (res: any) => {
  const status: any = res.status;

  const data: string | undefined = status.SuccessValue;

  if (data) {
    const buff = Buffer.from(data, "base64");
    const parsedData = buff.toString("ascii");
    return parsedData;
  }
};

export const parsedArgs = (res: any) => {
  const buff = Buffer.from(res, "base64");
  const parsedData = buff.toString("ascii");
  return parsedData;
};

export const parsedTransactionSuccessValueNeth = (res: any) => {
  const status: any = res?.receipts_outcome?.[1]?.outcome?.status;

  const data: string | undefined = status.SuccessValue;

  if (data) {
    const buff = Buffer.from(data, "base64");
    const parsedData = buff.toString("ascii");
    return parsedData;
  }
};

export const normalFailToast = (text: string, autoClose?: number) => {
  toast(
    <div
      className="text-error w-full h-full pl-1.5 py-1  flex-col text-sm"
      style={{
        lineHeight: "40px",
        width: isClientMobie() ? "" : "280px",
      }}
    >
      <span>{text}</span>
    </div>,
    {
      autoClose: typeof autoClose === "undefined" ? false : autoClose,
      closeOnClick: true,
      hideProgressBar: false,
      closeButton: <CloseIcon />,
      progressStyle: {
        background: "#FF7575",
        borderRadius: "8px",
      },
      style: {
        background: "#1D2932",
        boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.15)",
        border: "1px solid #FF7575",
        borderRadius: "8px",
      },
    }
  );
};
export function SwapCheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM12.5657 6.16569C12.8781 5.85327 12.8781 5.34673 12.5657 5.03431C12.2533 4.7219 11.7467 4.7219 11.4343 5.03431L7.2 9.26863L5.36569 7.43431C5.05327 7.1219 4.54673 7.1219 4.23431 7.43431C3.9219 7.74673 3.9219 8.25327 4.23431 8.56569L7.2 11.5314L12.5657 6.16569Z"
        fill="#00FFD1"
      />
    </svg>
  );
}
export const normalSuccessToast = (text: string) => {
  toast(
    <div
      className="text-white w-full h-full pl-1.5 text-sm  flex-wrap items-center"
      style={{
        lineHeight: "30px",
        width: isClientMobie() ? "" : "270px",
      }}
    >
      <div className="w-4 h-4 mr-2  relative top-1 inline-flex">
        <SwapCheckIcon />
      </div>
      {text}
    </div>,
    {
      autoClose: 5000,
      closeOnClick: true,
      hideProgressBar: false,
      closeButton: <CloseIcon />,
      progressStyle: {
        background: "#00FFD1",
        borderRadius: "8px",
      },
      style: {
        background: "#1D2932",
        boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.15)",
        borderRadius: "8px",
        minHeight: "0px",
      },
    }
  );
};

const TOAST_ID_KEY = "ref-orderly-toast-id-key";

export const marginPopUp = (tip: string, type: "error" | "success") => {
  const mobileDevice = isMobile();

  const pre_id = sessionStorage.getItem(TOAST_ID_KEY);

  const preActive = toast.isActive(pre_id!);

  if (preActive) {
    toast.dismiss();
  }

  const cur_id = toast(
    <div
      className={`flex-col flex px-2  text-sm  ${
        type === "success" ? "text-marginGrayBg" : "text-marginRedBg"
      }  w-full`}
    >
      <span className="text-white  text-sm">{tip}</span>

      <div
        className={`absolute w-1  ${
          type === "error" ? "bg-textRed" : "bg-buyGreen"
        } bottom-0 h-full left-0`}
      ></div>
    </div>,
    {
      autoClose: 3000,
      closeOnClick: true,
      hideProgressBar: true,
      closeButton: false,
      position: mobileDevice ? "top-center" : "bottom-right",
      style: {
        boxShadow: "0px -5px 10px rgba(0, 0, 0, 0.25)",
        borderRadius: "4px",
        zIndex: 9999,
        left: mobileDevice ? "12.5%" : "",
        overflow: "hidden",
        width: mobileDevice ? "75%" : "90%",
        background: type === "success" ? "#334049" : "#904247",
        minHeight: "40px",
        top: mobileDevice ? "50px" : "",
      },
    }
  );

  sessionStorage.setItem(TOAST_ID_KEY, cur_id.toString());
};
