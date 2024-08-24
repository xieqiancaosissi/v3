import { Ticker } from "@/interfaces/orderbook";
import { tickerToDisplayDiff } from "@/services/orderbook/utils";
import { IoArrowDownOutline, IoArrowUpOutline } from "@/components/reactIcons";
export default function TickerDisplayComponent({ ticker }: { ticker: Ticker }) {
  const { disPlayDiff, diff } = tickerToDisplayDiff(ticker);

  return (
    <span
      className={`${
        diff < 0 ? "text-red-10 " : diff > 0 ? "text-green-10 " : "text-white"
      }  text-xs flex items-center  rounded-md ml-2  py-0.5`}
    >
      {" "}
      <span className="relative ">
        {diff > 0 ? (
          <IoArrowUpOutline />
        ) : diff < 0 ? (
          <IoArrowDownOutline />
        ) : null}
      </span>
      <span>{disPlayDiff}%</span>
    </span>
  );
}
