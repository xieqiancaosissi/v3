import { LoadingIcon } from "@/components/common/Icons";
export default function Loading() {
  return (
    <div
      className="flex flex-col relative items-center justify-center"
      style={{
        width: "100%",
        height: "150px",
        marginTop: "20px",
      }}
    >
      <LoadingIcon />
    </div>
  );
}
