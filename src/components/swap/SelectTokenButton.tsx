import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import SelectTokenModal from "../../components/common/SelectTokenModal/Index";
import { ArrowDownIcon } from "../../components/swap/icons";
import { useEffect, useState } from "react";
import { ITokenMetadata } from "@/interfaces/tokens";
import { getTokenUIId } from "@/services/swap/swapUtils";
import { setSwapTokenAndBalances } from "@/components/common/SelectTokenModal/tokenUtils";
import { useAccountStore } from "@/stores/account";
import { useTokenStore, ITokenStore } from "@/stores/token";
import { TokenImgWithRiskTag } from "@/components/common/imgContainer";

import {
  usePersistSwapStore,
  useSwapStore,
  IPersistSwapStore,
} from "@/stores/swap";

interface ISelectTokenButtonProps {
  className?: string;
  isIn?: boolean;
  isOut?: boolean;
}
export default function SelectTokenButton(props: ISelectTokenButtonProps) {
  const { isIn, isOut } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectToken, setSelectToken] = useState<ITokenMetadata>();
  const persistSwapStore: IPersistSwapStore = usePersistSwapStore();
  const accountStore = useAccountStore();
  const swapStore = useSwapStore();
  const tokenStore = useTokenStore() as ITokenStore;
  const tokenIn = swapStore.getTokenIn();
  const tokenOut = swapStore.getTokenOut();
  const accountId = accountStore.getAccountId();
  const global_whitelisted_tokens_ids =
    tokenStore.get_global_whitelisted_tokens_ids();
  const showToken = isIn ? tokenIn : tokenOut;
  useEffect(() => {
    if (selectToken?.id && global_whitelisted_tokens_ids?.length > 0) {
      const selectTokenId = getTokenUIId(selectToken);
      setSwapTokenAndBalances({
        tokenInId: isIn ? selectTokenId : getTokenUIId(tokenIn),
        tokenOutId: isOut ? selectTokenId : getTokenUIId(tokenOut),
        accountId,
        swapStore,
        persistSwapStore,
        tokenStore,
        global_whitelisted_tokens_ids,
      });
    }
  }, [
    JSON.stringify(selectToken || {}),
    accountId,
    global_whitelisted_tokens_ids?.length,
  ]);
  function showModal() {
    setIsOpen(true);
  }
  function hideModal() {
    setIsOpen(false);
  }
  function onSelect(token: ITokenMetadata) {
    setSelectToken(token);
  }
  return (
    <div>
      {showToken ? (
        <div
          className="flex items-center cursor-pointer flex-shrink-0"
          onClick={showModal}
        >
          <TokenImgWithRiskTag token={showToken} size="26" />
          <span className="text-white font-bold text-base ml-1.5 mr-2.5 ">
            {showToken.symbol}
          </span>
          <ArrowDownIcon className="text-gray-50" />
        </div>
      ) : (
        <SkeletonTheme baseColor="#212B35" highlightColor="#2A3643">
          <Skeleton height={20} width={80} />
        </SkeletonTheme>
      )}

      {isOpen ? (
        <SelectTokenModal
          isOpen={isOpen}
          onRequestClose={hideModal}
          onSelect={onSelect}
        />
      ) : null}
    </div>
  );
}
