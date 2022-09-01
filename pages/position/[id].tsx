import { useRouter } from "next/router";
import ActivePositionCard from "../../components/cards/activePosition";
import { useEffect, useState, Fragment } from "react";
import PositionInformation from "../../components/cards/positionInformation";
import Table, { Compound } from "../../components/table";
import { Transition, Dialog } from "@headlessui/react";

const tableData: Compound[] = [
  {
    transactionHash:
      "0xd99ac92a2a858367d2a7692a2f461db49ac10f9c6e0ed008f60598ec696b3e18",
    time: "8/27/2022 9:15:23",
    usdcCompounded: "321321",
    ethCompounded: "321321",
    callerReward: "3213210421",
  },
  {
    transactionHash:
      "0xd99ac92a2a858367d2a7692a2f461db49ac10f9c6e0ed008f60598ec696b3e18",
    time: "8/27/2022 9:15:23",
    usdcCompounded: "321321",
    ethCompounded: "321321",
    callerReward: "3213210421",
  },
  {
    transactionHash:
      "0xd99ac92a2a858367d2a7692a2f461db49ac10f9c6e0ed008f60598ec696b3e18",
    time: "8/27/2022 9:15:23",
    usdcCompounded: "321321",
    ethCompounded: "321321",
    callerReward: "3213210421",
  },
];

export default function Position() {
  const router = useRouter();
  const { id } = router.query;
  const [tokenID, setTokenID] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    if (Array.isArray(id)) {
      setTokenID(id[0]);
      return;
    }

    setTokenID(id);
  }, [id]);

  let [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <div className="px-4 text-xl">
        <div className="mt-2 flex gap-6 ">
          <ActivePositionCard
            showPointer={false}
            id={tokenID}
          ></ActivePositionCard>
          <div className="grid flex-grow gap-6">
            <PositionInformation
              title="liquidity"
              dollarValue="-"
              token1Name="UNI"
              token1Image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
              token1Qt="69.420"
              token2Name="UNI"
              token2Image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
              token2Qt="69.420"
            ></PositionInformation>
            <PositionInformation
              title="unclaimed fees"
              dollarValue="-"
              token1Name="UNI"
              token1Image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
              token1Qt="69.420"
              token2Name="UNI"
              token2Image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
              token2Qt="69.420"
            ></PositionInformation>
          </div>
        </div>

        <div className="mt-2 pt-4">
          <div className="flex">
            <div className="mt-4 flex-grow font-bold">compound history</div>
            <div className="flex gap-4">
              <div className="mt-4 rounded-lg bg-gray-200 px-2 text-base">
                next compound: ~420:69
              </div>
              <button
                onClick={() => setDialogIsOpen(true)}
                className="mt-4 rounded-lg bg-gray-200 px-2 text-base transition-colors duration-300 hover:bg-gray-300"
              >
                compound now
              </button>
            </div>
          </div>
          <Table data={tableData}></Table>
        </div>
      </div>

      <Transition appear show={dialogIsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setDialogIsOpen(false)}
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
                            >
                              <option value="UNI">UNI</option>
                              <option value="ETH">ETH</option>
                            </select>
                          </label>
                        </div>

                        <div>
                          <label className="flex items-center">
                            swap tokens:
                            <input
                              className="ml-2 h-[14px] w-[14px] "
                              type="checkbox"
                            ></input>
                          </label>
                        </div>
                      </div>

                      <div className="mt-4 flex">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium transition-colors duration-300 hover:bg-gray-300 "
                          onClick={() => setDialogIsOpen(false)}
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
    </>
  );
}
