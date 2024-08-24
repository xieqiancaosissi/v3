import { useRouter } from "next/router";

export default function OrderBookTab(props: any) {
  const router = useRouter();
  const isSpotPage = router.pathname.includes("/orderbook/spot");
  const isPerpsPage = router.pathname.includes("/orderbook/perps");
  return (
    <div
      className="inline-flex items-center rounded border border-gray-30 text-sm text-gray-60"
      style={{ padding: "3px" }}
    >
      <span
        style={{
          borderRadius: "3px",
        }}
        className={`flex items-center justify-center h-6 px-2 cursor-pointer ${
          isSpotPage ? "text-white bg-gray-100" : ""
        }`}
        onClick={() => {
          router.push("/orderbook/spot");
        }}
      >
        Spot
      </span>
      <span
        style={{
          borderRadius: "3px",
        }}
        className={`flex items-center justify-center h-6 px-2 cursor-pointer ${
          isPerpsPage ? "text-white bg-gray-100" : ""
        }`}
        onClick={() => {
          router.push("/orderbook/perps");
        }}
      >
        Perps
      </span>
    </div>
  );
}
