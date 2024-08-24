import OrderTab from "@/components/orderbook/spot/orderTab";
import { useSpotStore } from "@/stores/spot";

export default function CreateOrder() {
  const spotStore = useSpotStore();
  const orderTab = spotStore.getOrderTab();
  const isLimit = orderTab == "LIMIT";
  const isMarket = orderTab == "MARKET";
  return (
    <div>
      <div className="flex items-center text-lg font-bold text-gray-50">
        <OrderTab
          isActive={isLimit}
          tabName="Limit"
          Onclick={() => {
            spotStore.setOrderTab("LIMIT");
          }}
        />
        <span className="w-0.5 h-4 bg-gray-50 mx-5 cursor-pointer"></span>
        <OrderTab
          isActive={isMarket}
          tabName="Market"
          Onclick={() => {
            spotStore.setOrderTab("MARKET");
          }}
        />
      </div>
      <div className="bg-dark-10 bg-opacity-40 p-4 rounded-lg mt-3"></div>
    </div>
  );
}
