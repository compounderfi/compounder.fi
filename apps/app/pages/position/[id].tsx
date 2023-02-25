import { useRouter } from "next/router";
import ActivePositionCard from "../../components/cards/activePosition";
import { useEffect, useState } from "react";
import PositionInformation from "../../components/cards/positionInformation";
import CompoundNowModal from "../../components/compoundNowModal";
import useSWR from "swr";
import { chain, useNetwork } from "wagmi";
import Head from "next/head";
import CompoundHistoryTable, {
  Compound,
} from "../../components/tables/compoundHistory";
import { request, gql } from "graphql-request";
// @ts-ignore
import { tokenToSignificant } from "@thanpolas/crypto-utils";
import getNetworkConfigs from "../../utils/getNetworkConfigs";
import { ethers } from "ethers";

function getImage(chainId: number, tokenAddress: string | undefined) {
  //wont work on goerli
  if (tokenAddress == undefined) return "";
  let chainName;
  switch (chainId) {
    case 1:
      chainName = "ethereum";
      break;
    case 42161:
      chainName = "arbitrum";
      break;
    case 137:
      chainName = "polygon";
      break;
    case 10:
      chainName = "optimism";
      break;
    default:
      chainName = "ethereum";
      break;
  }
  const tokenAddyChecksum = ethers.utils.getAddress(tokenAddress);
  return (
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/" + chainName + "/assets/" +
    tokenAddyChecksum +
    "/logo.png"
  );
}

const query = gql`
  query GetHistory($tokenId: BigInt!) {
    positions(where: { id: $tokenId }) {
      tokenDeposit {
        timestamp
        id
      }
    }
    autoCompoundeds(
      orderBy: timestamp
      orderDirection: desc
      where: { tokenId: $tokenId }
    ) {
      transaction {
        timestamp
        id
      }
      token0 {
        decimals
        id
        symbol
      }
      token1 {
        decimals
        id
        symbol
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
  const chainName = chain?.name;

  const [tokenID, setTokenID] = useState("");
  const { data } = useSWR("/api/" + chain?.id + "/getAllPositionDetails/" + id, fetcher);

  const [tableData, setTableData] = useState<Compound[]>([]);
  const [token0, setToken0] = useState("???");
  const [token1, setToken1] = useState("???");
  const [nextCompound, setNextCompound] = useState("???");
  const [liquidityUSD, setliquidityUSD] = useState("???");
  const [unclaimedUSD, setunclaimedUSD] = useState("???");

  const graphFetcher = (variables: { tokenId: string }) =>
    request(
      getNetworkConfigs(Number(chain!.id)).graphUrl,
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
        token0Compounded: tokenToSignificant(
          compound.amountAdded0,
          compound.token0.decimals,
          { decimalPlaces: 3 }
        ),
        token1Compounded: tokenToSignificant(
          compound.amountAdded1,
          compound.token1.decimals,
          { decimalPlaces: 3 }
        ),
        callerReward:
          compound.fee0 == "0"
            ? tokenToSignificant(compound.fee1, compound.token1.decimals, {
                decimalPlaces: 3,
              }) +
              " " +
              compound.token1.symbol
            : tokenToSignificant(compound.fee0, compound.token0.decimals, {
                decimalPlaces: 3,
              }) +
              " " +
              compound.token0.symbol,
      });
    });

    setTableData(tableData);
    if (compoundHistory.autoCompoundeds.length > 0) {
      setToken0(compoundHistory.autoCompoundeds[0].token0.symbol);
      setToken1(compoundHistory.autoCompoundeds[0].token1.symbol);
    }

    if (compoundHistory.positions.length > 0) {
      tableData.push({
        transactionHash: compoundHistory.positions[0].tokenDeposit.id,
        time: new Date(
          compoundHistory.positions[0].tokenDeposit.timestamp * 1000
        ).toLocaleString(),
        token0Compounded: "inital deposit",
        token1Compounded: "",
        callerReward: "",
      });
    }
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

  useEffect(() => {
    if (!data) {
      return;
    }

    if (token0 == "???") {
      setToken0(data?.token0);
    }
    if (token1 == "???") {
      setToken1(data?.token1);
    }
    if (nextCompound == "???") {
      setNextCompound(data?.daysUntilNextCompound);
    }
    if (liquidityUSD == "???") {
      setliquidityUSD(data?.principalInUSD);
    }
    if (unclaimedUSD == "???") {
      setunclaimedUSD(data?.unclaimedInUSD);
    }


    console.log(data);
  }, [data]);

  const [dialogIsOpen, setDialogIsOpen] = useState(false);

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
              dollarValue={liquidityUSD == "???" ? "-" : Number(liquidityUSD).toFixed(2)}
              token0Name={data?.symbol0 || "loading..."}
              token0Image={getImage(chain ? chain?.id: 1, data?.tokenAddress0)}
              token0Qt={data?.amount0}
              token1Name={data?.symbol1 || "loading..."}
              token1Image={getImage(chain ? chain?.id: 1, data?.tokenAddress1)}
              token1Qt={data?.amount1}
            ></PositionInformation>
            <PositionInformation
              title="unclaimed fees"
              dollarValue={unclaimedUSD == "???" ? "-" : Number(unclaimedUSD).toFixed(2)}
              token0Name={data?.symbol0 || "loading..."}
              token0Image={getImage(chain ? chain?.id: 1, data?.tokenAddress0)}
              token0Qt={data?.unclaimed0}
              token1Name={data?.symbol1 || "loading..."}
              token1Image={getImage(chain ? chain?.id: 1, data?.tokenAddress1)}
              token1Qt={data?.unclaimed1}
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
                next compound: {nextCompound ? Number(nextCompound).toFixed(4) + " days" : "???"}
              </button>
              <button
                onClick={() => setDialogIsOpen(true)}
                className="mt-4 rounded-lg bg-[#81e291] px-2 text-base transition-colors duration-300 hover:bg-[#92D5E6]"
              >
                compound now
              </button>
            </div>
          </div>
          <CompoundHistoryTable
            token0={token0}
            token1={token1}
            data={tableData}
          ></CompoundHistoryTable>
        </div>
      </div>

      <CompoundNowModal
        token0={data?.symbol0}
        token1={data?.symbol1}
        token0Fees={Number(data?.unclaimed0)}
        token1Fees={Number(data?.unclaimed1)}
        positionId={tokenID}
        setIsOpen={setDialogIsOpen}
        isOpen={dialogIsOpen}
      ></CompoundNowModal>
    </>
  );
}
