import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useAccountStore } from "@/stores/account";
import { PerpOrSpot } from "@/services/orderbook/utils";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
import { GuideLine } from "./icons";
export const REF_ORDERLY_NEW_USER_TIP = "REF_ORDERLY_NEW_USER_TIP_KEY";
export function NewUserTip(props: {
  style?: React.CSSProperties;
  type: "perp-pc" | "spot-pc" | "perp-mobile" | "spot-mobile";
}) {
  const { type } = props;
  const orderbookDataStore = useOrderbookDataStore();
  const symbol = orderbookDataStore.getSymbol();
  const newUserTip = orderbookDataStore.getNewUserTip();
  const symbolType = PerpOrSpot(symbol);

  const accountStore = useAccountStore();
  const accountId = accountStore.getAccountId();

  const tipKey = `REF_FI_NEW_USER_TIP_CHECK_${symbolType}` + ":" + accountId;

  const haveCheck = localStorage.getItem(tipKey) === "1";

  const [show, setShow] = useState<boolean>(true);

  if (haveCheck || !newUserTip || !show) return null;

  return (
    <div
      className={`absolute font-gotham ${
        type == "spot-pc"
          ? "-right-1/2 top-7"
          : type === "perp-pc"
          ? "right-0 top-5"
          : type === "perp-mobile"
          ? " bottom-5 "
          : "right-0 bottom-5"
      } 
      
        ${
          type === "perp-mobile" || type === "spot-mobile"
            ? "flex-col-reverse"
            : "flex-col"
        }
      
      flex text-black text-sm`}
      style={{
        width: "265px",
        zIndex: 70,
        height: "100px",
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <span
        className={
          type === "perp-pc"
            ? "transform relative right-14 rotate-180"
            : type === "spot-pc"
            ? "transform rotate-180 -translate-x-1/2"
            : type === "perp-mobile"
            ? "  max-w-max -right-1/2 relative"
            : " max-w-max relative -right-1/2"
        }
        style={{
          right: type === "spot-mobile" ? "-60%" : "",
        }}
      >
        <GuideLine></GuideLine>
      </span>

      <div
        className="rounded-2xl bg-gradientFromHover px-5 py-4 flex flex-col items-center gap-1"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShow(false);
          localStorage.setItem(tipKey, "1");
        }}
      >
        {(type == "perp-pc" || type == "perp-mobile") && (
          <span>
            <FormattedMessage
              id="orderly_new_user_tip"
              defaultMessage={
                "Check Balance and deposit <strong>USDC.e</strong>  to begin your trading journey."
              }
              values={{
                //   @ts-ignore
                strong: (...chunks) => (
                  <span className="font-gothamBold">{chunks}</span>
                ),
              }}
            ></FormattedMessage>
          </span>
        )}

        {(type == "spot-pc" || type === "spot-mobile") && (
          <span>
            <FormattedMessage
              id="orderly_new_usr_spot_tip"
              defaultMessage={"Deposit assets to begin your trading journey."}
              values={{
                //   @ts-ignore
                strong: (...chunks) => (
                  <span className="font-gothamBold">{chunks}</span>
                ),
              }}
            ></FormattedMessage>
          </span>
        )}

        <div className="rounded-md border border-black px-2 py-1 frcc cursor-pointer ">
          <FormattedMessage
            id="got_it"
            defaultMessage={"Got it"}
          ></FormattedMessage>
          !
        </div>
      </div>
    </div>
  );
}
