import { PortfolioArrow, PortfolioOrderlyIcon } from "./icon";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
import ConnectToOrderlyWidget from "@/components/orderbook/connectToOrderlyWidget";
import useHoldings from "@/hooks/orderbook/useHoldings";
import { toInternationalCurrencySystem_usd } from "@/utils/uiNumber";
import OrderlyDataInit from "@/components/orderbook/OrderlyDataInit";

export default function OrderlyPanel() {
  const orderbookDataStore = useOrderbookDataStore();
  const connectStatus = orderbookDataStore.getConnectStatus();
  const totalAssetsUsd = useHoldings();
  const handleOrderlyClick = () => {
    window.open("https://app.ref.finance/orderly", "_blank");
  };
  return (
    <div className="relative bg-gray-20 bg-opacity-40 mb-4">
      <div
        className="rounded-lg hover:bg-gray-20 cursor-pointer text-white p-4 min-h-[126px]"
        onClick={() => {
          handleOrderlyClick();
        }}
      >
        <div className="frcb mb-6">
          <div className="flex items-center">
            <div className="bg-gray-220 bg-opacity-60 rounded-md w-6 h-6 mr-2 frcc">
              <PortfolioOrderlyIcon />
            </div>
            <p className="text-gray-10 text-sm">Orderly</p>
          </div>
          <PortfolioArrow />
        </div>
        {connectStatus == "has_connected" ? (
          <div className="flex">
            <div className="flex-1">
              <p className="mb-1.5 text-base paceGrotesk-Bold">
                {toInternationalCurrencySystem_usd(totalAssetsUsd, 0)}
              </p>
              <p className="text-xs text-gray-50">TotalAssets</p>
            </div>
          </div>
        ) : null}
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-10">
        <ConnectToOrderlyWidget uiType="orderlyAssets" />
      </div>
      <OrderlyDataInit />
    </div>
  );
}
