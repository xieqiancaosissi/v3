import React, { useEffect, useState } from "react";
import { FiChevronDown } from "../reactIcons";
import {
  CircleIcon,
  AddButtonIcon,
  MoreButtonIcon,
  CircleIconLarge,
  SelectedButtonIcon,
  SetButtonIcon,
  ReturnArrowButtonIcon,
  DeleteButtonIcon,
  BeatLoading,
} from "./icon";
import { getRpcSelectorList, getCustomAddRpcSelectorList } from "@/utils/rpc";
import { isMobile } from "@/utils/device";
import Modal from "react-modal";
import { FormattedMessage, useIntl } from "react-intl";
import { Checkbox, CheckboxSelected, ModalClose } from "../farm/icon";
import { ButtonTextWrapper } from "../common/Button";
const MAXELOADTIMES = 3;
const RpcList = () => {
  const is_mobile = isMobile();
  const rpclist = getRpcList();
  const [hover, setHover] = useState(false);
  const [hoverSet, setHoverSet] = useState(false);
  const [responseTimeList, setResponseTimeList] = useState<{
    [key: string]: number;
  }>({});
  const [modalCustomVisible, setModalCustomVisible] = useState(false);
  const [currentEndPoint, setCurrentEndPoint] = useState("defaultRpc");
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);

      let endPoint = localStorage.getItem("endPoint") || "defaultRpc";
      if (!(endPoint in rpclist)) {
        endPoint = "defaultRpc";
        localStorage.removeItem("endPoint");
      }
      setCurrentEndPoint(endPoint);
    }
  }, [rpclist]);
  useEffect(() => {
    if (isClient) {
      const fetchPingTimes = async () => {
        const times = await Promise.all(
          Object.entries(rpclist).map(async ([key, data]) => {
            const time = await ping(data.url, key);
            return { key, time };
          })
        );
        const newResponseTimeList = times.reduce(
          (acc: { [key: string]: number }, { key, time }) => {
            acc[key] = time as number;
            return acc;
          },
          {}
        );
        setResponseTimeList(newResponseTimeList);
      };
      fetchPingTimes();

      const handleStorageChange = (e: any) => {
        if (e.key === "customRpcList") {
          localStorage.setItem(e.key, e.oldValue);
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [isClient]);
  function updateResponseTimeList(data: any) {
    const { key, responseTime, isDelete } = data;
    if (isDelete) {
      // delete
      delete responseTimeList[key];
      setResponseTimeList(Object.assign({}, responseTimeList));
    } else {
      // add
      responseTimeList[key] = responseTime;
      setResponseTimeList(Object.assign({}, responseTimeList));
    }
  }
  function addCustomNetwork() {
    setModalCustomVisible(true);
  }
  const minWidth = "180px";
  const maxWith = "230px";
  const mobile = isMobile();
  //   const prd = isPrd();
  if (!isClient) {
    return null;
  }

  return (
    <>
      {mobile ? (
        <div
          style={{
            zIndex: 999999,
            boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.15)",
          }}
          className="fixed bottom-0 left-0 w-full h-8 bg-dark-10 mt-3"
        >
          <div
            className="flex items-center w-full h-full justify-between"
            onClick={addCustomNetwork}
          >
            <div
              className={`flex items-center justify-between w-full flex-grow px-16`}
            >
              <div className="flex items-center w-3/4">
                <label className="text-xs text-gray-60 mr-5">RPC</label>
                <label className="text-xs text-gray-60 cursor-pointer pr-5 whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {rpclist[currentEndPoint].simpleName}
                </label>
              </div>
              <div className="flex items-center">
                {displayCurrentRpc(responseTimeList, currentEndPoint)}
                <FiChevronDown
                  className={`text-gray-60 transform rotate-180 cursor-pointer`}
                ></FiChevronDown>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{ zIndex: 88 }}
          className="flex items-end fixed right-6 bottom-9 text-white"
        >
          <div
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
            className="relative"
          >
            <div className="pt-3">
              <div
                className="frcb px-2  bg-dark-10 bg-opacity-80 rounded cursor-pointer"
                style={{
                  minWidth,
                  maxWidth: maxWith,
                  height: "22px",
                }}
              >
                <div className="flex items-center w-2/3">
                  <label className="text-xs w-full text-gray-10 cursor-pointer pr-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {rpclist[currentEndPoint].simpleName}
                  </label>
                </div>
                <div className="flex items-center">
                  {displayCurrentRpc(responseTimeList, currentEndPoint)}
                  <FiChevronDown
                    className={`text-gray-10 transform rotate-180 cursor-pointer ${
                      hover ? "text-greenColor" : ""
                    }`}
                  ></FiChevronDown>
                </div>
              </div>
            </div>
            <div
              className={`absolute py-2 bottom-7 flex flex-col w-full bg-dark-10 bg-opacity-80 rounded ${
                hover ? "" : "hidden"
              }`}
            >
              {Object.entries(rpclist).map(([key, data]) => {
                return (
                  <div
                    key={key}
                    className={`frcb px-2 py-1 text-gray-10 hover:bg-navHighLightBg  hover:text-white ${
                      currentEndPoint == key ? "bg-navHighLightBg" : ""
                    }`}
                    style={{ minWidth, maxWidth: maxWith }}
                    onClick={() => {
                      switchPoint(key);
                    }}
                  >
                    <label
                      className={`text-xs pr-5 whitespace-nowrap overflow-hidden overflow-ellipsis ${
                        responseTimeList[key] && responseTimeList[key] != -1
                          ? "cursor-pointer"
                          : "cursor-pointer"
                      }`}
                    >
                      {data.simpleName}
                    </label>
                    <div className={`flex items-center`}>
                      {displayCurrentRpc(responseTimeList, key)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            onMouseEnter={() => {
              setHoverSet(true);
            }}
            onMouseLeave={() => {
              setHoverSet(false);
            }}
            onClick={addCustomNetwork}
            style={{ height: "22px" }}
            className="flex items-center bg-dark-10 bg-opacity-80 rounded  cursor-pointer ml-2 px-2 "
          >
            <MoreButtonIcon
              className={`text-gray-10 ${hoverSet ? "text-greenColor" : ""}`}
            ></MoreButtonIcon>
          </div>
        </div>
      )}
      <ModalAddCustomNetWork
        isOpen={modalCustomVisible}
        onRequestClose={() => {
          setModalCustomVisible(false);
        }}
        updateResponseTimeList={updateResponseTimeList}
        currentEndPoint={currentEndPoint}
        responseTimeList={responseTimeList}
        rpclist={rpclist}
        style={{
          overlay: {
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          },
          content: {
            outline: "none",
            ...(is_mobile
              ? {
                  transform: "translateX(-50%)",
                  top: "auto",
                  bottom: "32px",
                }
              : {
                  transform: "translate(-50%, -50%)",
                }),
          },
        }}
      ></ModalAddCustomNetWork>
    </>
  );
};

const ModalBox = (props: any) => {
  const { rpclist, responseTimeList, currentEndPoint, ...rest } = props;
  const [selectCheckbox, setSelectCheckbox] = useState(currentEndPoint);
  return (
    <Modal {...rest}>
      <div
        className="px-5 py-3.5 text-white bg-cardBg border border-gradientFrom border-opacity-50 rounded-lg"
        style={{ width: "90vw" }}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="text-base text-white font-semibold ">RPC</label>
          <span
            onClick={() => {
              props.onRequestClose();
            }}
          >
            <ModalClose></ModalClose>
          </span>
        </div>
        <div>
          {Object.entries(rpclist).map(([key, data]: any) => {
            return (
              <div
                key={key}
                className={`flex items-center py-3 justify-between text-gray-10`}
              >
                <label
                  className={`text-sm pr-5 whitespace-nowrap overflow-hidden overflow-ellipsis cursor-pointer`}
                >
                  {data.simpleName}
                </label>
                <div className={`flex items-center`}>
                  {displayCurrentRpc(responseTimeList, key)}
                  {selectCheckbox == key ? (
                    <CheckboxSelected />
                  ) : (
                    <span
                      onClick={() => {
                        setSelectCheckbox(key);
                        switchPoint(key);
                      }}
                    >
                      <Checkbox />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

const switchPoint = (chooseEndPoint: string) => {
  localStorage.setItem("endPoint", chooseEndPoint);
  window.location.reload();
};
const displayCurrentRpc = (
  responseTimeList: any,
  key: any,
  inBox?: boolean
) => {
  if (responseTimeList[key] == -1) {
    return (
      <>
        <span className={`cursor-pointer text-error`}>
          {inBox ? (
            <CircleIconLarge></CircleIconLarge>
          ) : (
            <CircleIcon></CircleIcon>
          )}
        </span>
        <label className="text-xs ml-1.5 mr-2.5 cursor-pointer text-error whitespace-nowrap">
          time out
        </label>
      </>
    );
  } else if (responseTimeList[key]) {
    return (
      <>
        <span className="cursor-pointer text-primaryGreen">
          {inBox ? (
            <CircleIconLarge></CircleIconLarge>
          ) : (
            <CircleIcon></CircleIcon>
          )}
        </span>
        <label className="text-xs text-gray-10 ml-1.5 mr-2.5 cursor-pointer whitespace-nowrap">
          {responseTimeList[key]}ms
        </label>
      </>
    );
  } else {
    return (
      <label className="mr-2.5 whitespace-nowrap">
        <BeatLoading />
      </label>
    );
  }
};
const specialRpcs: string[] = [
  "https://near-mainnet.infura.io/v3",
  "https://gynn.io",
];
const ModalAddCustomNetWork = (props: any) => {
  const { rpclist, currentEndPoint, responseTimeList, onRequestClose, isOpen } =
    props;
  const [customLoading, setCustomLoading] = useState(false);
  const [customRpcName, setCustomRpcName] = useState("");
  const [customRpUrl, setCustomRpUrl] = useState("");
  const [customShow, setCustomShow] = useState(false);
  const [unavailableError, setUnavailableError] = useState(false);
  const [testnetError, setTestnetError] = useState(false);
  const [notSupportTestnetError, setNotSupportTestnetError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [isInEditStatus, setIsInEditStatus] = useState(false);
  const cardWidth = isMobile() ? "100vw" : "350px";
  const cardHeight = isMobile() ? "40vh" : "336px";
  useEffect(() => {
    hideCustomNetWork();
  }, [isOpen]);
  async function addCustomNetWork() {
    setCustomLoading(true);
    const rpcMap = getRpcList();
    // check if has same url and same name
    const fondItem = Object.values(rpcMap).find((item) => {
      if (trimStr(item.simpleName) == trimStr(customRpcName)) {
        return true;
      }
    });
    if (fondItem) {
      setNameError(true);
      setCustomLoading(false);
      return;
    }
    // check network
    let responseTime;
    // special check
    if (checkContain(customRpUrl)) {
      const { status, responseTime: responseTime_gas } = await ping_gas(
        customRpUrl
      );
      if (!status) {
        setUnavailableError(true);
        setCustomLoading(false);
        return;
      }
      responseTime = responseTime_gas;
    } else {
      // common check
      const {
        status,
        responseTime: responseTime_status,
        chain_id,
      } = await pingChain(customRpUrl);
      responseTime = responseTime_status;
      if (!status) {
        setUnavailableError(true);
        setCustomLoading(false);
        return;
      }
      if (status && chain_id == "testnet") {
        setTestnetError(true);
        setCustomLoading(false);
        return;
      }
    }
    // do not support testnet
    const env = process.env.REACT_APP_NEAR_ENV;
    if (env == "testnet" || env == "pub-testnet") {
      setNotSupportTestnetError(true);
      setCustomLoading(false);
      return;
    }
    const customRpcMap = getCustomAddRpcSelectorList();
    const key = "custom" + Object.keys(customRpcMap).length + 1;
    customRpcMap[key] = {
      url: customRpUrl,
      simpleName: trimStr(customRpcName),
      custom: true,
    };

    localStorage.setItem("customRpcList", JSON.stringify(customRpcMap));
    setCustomLoading(false);
    props.updateResponseTimeList({
      key,
      responseTime,
    });
    setCustomShow(false);
  }
  function checkContain(url: string) {
    const res = specialRpcs.find((rpc: string) => {
      if (url.indexOf(rpc) > -1) return true;
    });
    return !!res;
  }
  function changeNetName(v: string) {
    setNameError(false);
    setCustomRpcName(v);
  }
  function changeNetUrl(v: string) {
    setUnavailableError(false);
    setTestnetError(false);
    setCustomRpUrl(v);
  }
  function showCustomNetWork() {
    setCustomShow(true);
    initData();
  }
  function hideCustomNetWork() {
    setCustomShow(false);
    initData();
  }
  function closeModal() {
    setCustomShow(false);
    initData();
    onRequestClose();
  }
  function switchEditStatus() {
    setIsInEditStatus(!isInEditStatus);
  }
  function deleteCustomNetwork(key: string) {
    const customMap = getCustomAddRpcSelectorList();
    delete customMap[key];
    localStorage.setItem("customRpcList", JSON.stringify(customMap));
    if (key == currentEndPoint) {
      window.location.reload();
    } else {
      props.updateResponseTimeList({
        key,
        isDelete: true,
      });
      if (Object.keys(customMap).length == 0) {
        setIsInEditStatus(false);
      }
    }
  }
  function initData() {
    setCustomRpcName("");
    setCustomRpUrl("");
    setTestnetError(false);
    setNameError(false);
    setUnavailableError(false);
    setIsInEditStatus(false);
    setNotSupportTestnetError(false);
  }
  const submitStatus =
    trimStr(customRpcName) &&
    trimStr(customRpUrl) &&
    !unavailableError &&
    !nameError &&
    !testnetError;
  return (
    <Modal {...props}>
      <div className="relative frcc">
        <div
          className="absolute top-0 bottom-0"
          style={{
            filter: "blur(50px)",
            width: cardWidth,
          }}
        ></div>
        <div
          className="relative z-10 p-6 text-white bg-dark-10 lg:rounded-lg xs:rounded-t-2xl xs:border xs:border-modalGrayBg"
          style={{
            width: cardWidth,
          }}
        >
          {customShow ? (
            <div>
              <div className="frcb text-lg text-white">
                <div className="flex items-center">
                  <ReturnArrowButtonIcon
                    className="mr-3 cursor-pointer"
                    onClick={hideCustomNetWork}
                  ></ReturnArrowButtonIcon>
                  Add Custom Network
                </div>
                <span onClick={closeModal} className="cursor-pointer">
                  <ModalClose></ModalClose>
                </span>
              </div>
              <div className="flex flex-col  mt-6">
                <span className="text-gray-10 text-sm mb-2.5">
                  Network Name
                </span>
                <div
                  className={`overflow-hidden rounded-md ${
                    nameError ? "border border-warnRedColor" : ""
                  }`}
                >
                  <input
                    className="px-3 h-10 bg-black bg-opacity-20"
                    onChange={({ target }) => changeNetName(target.value)}
                  ></input>
                </div>
                <span
                  className={`errorTip text-redwarningColor text-sm mt-2 ${
                    nameError ? "" : "hidden"
                  }`}
                >
                  The network name was already taken
                </span>
              </div>
              <div className="flex flex-col mt-6">
                <span className="text-gray-10 text-sm mb-2.5">RPC URL</span>
                <div
                  className={`overflow-hidden rounded-md ${
                    unavailableError ? "border border-warnRedColor" : ""
                  }`}
                >
                  <input
                    className="px-3 h-10 rounded-md bg-black bg-opacity-20"
                    onChange={({ target }) => changeNetUrl(target.value)}
                  ></input>
                </div>
                <span
                  className={`errorTip text-warn text-sm mt-2 ${
                    unavailableError ? "" : "hidden"
                  }`}
                >
                  The network was invalid
                </span>
                <span
                  className={`errorTip text-warn text-sm mt-2 ${
                    testnetError ? "" : "hidden"
                  }`}
                >
                  RPC server&apos;s network (testnet) is different with this
                  network (mainnet)
                </span>
                <span
                  className={`errorTip text-warn text-sm mt-2 ${
                    notSupportTestnetError ? "" : "hidden"
                  }`}
                >
                  Testnet does not support adding custom RPC
                </span>
              </div>
              <div
                color="#fff"
                className={`w-full h-10 text-center text-base rounded text-black mt-6 focus:outline-none font-semibold bg-greenGradient frcc ${
                  submitStatus
                    ? "cursor-pointer"
                    : "opacity-40 cursor-not-allowed"
                }`}
                onClick={addCustomNetWork}
                // disabled={!submitStatus}
                // loading={customLoading}
              >
                <div className={`${isInEditStatus ? "hidden" : ""}`}>
                  <ButtonTextWrapper
                    loading={customLoading}
                    Text={() => {
                      return <>Add</>;
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="frcb text-lg text-white mb-5">
                RPC
                <span onClick={closeModal} className="cursor-pointer">
                  <ModalClose></ModalClose>
                </span>
              </div>
              <div
                style={{ maxHeight: cardHeight }}
                className="overflow-y-auto overflow-x-hidden"
              >
                {Object.entries(rpclist).map(
                  ([key, data]: any, index: number) => {
                    return (
                      <div className="flex items-center" key={data.simpleName}>
                        <div
                          className={`relative flex items-center rounded h-9 px-4 border border-dark-50 ${
                            isInEditStatus && data.custom ? "w-4/5" : "w-full"
                          } ${
                            index != Object.entries(rpclist).length - 1
                              ? "mb-3"
                              : ""
                          } ${isInEditStatus ? "" : "cursor-pointer"} ${
                            isInEditStatus && !data.custom
                              ? ""
                              : "bg-black bg-opacity-20 hover:bg-dark-180 hover:bg-opacity-80"
                          } justify-between text-gray-10 ${
                            currentEndPoint == key && !isInEditStatus
                              ? "bg-opacity-30"
                              : ""
                          }`}
                          onClick={() => {
                            if (!isInEditStatus) {
                              switchPoint(key);
                            }
                          }}
                        >
                          <label
                            className={`text-sm pr-5 whitespace-nowrap overflow-hidden overflow-ellipsis w-3/5`}
                          >
                            {data.simpleName}
                          </label>
                          <div className={`flex items-center text-sm w-1/5`}>
                            {displayCurrentRpc(responseTimeList, key, true)}
                          </div>
                          <div className="w-1/5 flex justify-end">
                            {currentEndPoint == key && !isInEditStatus ? (
                              <SelectedButtonIcon className=""></SelectedButtonIcon>
                            ) : null}
                          </div>
                        </div>
                        {isInEditStatus && data.custom ? (
                          <div>
                            <DeleteButtonIcon
                              className="cursor-pointer ml-4"
                              onClick={() => {
                                deleteCustomNetwork(key);
                              }}
                            ></DeleteButtonIcon>
                          </div>
                        ) : null}
                      </div>
                    );
                  }
                )}
              </div>
              <div
                className={`flex items-center mt-8 ${
                  isInEditStatus ? "justify-end" : "justify-between"
                }`}
              >
                <div
                  color="#fff"
                  className={`pt-2 h-10 px-4 text-center text-base text-black focus:outline-none font-semibold bg-greenGradient rounded ${
                    isInEditStatus ? "hidden" : ""
                  }`}
                  onClick={showCustomNetWork}
                >
                  <div className={"flex items-center cursor-pointer"}>
                    {/* <AddButtonIcon
                      style={{ zoom: 1.35 }}
                      className="mr-1 text-white"
                    ></AddButtonIcon> */}
                    Add
                  </div>
                </div>
                {Object.keys(rpclist).length > 2 ? (
                  <div className="flex items-center">
                    {isInEditStatus ? (
                      <span
                        className="text-sm text-white cursor-pointer mr-2"
                        onClick={switchEditStatus}
                      >
                        Finish
                      </span>
                    ) : null}
                    <SetButtonIcon
                      className="cursor-pointer text-gray-10 hover:text-white"
                      onClick={switchEditStatus}
                    ></SetButtonIcon>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
const getRpcList = () => {
  const RPCLIST_system = getRpcSelectorList().RPC_LIST;
  const RPCLIST_custom = getCustomAddRpcSelectorList();
  const RPCLIST = Object.assign(RPCLIST_system, RPCLIST_custom);
  return RPCLIST;
};
async function ping(url: string, key: string) {
  const RPCLIST = getRpcList();
  const start = new Date().getTime();
  const businessRequest = fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "gas_price",
      params: [null],
    }),
  });
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(-1);
    }, 8000);
  });
  const responseTime = await Promise.race([businessRequest, timeoutPromise])
    .then(() => {
      const end = new Date().getTime();
      return end - start;
    })
    .catch((result) => {
      if (result == -1) {
        // timeout
        return -1;
      } else {
        // other exception
        const currentRpc = localStorage.getItem("endPoint") || "defaultRpc";
        if (currentRpc != key) {
          return -1;
        } else {
          const availableRpc =
            Object.keys(RPCLIST).find((item) => item != key) || "defaultRpc";
          let reloadedTimes = Number(
            localStorage.getItem("rpc_reload_number") || 0
          );
          setTimeout(() => {
            reloadedTimes = reloadedTimes + 1;
            if (reloadedTimes > MAXELOADTIMES) {
              localStorage.setItem("endPoint", "defaultRpc");
              localStorage.setItem("rpc_reload_number", "");
              return -1;
            } else {
              localStorage.setItem("endPoint", availableRpc);
              window.location.reload();
              localStorage.setItem(
                "rpc_reload_number",
                reloadedTimes.toString()
              );
            }
          }, 1000);
        }
      }
    });
  return responseTime;
}
async function pingChain(url: string) {
  const start = new Date().getTime();
  let status;
  let responseTime;
  let chain_id;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method: "status",
        params: [],
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch(() => {
        return {};
      });
    if (res?.result?.chain_id) {
      const end = new Date().getTime();
      responseTime = end - start;
      status = true;
      chain_id = res.result.chain_id;
    }
  } catch {
    status = false;
  }
  return {
    status,
    responseTime,
    chain_id,
  };
}
// const isPrd = (env: string = process.env.REACT_APP_NEAR_ENV) => {
//   if (env != "pub-testnet" && env != "testnet") return true;
// };
function trimStr(str: string = "") {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
async function ping_gas(url: string) {
  const start = new Date().getTime();
  const businessRequest = fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "gas_price",
      params: [null],
    }),
  });
  let r;
  try {
    r = await businessRequest;
    if (r?.status == 200) {
      r = true;
    } else {
      r = false;
    }
  } catch (error) {
    r = false;
  }
  const end = new Date().getTime();
  const responseTime = end - start;
  return {
    status: !!r,
    responseTime,
  };
}
export default RpcList;
