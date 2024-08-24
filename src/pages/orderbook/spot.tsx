import dynamic from "next/dynamic";
import OrderBookTab from "@/components/orderbook/orderBookTab";
import { useOrderbookDataStore } from "@/stores/orderbook/orderbookDataStore";
const OrderlyDataInit = dynamic(
  () => import("@/components/orderbook/OrderlyDataInit"),
  {
    ssr: false,
  }
);
const ConnectToOrderly = dynamic(
  () => import("@/components/orderbook/connectToOrderly"),
  {
    ssr: false,
  }
);
const CreateOrder = dynamic(
  () => import("@/components/orderbook/spot/createOrder"),
  {
    ssr: false,
  }
);
const Account = dynamic(() => import("@/components/orderbook/spot/account"), {
  ssr: false,
});
const CurrentSymbol = dynamic(
  () => import("@/components/orderbook/spot/currentSymbol"),
  {
    ssr: false,
  }
);
export default function Spot(props: any) {
  const orderbookDataStore = useOrderbookDataStore();
  const connectStatus = orderbookDataStore.getConnectStatus();
  return (
    <div className="flex items-start justify-between p-6 gap-7">
      <OrderlyDataInit />
      {/* left part */}
      <div className="flex items-center flex-grow gap-5">
        <OrderBookTab />
        <CurrentSymbol />
      </div>
      {/* right part */}
      <div className="relative" style={{ width: "350px" }}>
        <ConnectToOrderly />
        {connectStatus == "status_fetching" ? null : (
          <>
            <CreateOrder />
            <Account />
          </>
        )}
      </div>
    </div>
  );
}
