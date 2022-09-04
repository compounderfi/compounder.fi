import { useRouter } from "next/router";
import ActivePositionCard from "../../components/cards/activePosition";
import { useEffect, useState } from "react";
import PositionInformation from "../../components/cards/positionInformation";
import CompoundNowModal from "../../components/compoundNowModal";
import useSWR from "swr";
import { useNetwork } from "wagmi";
import Head from "next/head";
import CompoundHistoryTable, {
  Compound,
} from "../../components/tables/compoundHistory";
import { request, gql } from "graphql-request";

function getImage(tokenAddress: string | undefined) {
  if (tokenAddress == undefined) return "";

  if (tokenAddress == "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6")
    return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png";

  return (
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/" +
    tokenAddress +
    "/logo.png"
  );
}

const query = gql`
  query GetCompounds($tokenId: BigInt!) {
    autoCompoundeds(where: { tokenId: $tokenId }) {
      transaction {
        timestamp
        id
      }
      token0 {
        decimals
        id
      }
      token1 {
        decimals
        id
      }
      amountAdded0
      amountAdded1
      fee0
      fee1
    }
  }
`;

export default function Position() {
  const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());

  const router = useRouter();
  const { id } = router.query;
  const { chain } = useNetwork();

  const [tokenID, setTokenID] = useState("");
  const { data } = useSWR("/api/" + chain?.id + "/getPosition/" + id, fetcher);

  const [tableData, setTableData] = useState<Compound[]>([]);

  const graphFetcher = (variables: { tokenId: string }) =>
    request(
      "https://api.thegraph.com/subgraphs/name/compounderfi/test1",
      query,
      variables
    );
  const { data: compoundHistory } = useSWR({ tokenId: tokenID }, graphFetcher);

  useEffect(() => {
    if (!compoundHistory) {
      return;
    }

    const tableData: Compound[] = [];

    compoundHistory.autoCompoundeds.forEach((compound: any) => {
      tableData.push({
        transactionHash: compound.transaction.id,
        time: new Date(compound.transaction.timestamp * 1000).toLocaleString(),
        usdcCompounded: compound.amountAdded0,
        ethCompounded: compound.amountAdded1,
        callerReward: compound.fee0,
      });
    });

    setTableData(tableData);
  }, [compoundHistory]);

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
      <Head>
        <title>position {tokenID} | compounder.fi</title>
      </Head>

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
              token0Name={data?.token0 || "loading..."}
              token0Image={getImage(data?.token0Address)}
              token0Qt={data?.amount0}
              token1Name={data?.token1 || "loading..."}
              token1Image={getImage(data?.token1Address)}
              token1Qt={data?.amount1}
            ></PositionInformation>
            <PositionInformation
              title="unclaimed fees"
              dollarValue="-"
              token0Name={data?.token0 || "loading..."}
              token0Image={getImage(data?.token0Address)}
              token0Qt={data?.fees0}
              token1Name={data?.token1 || "loading..."}
              token1Image={getImage(data?.token1Address)}
              token1Qt={data?.fees1}
            ></PositionInformation>
          </div>
        </div>

        <div className="mt-2 pt-4">
          <div className="flex">
            <div className="mt-4 flex-grow font-bold">compound history</div>
            <div className="flex gap-4">
              <button
                disabled={true}
                className="mt-4 rounded-lg bg-gray-200 px-2 text-base"
              >
                next compound: ~420:69
              </button>
              <button
                onClick={() => setDialogIsOpen(true)}
                className="mt-4 rounded-lg bg-gray-200 px-2 text-base transition-colors duration-300 hover:bg-gray-300"
              >
                compound now
              </button>
            </div>
          </div>
          <CompoundHistoryTable data={tableData}></CompoundHistoryTable>
        </div>
      </div>

      <CompoundNowModal
        token0={data?.token0}
        token1={data?.token1}
        positionId={tokenID}
        setIsOpen={setDialogIsOpen}
        isOpen={dialogIsOpen}
      ></CompoundNowModal>
    </>
  );
}
