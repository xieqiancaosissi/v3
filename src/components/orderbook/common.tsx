import { twMerge } from "tailwind-merge";
export function TokenIcon({
  src,
  size,
  className,
}: {
  src: any;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      className={twMerge(
        `h-${size || 5} w-${
          size || 5
        } flex-shrink-0 rounded-full border border-gray-90`,
        className || ""
      )}
    />
  );
}
