import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useIntl } from "react-intl";
import { TokenInfo } from "@/interfaces/orderbook";
import { useClientMobile } from "@/utils/device";
import { digitWrapperAsset } from "@/services/orderbook/utiles";
import { IoClose, FiSearch, MdArrowDropDown } from "@/components/reactIcons";
import { NearIcon, OrderlyIcon } from "@/components/orderbook/icons";
export default function SelectTokenModal(
  props: Modal.Props & {
    onSelect: (tokenId: string) => void;
    tokensInfo: TokenInfo[] | undefined;
    balances: any;
    orderBy: "wallet" | "orderly";
  }
) {
  const { onRequestClose, onSelect, tokensInfo, balances, orderBy } = props;

  const [sortOrderlyAccount, setSortOrderlyAccount] = useState<"asc" | "desc">(
    "desc"
  );

  const [sortNearBalance, setSortNearBalance] = useState<"asc" | "desc">(
    "desc"
  );

  const [searchValue, setSearchValue] = useState<string>("");

  const [sortByBalance, setSortByBalance] = useState<"wallet" | "orderly">(
    orderBy
  );
  const intl = useIntl();
  useEffect(() => {
    setSortByBalance(orderBy);
  }, [orderBy]);

  const sortingFunc = (a: any, b: any) => {
    if (sortByBalance === "wallet" || sortByBalance === undefined) {
      if (sortNearBalance === undefined || sortNearBalance === "desc") {
        return b.wallet_balance - a.wallet_balance;
      } else {
        return a.wallet_balance - b.wallet_balance;
      }
    } else {
      if (sortOrderlyAccount === undefined || sortOrderlyAccount === "desc") {
        return b.holding - a.holding;
      } else {
        return a.holding - b.holding;
      }
    }
  };

  const filterFunc = (token: any) => {
    const id = token.id.toLowerCase();

    const name = token.name.toLowerCase();

    return (
      !searchValue ||
      id.includes(searchValue.toLowerCase()) ||
      name?.includes(searchValue.toLowerCase())
    );
  };

  const isMobile = useClientMobile();

  if (!tokensInfo) return null;

  return (
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
        className={` ${
          isMobile
            ? "rounded-t-2xl fixed w-screen bottom-0 left-0"
            : "rounded-2xl gradientBorderWrapperNoShadowForOrderly border"
        }     bg-dark-10 text-sm text-gray-60  `}
      >
        <div className=" py-6 text-primaryOrderly text-sm flex flex-col  lg:w-p400  lg:h-p560">
          <div className="flex px-4 items-center pb-6 justify-between">
            <span className="text-white text-lg font-bold">
              {intl.formatMessage({
                id: "select_token_orderly",
                defaultMessage: "Select Token",
              })}
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
          <div className="w-full px-4">
            <div className="w-full  mb-4 pl-2 py-3 flex items-center rounded-lg bg-black bg-opacity-20 border border-border4">
              <span className="mr-2">
                <FiSearch className={!!searchValue ? "text-white" : ""} />
              </span>

              <input
                type="text"
                className="w-full"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                placeholder={intl.formatMessage({
                  id: "search_token",
                  defaultMessage: "Search Token",
                })}
              ></input>
            </div>
          </div>

          <div className="grid px-3  grid-cols-3">
            <div className="justify-self-start">
              {intl.formatMessage({
                id: "assets",
                defaultMessage: "Assets",
              })}
            </div>

            <div
              className="justify-self-center flex items-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (
                  sortNearBalance === "asc" ||
                  sortNearBalance === undefined
                ) {
                  return;
                }

                setSortByBalance("wallet");
              }}
            >
              <NearIcon />

              <span className="ml-2 whitespace-nowrap">
                {intl.formatMessage({
                  id: "wallet_up",
                  defaultMessage: "Wallet",
                })}
              </span>

              <MdArrowDropDown
                size={22}
                className={`${
                  sortByBalance === "wallet" && sortNearBalance === "asc"
                    ? "transform rotate-180 "
                    : ""
                } ${
                  sortByBalance === "wallet" && sortNearBalance !== undefined
                    ? "text-white"
                    : ""
                } cursor-pointer`}
              />
            </div>

            <div
              className="justify-self-end flex items-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (
                  sortOrderlyAccount === "asc" ||
                  sortOrderlyAccount === undefined
                ) {
                  return;
                }

                setSortByBalance("orderly");
              }}
            >
              <OrderlyIcon />
              <span className="ml-2 ">
                {intl.formatMessage({
                  id: "available_orderly",
                  defaultMessage: "Available",
                })}
              </span>

              <MdArrowDropDown
                size={22}
                className={`${
                  sortByBalance === "orderly" && sortOrderlyAccount === "asc"
                    ? "transform rotate-180 "
                    : ""
                } cursor-pointer ${
                  sortByBalance === "orderly" &&
                  sortOrderlyAccount !== undefined
                    ? "text-white"
                    : ""
                }`}
              />
            </div>
          </div>

          <div
            className="h-full overflow-auto"
            style={{
              height: isMobile ? "calc(48px * 6)" : "",
            }}
          >
            {balances
              .filter(filterFunc)
              .sort(sortingFunc)
              .map((b: any) => {
                return (
                  <div
                    key={b.id}
                    className="grid grid-cols-3 p-3 px-3 hover:bg-white hover:bg-opacity-5 text-white cursor-pointer"
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelect(b.id);
                      onRequestClose && onRequestClose(e);
                    }}
                  >
                    <div className="flex items-center  justify-self-start">
                      <img
                        src={b.meta.icon}
                        alt=""
                        className="w-6 h-6 rounded-full flex-shrink-0"
                      />

                      <span className="ml-2 mr-1">
                        {tokensInfo.find(
                          (t: any) => t.token_account_id === b.id
                        )?.token || ""}
                      </span>
                    </div>

                    <div
                      className="flex items-center justify-self-end relative right-6"
                      title={b.wallet_balance.toString()}
                    >
                      {digitWrapperAsset(b.wallet_balance.toString())}
                    </div>

                    <div
                      className="justify-self-end flex relative right-4 items-center"
                      title={b.holding.toString()}
                    >
                      {digitWrapperAsset(b.holding.toString())}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
