import { useRouter } from "next/router";
import ActivePositionCard from "../../components/cards/activePosition";
import { useEffect, useState, Fragment } from "react";
import PositionInformation from "../../components/cards/positionInformation";
import Table, { Compound } from "../../components/table";
import CompoundNowModal from "../../components/compoundNowModal";


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


const poolImmutablesAbi = [
  'function factory() external view returns (address)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function fee() external view returns (uint24)',
  'function tickSpacing() external view returns (int24)',
  'function maxLiquidityPerTick() external view returns (uint128)',
]

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

      <CompoundNowModal setIsOpen={setDialogIsOpen} isOpen={dialogIsOpen}></CompoundNowModal>
    </>
  );
}
