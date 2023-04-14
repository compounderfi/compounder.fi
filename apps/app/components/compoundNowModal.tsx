import { Transition, Dialog } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/abi.json";
import { Tooltip } from "@mui/material";

export interface CompoundNowModalProps {
  isOpen: boolean;
  token0: string;
  token1: string;
  token0UnclaimedInUSD: number,
  token1UnclaimedInUSD: number,
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  positionId: string;
  isCompounding: boolean;
}

export default function CompoundNowModal({
  isOpen,
  setIsOpen,
  token0UnclaimedInUSD,
  token1UnclaimedInUSD,
  token0,
  token1,
  positionId,
  isCompounding
}: CompoundNowModalProps) {
  const { chain } = useNetwork();

  const [form, setForm] = useState({
    rewardConversion: false,
  });

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: "compound",
    args: [parseInt(positionId), form.rewardConversion],
    chainId: chain?.id
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const txnStatus = useWaitForTransaction({
    hash: data?.hash,
    wait: data?.wait,
  });

  function openWallet() {
    if (data?.hash) {
      const explorerURI = chain?.blockExplorers?.etherscan?.url + "/tx/" + data.hash;
      window.open(explorerURI, "_blank");
      return;
    }

    if (
      isLoading == true ||
      isSuccess == true ||
      txnStatus.data !== undefined
    ) {
      return;
    }

    write?.();
  }

  let buttonText = <p>compound now</p>;

  if (isLoading) {
    buttonText = <p>confirm txn in wallet</p>;
  }
  if (isSuccess) {
    buttonText = (
      <>
        <Tooltip arrow title={"click to view txn in explorer"}>
          <p>txn submitted</p>
        </Tooltip>
      </>
    );
  }
  if (txnStatus.isSuccess) {
    buttonText = (
      <>
        <Tooltip arrow title={"click to view txn in explorer"}>
          <p>txn confirmed</p>
        </Tooltip>
      </>
    );
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      compound options
                    </Dialog.Title>
                    <div className="mt-2">
                      <div>
                        <label className="block">
                          reward token:
                          <select
                            className="ml-2  outline-none"
                            name="rewardToken"
                            value={form.rewardConversion ? token0 : token1}
                            onChange={(e) => {
                              setForm({
                                ...form,
                                rewardConversion: e.target.value === token0,
                              });
                            }}
                          >
                            <option value={token0}>{token0}</option>
                            <option value={token1}>{token1}</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="mt-4 flex">
                      <button
                        type="button"
                        className= "inline-flex justify-center rounded-md border border-transparent bg-[#81e291] px-4 py-2 text-sm font-medium transition-colors duration-300 hover:bg-[#92D5E6]"
                        onClick={openWallet}
                      >
                        {buttonText}
                      </button>
                    </div>
                  </div>

                  <div className="grow" />
                  <div className="flex w-[170px] flex-col content-center justify-center rounded-md bg-gray-200 p-4 text-center">
                    estimated reward
                    <div>
                      <span className="text-2xl">
                        {" "}
                    

                        {form.rewardConversion ? `\$${(token0UnclaimedInUSD * 0.02).toFixed(2)} ` : `\$${(token1UnclaimedInUSD * 0.02).toFixed(2)} `}
                        {form.rewardConversion ? token0 : token1}{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
