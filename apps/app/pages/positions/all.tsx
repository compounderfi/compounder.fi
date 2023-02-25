import Head from "next/head";
import PositionsTable, { Position } from "../../components/tables/positions";
import { request, gql } from "graphql-request";
import useSWR from "swr";
import { useEffect, useState } from "react";
import getNetworkConfigs from "../../utils/getNetworkConfigs";
import {
  useNetwork
} from "wagmi";

const query = gql`
  query GetAllPositions {
    positions(where: { tokenWithdraw: null }) {
      id
    }
  }
`;

function AllPositions() {
  const { chain } = useNetwork();

  const subgraphURL = chain ? getNetworkConfigs(chain!.id).graphUrl : getNetworkConfigs(1).graphUrl;

  // @ts-ignore
  const fetcher = (query) => request(subgraphURL, query);

  const { data } = useSWR(query, fetcher);

  const [positions, setPositions] = useState<Position[]>([]);

  
  useEffect(() => {
    if (!data) {
      return;
    }

    const newPositions: Position[] = [];

    data.positions.forEach((position: any) => {
      newPositions.push({
        tokenID: position.id,
        feesID: position.id,
        compoundID: position.id
      });
    });

    setPositions(newPositions);
  }, [data]);

  return (
    <>
      <Head>
        <title>all positions | compounder.fi</title>
      </Head>

      <p className="px-4 text-xl">viewing all compounder.fi positions</p>

      <PositionsTable data={positions}></PositionsTable>
    </>
  );
}

export default AllPositions;
