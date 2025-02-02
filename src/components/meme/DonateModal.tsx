import React, { useState, useContext, useMemo, useRef, useEffect } from "react";
import Big from "big.js";
import { isEmpty } from "lodash";
import Modal from "react-modal";
import { isMobile } from "../../utils/device";
import { TokenMetadata } from "../../services/ft-contract";
import { MemeContext } from "./context";
import { getMemeContractConfig } from "./memeConfig";
import { InputAmount } from "./InputBox";
import { toReadableNumber, toNonDivisibleNumber } from "../../utils/numbers";
import { donate } from "../../services/meme";
import { ModalCloseIcon, SelectsDown, TipIcon } from "./icons";
import { sortByXrefStaked, emptyObject } from "./tool";
import DonateConfirmModal from "./DonateConfirmModal";
import { useAccountStore } from "@/stores/account";
import { ButtonTextWrapper } from "../common/Button";
import { showWalletSelectorModal } from "@/utils/wallet";
import { useAppStore } from "@/stores/app";
const { MEME_TOKEN_XREF_MAP } = getMemeContractConfig();
function DonateModal(props: any) {
  const { isOpen, onRequestClose } = props;
  const [selectedTab, setSelectedTab] = useState("");
  const [confirmIsOpen, setConfirmIsOpen] = useState<boolean>(false);
  const [donateLoading, setDonateLoading] = useState<boolean>(false);
  const { allTokenMetadatas, tokenPriceList, user_balances, xrefSeeds } =
    useContext(MemeContext)!;
  const { getIsSignedIn } = useAccountStore();
  const isSignedIn = getIsSignedIn();
  const appStore = useAppStore();
  const balance = useMemo(() => {
    if (allTokenMetadatas?.[selectedTab]) {
      return toReadableNumber(
        allTokenMetadatas?.[selectedTab].decimals,
        user_balances[selectedTab] || "0"
      );
    }
    return "0";
  }, [selectedTab, user_balances, Object.keys(allTokenMetadatas || {}).length]);
  const [amount, setAmount] = useState("");
  const cardWidth = isMobile() ? "100vw" : "28vw";
  const cardHeight = isMobile() ? "90vh" : "80vh";
  useEffect(() => {
    if (!isEmpty(xrefSeeds)) {
      setSelectedTab(
        Object.keys(MEME_TOKEN_XREF_MAP).sort(sortByXrefStaked(xrefSeeds))[0]
      );
    }
  }, [xrefSeeds]);
  function doateToken() {
    setDonateLoading(true);
    donate({
      tokenId: selectedTab,
      amount: Big(
        toNonDivisibleNumber(allTokenMetadatas[selectedTab].decimals, amount)
      ).toFixed(0),
    });
  }
  const disabled =
    Big(amount || 0).lte(0) ||
    Big(amount || 0).gt(balance) ||
    !selectedTab ||
    !Object.keys(xrefSeeds).length;
  const is_mobile = isMobile();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const selectedDefaultTab = allTokenMetadatas[selectedTab];
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  function openDonateConfirmModal() {
    setConfirmIsOpen(true);
  }
  function closeDonateConfirmModal() {
    setConfirmIsOpen(false);
  }
  function showWalletSelector() {
    showWalletSelectorModal(appStore.setShowRiskModal);
  }
  if (!selectedTab) return null;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          // backdropFilter: 'blur(15px)',
          // WebkitBackdropFilter: 'blur(15px)',
          overflow: "auto",
        },
        content: {
          outline: "none",
          ...(is_mobile
            ? {
                transform: "translateX(-50%)",
                top: "auto",
                bottom: "32px",
              }
            : {
                transform: "translate(-50%, -50%)",
              }),
        },
      }}
    >
      <div
        className="px-5 xs:px-3 md:px-3 py-6 bg-dark-10 lg:rounded-2xl xsm:rounded-t-2xl overflow-auto xsm:py-4"
        style={{
          width: cardWidth,
          maxHeight: cardHeight,
          border: "1px solid rgba(151, 151, 151, 0.2)",
        }}
      >
        <div className="title flex items-center justify-between">
          <div className="text-white text-2xl paceGrotesk-Bold xsm:text-xl">
            Donate Meme
          </div>
          <ModalCloseIcon className="cursor-pointer" onClick={onRequestClose} />
        </div>
        <div
          className="mt-6 mb-5 transparentScrollbar xsm:mt-4 xsm:relative xsm:z-50"
          style={{
            maxHeight: is_mobile ? "70vh" : "auto",
            overflow: is_mobile ? "" : "auto",
          }}
        >
          <div className="text-gray-60 text-sm xsm:hidden">
            Select donation of Meme token
          </div>
          <div className="mt-5 flex flex-wrap mb-2 xsm:hidden">
            {!emptyObject(xrefSeeds) &&
              Object.keys(MEME_TOKEN_XREF_MAP)
                .sort(sortByXrefStaked(xrefSeeds))
                .map((memeTokenId) => {
                  return (
                    <Tab
                      key={memeTokenId}
                      isSelected={selectedTab === memeTokenId}
                      metadata={allTokenMetadatas?.[memeTokenId]}
                      onSelect={() => setSelectedTab(memeTokenId)}
                    />
                  );
                })}
          </div>
          <div className="flex justify-between items-center text-sm mt-2 lg:hidden md:hidden">
            <div className="text-gray-60">Meme</div>
            <div className="text-white relative" ref={dropdownRef}>
              <button
                className="rounded-3xl border border-memeBorderColor pt-2 pl-2 pr-3 pb-2 flex items-center justify-between cursor-pointer outline-none bg-dark-70 text-white"
                onClick={() => setDropdownVisible(!dropdownVisible)}
              >
                <img
                  className="w-6 h-6 rounded-full"
                  src={selectedDefaultTab?.icon}
                />
                <div className="ml-1.5 mr-2 text-base paceGrotesk-Bold">
                  {selectedDefaultTab?.symbol}
                </div>
                <SelectsDown />
              </button>
              {dropdownVisible && (
                <div
                  className="absolute h-64 overflow-auto z-50 top-12 right-0 rounded-lg border border-memeModelgreyColor pt-4 pl-3.5 pr-9 
                   cursor-pointer outline-none bg-dark-70 text-white w-max"
                >
                  {Object.keys(MEME_TOKEN_XREF_MAP)
                    .sort(sortByXrefStaked(xrefSeeds))
                    .map((memeTokenId, index, array) => (
                      <div
                        key={memeTokenId}
                        onClick={() => {
                          setSelectedTab(memeTokenId);
                          setDropdownVisible(false);
                        }}
                        className={`flex items-center ${
                          index !== array.length - 1 ? "mb-7" : "mb-4"
                        }`}
                      >
                        <img
                          className="w-6 h-6 rounded-full"
                          src={allTokenMetadatas[memeTokenId]?.icon}
                        />
                        <div className="ml-2 text-base paceGrotesk-Bold">
                          {allTokenMetadatas[memeTokenId]?.symbol}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between text-sm xsm:hidden">
            <div className="text-gray-60">Amount</div>
          </div>
          <div className="mb-8">
            {allTokenMetadatas?.[selectedTab] && (
              <InputAmount
                token={allTokenMetadatas[selectedTab]}
                tokenPriceList={tokenPriceList}
                balance={balance}
                changeAmount={setAmount}
                amount={amount}
              />
            )}
          </div>
          {isSignedIn ? (
            <div
              onClick={openDonateConfirmModal}
              className={`flex flex-grow items-center justify-center cursor-pointer bg-greenGradient mt-6 rounded-xl h-12 text-base paceGrotesk-Bold focus:outline-none ${
                disabled || donateLoading
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <ButtonTextWrapper
                loading={donateLoading}
                Text={() => (
                  <div className="flex items-center gap-2">Donate</div>
                )}
              />
            </div>
          ) : (
            <div
              onClick={showWalletSelector}
              className="frcc h-12 bg-greenGradient rounded mt-4 text-black font-bold text-base cursor-pointer"
            >
              Connect Wallet
            </div>
          )}
        </div>
        <div
          className={`flex items-start gap-2 mt-4 xsm:relative xsm:z-40 ${
            allTokenMetadatas?.[selectedTab]?.symbol ? "" : "hidden"
          }`}
        >
          <TipIcon className="flex-shrink-0 transform translate-y-1" />
          <p className="text-sm text-primaryGreen">
            Your donated Tokens will be added by Ref to the Farming Pool within
            1-2 days, rewarding holders of xRef who support{" "}
            {allTokenMetadatas?.[selectedTab]?.symbol}.
          </p>
        </div>
      </div>
      {confirmIsOpen && (
        <DonateConfirmModal
          isOpen={confirmIsOpen}
          onRequestClose={closeDonateConfirmModal}
          amount={amount}
          symbol={allTokenMetadatas?.[selectedTab]?.symbol}
          onDonate={doateToken}
        />
      )}
    </Modal>
  );
}

const Tab = ({
  isSelected,
  onSelect,
  metadata,
}: {
  isSelected: boolean;
  onSelect: any;
  metadata: TokenMetadata;
}) => {
  const baseStyle =
    "rounded-3xl border border-dark-40 pt-2 pl-2 pr-3 pb-2 flex items-center justify-between cursor-pointer outline-none";
  const selectedStyle = "bg-primaryGreen";
  const unselectedStyle = "bg-dark-70 text-white";

  return (
    <button
      className={`${baseStyle} ${
        isSelected ? selectedStyle : unselectedStyle
      } mr-4 mb-4`}
      onClick={onSelect}
    >
      <img className="w-6 h-6 rounded-full" src={metadata?.icon} />
      <div className="ml-1.5 text-base paceGrotesk-Bold">
        {metadata?.symbol}
      </div>
    </button>
  );
};

export default DonateModal;
