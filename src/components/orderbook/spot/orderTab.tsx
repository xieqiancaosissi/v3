import { useRouter } from "next/router";

export default function OrderTab({
  isActive,
  tabName,
  Onclick,
}: {
  isActive: boolean;
  tabName: string;
  Onclick: () => void;
}) {
  return (
    <span
      onClick={Onclick}
      className={`cursor-pointer ${
        isActive ? "bg-textWhiteGradient text-transparent bg-clip-text" : ""
      }`}
    >
      {tabName}
    </span>
  );
}
