import { Transition, Dialog } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { CONTRACT_ADDRESS } from "../utils/constants";
import abi from "../utils/abi.json";

export interface CompoundNowModalProps {
  isOpen: boolean;
  token0: string;
  token1: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  positionId: string;
}

export default function CompoundNowModal({
  isOpen,
  setIsOpen,
  token0,
  token1,
  positionId,
}: CompoundNowModalProps) {
  const [form, setForm] = useState({
    rewardConversion: false,
    doSwap: false,
  });

  const { error, config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abi,
    functionName: "autoCompound",
    args: [parseInt(positionId), form.rewardConversion, form.doSwap],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

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
                            value={form.rewardConversion ? token1 : token0}
                            onChange={(e) => {
                              setForm({
                                ...form,
                                rewardConversion: e.target.value === token1,
                              });
                            }}
                          >
                            <option value={token0}>{token0}</option>
                            <option value={token1}>{token1}</option>
                          </select>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center">
                          swap tokens:
                          <input
                            className="ml-2 h-[14px] w-[14px] "
                            type="checkbox"
                            value={+form.doSwap}
                            onChange={(e) => {
                              setForm({
                                ...form,
                                doSwap: e.target.checked,
                              });
                            }}
                          ></input>
                        </label>
                      </div>
                    </div>

                    <div className="mt-4 flex">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium transition-colors duration-300 hover:bg-gray-300 "
                        onClick={() => write?.()}
                      >
                        compound now
                      </button>
                    </div>
                  </div>

                  <div className="grow" />
                  <div className="flex flex-col content-center justify-center rounded-md bg-gray-200 p-4 text-center">
                    estimated reward
                    <div>
                      <span className="text-2xl"> 69 UNI </span>
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
