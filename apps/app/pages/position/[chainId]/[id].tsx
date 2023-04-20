import { useRouter } from "next/router";
import ActivePositionCard from "../../../components/cards/activePosition";
import { useEffect, useState } from "react";
import PositionInformation from "../../../components/cards/positionInformation";
import CompoundNowModal from "../../../components/compoundNowModal";
import TopBar from "../../../components/TopBar";
import useSWR from "swr";
import { useNetwork, useContractRead, useSwitchNetwork } from "wagmi";
import Head from "next/head";
import CompoundHistoryTable, {
  Compound,
} from "../../../components/tables/compoundHistory";
import { request, gql } from "graphql-request";
// @ts-ignore
import { tokenToSignificant } from "@thanpolas/crypto-utils";
import getNetworkConfigs from "../../../utils/getNetworkConfigs";
import { ethers } from "ethers";
import ago from "s-ago";

//import constants
import {
  CONTRACT_ADDRESS,
  NFPM_ABI,
  NFPM_ADDRESS,
} from "../../../utils/constants";

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
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/" +
    chainName +
    "/assets/" +
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
    compoundeds(
      orderBy: timestamp
      orderDirection: desc
      where: { tokenId: $tokenId }
    ) {
      transaction {
        timestamp
        id
        gasUsed
        gasPrice
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
      liquidityPercentIncrease
      amountAdded0
      amountAdded1
      fee0Caller
      fee1Caller
    }
  }
`;

export default function Position() {
  const router = useRouter()
  const {id, chainId} = router.query

  const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());

  const [tokenID, setTokenID] = useState("");
  const { data } = useSWR(
    ["/api/" + chainId + "/getAllPositionDetails/" + id, chainId],
    fetcher
  );

  const [tableData, setTableData] = useState<Compound[]>([]);
  const [token0, setToken0] = useState("???");
  const [token1, setToken1] = useState("???");
  const [nextCompound, setNextCompound] = useState("???");
  const now = new Date();
  const [isCompounding, setIsCompounding] = useState(false);


  const approvedData = useContractRead({
    address: NFPM_ADDRESS,
    abi: NFPM_ABI,
    functionName: "getApproved",
    args: [id],
    chainId: Number(chainId),
  });

  useEffect(() => {
    console.log(approvedData.data);
    if (!approvedData.data) {
      return;
    }

    if (approvedData.data == CONTRACT_ADDRESS) {
      setIsCompounding(true);
    } else {
      setIsCompounding(false);
    }
    console.log(isCompounding);
  }, [approvedData.data]);

  const graphFetcher = (variables: { tokenId: string }) =>
    request(getNetworkConfigs(Number(chainId)).graphUrl, query, variables);
  const { data: compoundHistory } = useSWR(
    [{ tokenId: tokenID }, chainId],
    graphFetcher
  );

  useEffect(() => {
    if (!compoundHistory) {
      return;
    }

    const tableData: Compound[] = [];

    compoundHistory.compoundeds.forEach((compound: any) => {
      tableData.push({
        tokenId: {tokenId: tokenID, chainId: Number(chainId)},
        chain: Number(chainId),
        transactionHash: getNetworkConfigs(Number(chainId)).explorerUrl +
            "/tx/" +
            compound.transaction.id,
        time: Number(compound.transaction.timestamp) * 1000,
        percentLiquidityAdded: "" + compound.liquidityPercentIncrease / 100,
        gasPrice: compound.transaction.gasPrice,
        gasUsed: compound.transaction.gasUsed,
        callerReward:
          compound.fee0Caller == "0"
            ? tokenToSignificant(
                compound.fee1Caller,
                compound.token1.decimals,
                {
                  decimalPlaces: 3,
                }
              ) +
              " " +
              compound.token1.symbol
            : tokenToSignificant(
                compound.fee0Caller,
                compound.token0.decimals,
                {
                  decimalPlaces: 3,
                }
              ) +
              " " +
              compound.token0.symbol,
      });
    });

    setTableData(tableData);
    if (compoundHistory.compoundeds.length > 0) {
      setToken0(compoundHistory.compoundeds[0].token0.symbol);
      setToken1(compoundHistory.compoundeds[0].token1.symbol);
    }

    if (compoundHistory.positions.length > 0) {
      tableData.push({
        tokenId: {tokenId: tokenID, chainId: Number(chainId)},
        chain: Number(chainId),
        transactionHash: getNetworkConfigs(Number(chainId)).explorerUrl +
            "/tx/" +
            compoundHistory.positions[0].tokenDeposit.id,
        time:
          Number(compoundHistory.positions[0].tokenDeposit.timestamp) * 1000,
        percentLiquidityAdded: "",
        gasPrice: "",
        gasUsed: "",
        callerReward: "Inital Deposit",
      });
    }
  }, [compoundHistory, chainId]);

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

  }, [data]);

  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Head>
        <title>position {tokenID} | compounder.fi</title>
      </Head>

      <div className="px-4 text-xl">
        <TopBar
          tokenId={Number(tokenID)}
          chainId={Number(chainId)}
          isCompounding={isCompounding}
          profitLoss={Number(data?.profit)}
          impermanentLoss={Number(data?.impermanentLoss)}
          totalFees={Number(data?.totalFees)}
          feesAPR = {Number(data?.apr)}
          ILAPR= {Number(data?.APRpercentageOfIL)}
        />
        <div className="mt-2 flex gap-6 ">
          <ActivePositionCard
            showPointer={false}
            id={tokenID}
            isCompounding={isCompounding}
            chainId={Number(chainId)}
          ></ActivePositionCard>
          <div className="grid flex-grow gap-6">
            <PositionInformation
              title="liquidity"
              dollarValue={Number(data?.principalInUSD).toFixed(2) || "???"}
              token0Name={data?.symbol0 || "loading..."}
              token0Image={getImage(Number(chainId), data?.tokenAddress0)}
              token0Qt={data?.amount0}
              token1Name={data?.symbol1 || "loading..."}
              token1Image={getImage(Number(chainId), data?.tokenAddress1)}
              token1Qt={data?.amount1}
              token0Percentage={
                data?.principalInUSD
                  ? "" +
                    Math.floor(
                      (data?.amount0 * data?.token0USD * 100) /
                        data?.principalInUSD
                    )
                  : ""
              }
              token1Percentage={
                data?.principalInUSD
                  ? "" +
                    Math.ceil(
                      (data?.amount1 * data?.token1USD * 100) /
                        data?.principalInUSD
                    )
                  : ""
              }
            ></PositionInformation>
            <PositionInformation
              title="unclaimed fees"
              dollarValue={Number(data?.unclaimedInUSD).toFixed(2) || "???"}
              token0Name={data?.symbol0 || "loading..."}
              token0Image={getImage(Number(chainId), data?.tokenAddress0)}
              token0Qt={data?.unclaimed0}
              token1Name={data?.symbol1 || "loading..."}
              token1Image={getImage(Number(chainId), data?.tokenAddress1)}
              token1Qt={data?.unclaimed1}
              token0Percentage=""
              token1Percentage=""
            ></PositionInformation>
          </div>
        </div>

        <div className="mt-2 pt-4">
          <div className="flex">
            <div className="mt-4 flex-grow font-bold">compound history</div>
            <div className="flex gap-4">
              {isCompounding && (
                <>
                  <button
                    disabled={true}
                    className="mt-4 rounded-lg bg-gray-200 px-2 text-base"
                  >
                    next compound:{" "}
                    {nextCompound
                      ? ago(
                          new Date(
                            now.getTime() +
                              Number(data?.daysUntilNextCompound) *
                                24 *
                                60 *
                                60 *
                                1000
                          ),
                          "day"
                        )
                      : "???"}
                  </button>
                  <button
                    onClick={
                      isCompounding ? () => setDialogIsOpen(true) : () => {}
                    }
                    className={`mt-4 rounded-lg bg-[#81e291] px-2 text-base transition-colors duration-300 hover:bg-[#92D5E6]`}
                  >
                    {isCompounding ? "compound now" : "compounding not enabled"}
                  </button>
                </>
              )}
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
        token0UnclaimedInUSD={Number(data?.token0UnclaimedInUSD)}
        token1UnclaimedInUSD={Number(data?.token1UnclaimedInUSD)}
        positionId={tokenID}
        setIsOpen={setDialogIsOpen}
        isOpen={dialogIsOpen}
        chainIdOfPosition={Number(chainId)}
      ></CompoundNowModal>
    </>
  );
}
