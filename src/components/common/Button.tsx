import { BeatLoader } from "react-spinners";
export function ButtonTextWrapper({
  Text,
  loading,
  loadingColor,
}: {
  Text: () => JSX.Element;
  loading: boolean;
  loadingColor?: string;
}) {
  return (
    <>
      {loading ? (
        <BeatLoader size={5} color={loadingColor || "#ffffff"} />
      ) : (
        <Text />
      )}
    </>
  );
}
