import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import Big from "big.js";
import { useIntl, FormattedMessage } from "react-intl";
import { TokenInfo } from "@/interfaces/orderbook";
import { getFTmetadata } from "@/services/orderbook/near";
import SelectTokenModal from "./selectTokenModal";
import { nearMetadata } from "@/services/wrap-near";
import { ButtonTextWrapper } from "@/components/common/Button";
import { IoClose, MdKeyboardArrowDown } from "@/components/reactIcons";
import { NearIcon, OrderlyIcon } from "./icons";
import {
  scientificNotationToString,
  percentOfBigNumber,
  percent,
} from "@/utils/numbers";
import { digitWrapperAsset } from "@/services/orderbook/utiles";
import { useClientMobile } from "@/utils/device";
import { useTokensBalances } from "@/services/orderbook/UserBoard/state";
import { Holding } from "@/interfaces/orderbook";
const symbolsArr = ["e", "E", "+", "-"];
export default function AssetManagerModal(
  props: Modal.Props & {
    type: "deposit" | "withdraw" | undefined;
    onClick: (amount: string, tokenId: string) => void;
    tokenId: string;
    walletBalance?: number | string;
    tokensInfo: TokenInfo[] | undefined;
    freeCollateral: string;
    curHoldingOut: Holding | undefined;
  }
) {
  const {
    onClick,
    walletBalance: walletBalanceProp,
    onRequestClose,
    type,
    tokenId: tokenIdProp,
    tokensInfo,
    isOpen,
    freeCollateral,
    curHoldingOut,
  } = props;

  const [tokenId, setTokenId] = useState<string | undefined>(tokenIdProp);

  const isMobile = useClientMobile();

  useEffect(() => {
    setTokenId(tokenIdProp);
  }, [tokenIdProp]);

  const [showSelectToken, setShowSelectToken] = useState<boolean>(false);

  const [tokenMeta, setTokenMeta] = useState<any>();

  const [percentage, setPercentage] = useState<string>("0");

  const progressBarIndex = [0, 25, 50, 75, 100];

  const [hoverToken, setHoverToken] = useState<boolean>(false);

  const balances = useTokensBalances(
    tokensInfo?.map((token) => {
      return {
        id: token.token_account_id,
        decimals: token.decimals,
      };
    }) || [],
    tokensInfo,
    isOpen,
    freeCollateral,
    curHoldingOut
  );

  const walletBalance =
    balances?.find((b: any) => b.id.toLowerCase() === tokenId!.toLowerCase())
      ?.wallet_balance ||
    walletBalanceProp ||
    "0";

  const displayAccountBalance =
    balances
      ?.find((b: any) => b.id.toLowerCase() === tokenId!.toLowerCase())
      ?.holding?.toString() || "0";

  useEffect(() => {
    if (!tokenId) return;
    if (tokenId === "near") {
      setTokenMeta(nearMetadata);
    } else
      getFTmetadata(tokenId).then((meta) => {
        setTokenMeta(meta);
      });
  }, [tokenId]);

  const [inputValue, setInputValue] = useState<string>();
  const ref = useRef<HTMLInputElement>(null);

  const rangeRef = useRef<HTMLInputElement>(null);
  const decimalPlaceLimit = Math.min(8, tokenMeta?.decimals || 8);

  const setAmountByShareFromBar = (sharePercent: string) => {
    setPercentage(sharePercent);

    const sharePercentOfValue = percentOfBigNumber(
      Number(sharePercent),
      type === "deposit"
        ? tokenId!.toLowerCase() === "near"
          ? new Big(Number(walletBalance) < 0.5 ? 0.5 : walletBalance)
              .minus(0.5)
              .toFixed(24)
          : walletBalance
        : displayAccountBalance.toString(),
      decimalPlaceLimit || tokenMeta.decimals
    );

    if (
      new Big(sharePercentOfValue).gt(new Big(walletBalance)) &&
      type === "deposit"
    ) {
      setInputValue("0");
      return;
    }

    if (Number(sharePercent) === 0) {
      setInputValue("");
    } else {
      setInputValue(sharePercentOfValue);
    }
  };

  const [buttonLoading, setButtonLoading] = useState(false);
  const intl = useIntl();
  useEffect(() => {
    if (tokenId && tokenMeta) {
      setAmountByShareFromBar(percentage);
    }
  }, [tokenId, tokenMeta]);

  useEffect(() => {
    if (rangeRef.current) {
      rangeRef.current.style.backgroundSize = `${percentage}% 100%`;
    }
  }, [percentage, rangeRef.current]);

  if (!tokenId || !tokenMeta) return null;

  function validation() {
    if (type === "deposit") {
      if (
        tokenId!.toLowerCase() === "near" &&
        new Big(walletBalance || 0).minus(new Big(inputValue || "0")).lt(0.5) &&
        walletBalance !== ""
      ) {
        return false;
      }

      if (
        tokenId!.toLowerCase() !== "near" &&
        new Big(walletBalance || 0).minus(new Big(inputValue || "0")).lt(0)
      ) {
        return false;
      }
    }

    if (type === "withdraw") {
      if (
        new Big(displayAccountBalance || 0)
          .minus(new Big(inputValue || "0"))
          .lt(0)
      ) {
        return false;
      }
    }

    return true;
  }

  return (
    <>
      <Modal
        {...props}
        style={{
          content: isMobile
            ? {
                position: "fixed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                top: "none",
                bottom: "0px",
                left: "0px",
                transform: "translate(-50%, -20px)",
                outline: "none",
              }
            : {
                zIndex: 999,
              },
        }}
      >
        <div
          className={` lg:w-p410  ${
            isMobile
              ? "xs:w-screen xs:fixed xs:bottom-0 xs:left-0 rounded-t-2xl"
              : "gradientBorderWrapperNoShadowForOrderly border rounded-2xl"
          }  bg-dark-10 text-sm text-gray-60`}
        >
          <div className="px-5 py-6 flex flex-col ">
            <div className="flex items-center pb-6 justify-between">
              <span className="text-white text-lg font-bold">
                {props.type === "deposit"
                  ? intl.formatMessage({
                      id: "deposit",
                      defaultMessage: "Deposit",
                    })
                  : props.type === "withdraw"
                  ? intl.formatMessage({
                      id: "withdraw",
                      defaultMessage: "Withdraw",
                    })
                  : ""}
              </span>

              <span
                className={isMobile ? "hidden" : "cursor-pointer "}
                onClick={(e: any) => {
                  onRequestClose && onRequestClose(e);
                }}
              >
                <IoClose size={20} />
              </span>
            </div>

            <div className="flex items-center pb-3 justify-between">
              <span className="flex items-center">
                <NearIcon />{" "}
                <span className="ml-2 whitespace-nowrap">
                  {intl.formatMessage({
                    id: "wallet_up",
                    defaultMessage: "Wallet",
                  })}
                </span>
              </span>

              <span title={walletBalance?.toString() || ""}>
                {!walletBalance
                  ? "-"
                  : digitWrapperAsset(walletBalance.toString() || "0")}
              </span>
            </div>

            <div className="flex items-center pb-4 justify-between">
              <span className="flex items-center ">
                {" "}
                <OrderlyIcon />
                <span className="ml-2 whitespace-nowrap">
                  {intl.formatMessage({
                    id: "available_orderly",
                    defaultMessage: "Available",
                  })}
                </span>
              </span>

              <span title={displayAccountBalance?.toString() || ""}>
                {digitWrapperAsset(displayAccountBalance.toString())}
              </span>
            </div>

            <div className="flex mb-5 items-center border border-border2 w-full bg-black bg-opacity-10 rounded-2xl px-3 py-3">
              <input
                inputMode="decimal"
                ref={ref}
                onWheel={(e) => (ref.current ? ref.current.blur() : null)}
                className="text-white text-xl w-full"
                value={inputValue}
                type="number"
                placeholder="0.0"
                min={0}
                onInput={(e) => {
                  if (decimalPlaceLimit === undefined) return;

                  function limitDecimalPlaces(e: any) {
                    const value = e.target.value;
                    if (
                      value.includes(".") &&
                      value.split(".")[1].length > decimalPlaceLimit
                    ) {
                      e.target.value = value.slice(
                        0,
                        value.indexOf(".") + decimalPlaceLimit + 1
                      );
                    }
                  }

                  limitDecimalPlaces(e);
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputValue(e.target.value);

                  const percentage =
                    Number(
                      type === "deposit" ? walletBalance : displayAccountBalance
                    ) > 0
                      ? percent(
                          value || "0",
                          type === "deposit"
                            ? type === "deposit" &&
                              tokenId.toLowerCase() === "near"
                              ? new Big(
                                  Number(walletBalance) < 0.5
                                    ? 0.5
                                    : walletBalance || 0
                                )
                                  .minus(0.5)
                                  .toFixed(24)
                              : walletBalance.toString()
                            : displayAccountBalance.toString()
                        ).toString()
                      : "0";
                  setPercentage(
                    scientificNotationToString(
                      Number(percentage) > 100 ? "100" : percentage
                    )
                  );
                }}
                onKeyDown={(e) =>
                  symbolsArr.includes(e.key) && e.preventDefault()
                }
              />

              <div
                className="rounded-3xl p-1  hover:bg-symbolHover3 cursor-pointer flex flex-shrink-0 pr-2 items-center"
                style={{
                  background: hoverToken ? "rgba(126, 138, 147, 0.1)" : "",
                }}
                onMouseEnter={() => {
                  setHoverToken(true);
                }}
                onMouseLeave={() => {
                  setHoverToken(false);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSelectToken(true);
                }}
              >
                <img
                  src={tokenMeta.icon}
                  className="rounded-full w-6 h-6 mr-2"
                  alt=""
                />
                <span className="text-white font-bold text-base">
                  {tokenMeta.symbol}
                </span>
                <MdKeyboardArrowDown size={20} />
              </div>
            </div>

            <div className="pb-8">
              <div className="flex items-center justify-between  px-1.5 ">
                {progressBarIndex.map((index, i) => {
                  return (
                    <div
                      className="flex flex-col items-center text-xs cursor-pointer w-4"
                      key={i}
                      onClick={() => {
                        setAmountByShareFromBar(index.toString());
                      }}
                    >
                      <span>{index}%</span>
                      <span>∣</span>
                    </div>
                  );
                })}
              </div>

              <div className="py-1 px-1 relative">
                <input
                  ref={rangeRef}
                  onChange={(e) => {
                    setAmountByShareFromBar(e.target.value);
                  }}
                  value={percentage}
                  type="range"
                  className={`w-full cursor-pointer deposit-bar remove-by-share-bar`}
                  min="0"
                  max="100"
                  step="any"
                  inputMode="decimal"
                  style={{
                    backgroundSize: `${percentage}% 100%`,
                  }}
                />

                <div
                  className={`rangeText rounded-lg absolute py-0.5 text-xs text-black font-bold text-center w-10`}
                  style={{
                    background: "#00C6A2",
                    left: `calc(${percentage}% - 40px * ${percentage} / 100)`,
                    position: "absolute",
                    top: "20px",
                  }}
                >
                  {Number(percentage) > 0 && Number(percentage) < 1
                    ? 1
                    : Number(percentage) > 100
                    ? 100
                    : Math.floor(Number(percentage))}
                  %
                </div>
              </div>
            </div>
            {type === "deposit" &&
              (!validation() || +percentage == 100) &&
              tokenId.toLowerCase() === "near" && (
                <div className="text-warn text-center mb-2 text-xs xs:-mt-2 lg:whitespace-nowrap">
                  <FormattedMessage
                    id="near_locked_in_wallet_for_covering"
                    defaultMessage="0.5 NEAR locked in wallet for covering transaction fee"
                  />
                </div>
              )}

            <button
              className={`flex ${
                !validation() ||
                new Big(inputValue || 0).lte(0) ||
                buttonLoading
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              } items-center justify-center  font-bold text-base text-white py-2.5 rounded-lg bg-primaryGradient`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!inputValue) return;
                setButtonLoading(true);
                onClick(inputValue, tokenId);
              }}
              disabled={
                !validation() ||
                new Big(inputValue || 0).lte(0) ||
                buttonLoading
              }
            >
              <ButtonTextWrapper
                loading={buttonLoading}
                Text={() => (
                  <span>
                    {type === "deposit"
                      ? intl.formatMessage({
                          id: "deposit",
                          defaultMessage: "Deposit",
                        })
                      : type === "withdraw"
                      ? !validation()
                        ? intl.formatMessage({
                            id: "insufficient_balance",
                            defaultMessage: "Insufficient Balance",
                          })
                        : intl.formatMessage({
                            id: "withdraw",
                            defaultMessage: "Withdraw",
                          })
                      : ""}
                  </span>
                )}
              ></ButtonTextWrapper>
            </button>
          </div>
        </div>
      </Modal>

      <SelectTokenModal
        onSelect={setTokenId}
        isOpen={showSelectToken}
        onRequestClose={() => {
          setShowSelectToken(false);
        }}
        balances={balances}
        tokensInfo={props.tokensInfo}
        style={{
          overlay: {
            zIndex: 1000,
          },
        }}
        orderBy={type === "deposit" ? "wallet" : "orderly"}
      />
    </>
  );
}
