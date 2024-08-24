import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { useIntl, FormattedMessage } from "react-intl";
import { IoClose } from "@/components/reactIcons";
import { useClientMobile } from "@/utils/device";
import { OrderlyConnectIcon } from "./icons";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";

export default function ConnectConfirmModal(
  props: Modal.Props & {
    onConfirm: () => void;
  }
) {
  const orderbookDataStore = useOrderbookDataStore();
  const userExist = orderbookDataStore.getUserExists();
  const { onRequestClose, onConfirm } = props;
  const intl = useIntl();
  const isMobile = useClientMobile();
  return (
    <Modal {...props}>
      <div
        className={`rounded-2xl bg-dark-10 text-sm text-white`}
        style={{
          width: isMobile ? "100vw" : "460px",
        }}
      >
        <div className=" py-6 text-white text-sm flex flex-col px-6">
          {/* title or closeButton */}
          {isMobile ? (
            <div className="frcc">
              <OrderlyConnectIcon className=" transform scale-75" />
            </div>
          ) : (
            <div className="flex px-4 items-center pb-4 justify-end">
              <span
                className={"cursor-pointer text-gary-60"}
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRequestClose && onRequestClose(e);
                }}
              >
                <IoClose size={20} />
              </span>
            </div>
          )}
          {/* subTitle for mobile */}
          {isMobile && (
            <div className="lg:px-6 font-gothamBold xs:font-bold text-white pb-5 text-center text-base xs:text-sm mt-4">
              {userExist
                ? intl.formatMessage({
                    id: "connect_to_orderly_account",
                    defaultMessage:
                      "You need to (re)connect your Orderly account to use Ref's Orderbook.",
                  })
                : intl.formatMessage({
                    id: "first_register_orderly_tip",
                    defaultMessage:
                      "Your wallet must first be registered with Orderly in order to use the Orderbook.",
                  })}
            </div>
          )}
          {/* content */}
          <div className="flex flex-col xs:h-48 xs:text-sm xs:text-gray-60 xs:overflow-auto thinDarkscrollBar">
            <div>
              <FormattedMessage
                id="more_order_book_page_detail"
                values={{
                  br: <br />,
                }}
                defaultMessage={
                  "This Orderbook page is powered by Orderly Network, users are strongly encouraged to do their own research before connecting their wallet and/or placing any orders.{br} Ref Finance does not guarantee the security of the systems, smart contracts, and any funds deposited or sent to those systems and contracts.{br} Neither Ref Finance nor Orderly Network is responsible for any profit or loss of investment users made through this Orderbook page."
                }
              />
            </div>

            <div className="py-5">
              {!userExist && (
                <span className="mr-1">
                  {intl.formatMessage({
                    id: "must_register_tip",
                    defaultMessage:
                      "Your wallet must be registered with Orderly to trade on their system.",
                  })}
                </span>
              )}{" "}
              {intl.formatMessage({
                id: "learn_more_about",
                defaultMessage: "Learn more about",
              })}
              <a
                className="underline text-primary ml-1"
                href="https://orderly.org/"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Orderly Network
              </a>
              {intl.formatMessage({
                id: "learn_more_about_zh",
                defaultMessage: ".",
              })}
            </div>

            <div>
              {intl.formatMessage({
                id: "by_click_confirm",
                defaultMessage:
                  'By clicking "Confirm", you confirm that you have comprehensively reviewed and comprehended the contents aforementioned',
              })}
              2
            </div>
          </div>

          {/* action button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="bg-greenGradient w-52 xs:w-full rounded-lg mt-5 text-black flex items-center justify-center py-2.5 text-base"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRequestClose && onRequestClose(e);
                onConfirm();
              }}
            >
              {intl.formatMessage({
                id: "confirm",
                defaultMessage: "Confirm",
              })}
            </button>
          </div>

          {/* tip for mobile */}
          {isMobile && (
            <div className="text-sm  text-center text-white flex items-center lg:px-6 justify-center pb-8 py-3">
              {!userExist
                ? `* ${intl.formatMessage({
                    id: "register_deposit_tip",
                    defaultMessage:
                      "Registering will require a storage deposit.",
                  })}`
                : `* ${intl.formatMessage({
                    id: "increase_storage_deposit",
                    defaultMessage:
                      "You may need to increase the storage deposit on your Orderly account.",
                  })}`}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
