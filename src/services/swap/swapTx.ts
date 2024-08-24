import { getErrorMessage } from "@/utils/transactionsPopup";
import { checkTransaction } from "@/utils/contract";
import swapToast from "@/components/swap/swapToast";
import swapFailToast from "@/components/swap/swapFailToast";

export async function checkSwapTx(txHash: string, errorType?: any) {
  const res: any = await checkTransaction(txHash);
  const byNeth =
    res?.transaction?.actions?.[0]?.FunctionCall?.method_name === "execute";

  const transaction = res.transaction;
  const isSwapNeth =
    res?.receipts?.[0]?.receipt?.Action?.actions?.[0]?.FunctionCall
      ?.method_name === "ft_transfer_call" ||
    res?.receipts?.[0]?.receipt?.Action?.actions?.[0]?.FunctionCall
      ?.method_name === "near_withdraw";
  const isSwap =
    transaction?.actions[1]?.FunctionCall?.method_name === "ft_transfer_call" ||
    transaction?.actions[0]?.FunctionCall?.method_name === "ft_transfer_call" ||
    transaction?.actions[0]?.FunctionCall?.method_name === "swap" ||
    transaction?.actions[0]?.FunctionCall?.method_name === "near_deposit" ||
    transaction?.actions[0]?.FunctionCall?.method_name === "near_withdraw" ||
    (isSwapNeth && byNeth);
  if (isSwap) {
    const transactionErrorType = getErrorMessage(res);
    !transactionErrorType && !errorType && swapToast(txHash);
    transactionErrorType && swapFailToast(txHash, transactionErrorType);
  }
}
