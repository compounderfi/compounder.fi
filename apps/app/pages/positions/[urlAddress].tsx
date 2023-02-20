import { useAccount, useContractRead } from "wagmi";
import HomePageGrid from "../../components/grids/homePageGrid";
import { useIsMounted } from "../../hooks/useIsMounted";
import abi from "../../utils/abi.json";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import { request, gql } from "graphql-request";

const grabAlreadyDepoedQuery = gql`
  query GetPositions($address: Bytes!) {
    positions(where: { owner: $address, tokenWithdraw: null }) {
      id
      tokenWithdraw {
        id
      }
    }
  }
`;

function Index() {
  const router = useRouter();
  const { urlAddress } = router.query;

  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();

  const compounderSubgraphUrlGoerli = "https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi"
  const fetcherComp = (variables: { address: string }) =>
    request(compounderSubgraphUrlGoerli, grabAlreadyDepoedQuery, variables);

  const { data: compPositions } = useSWR({ address: address?.toLowerCase() }, fetcherComp);

  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    if (compPositions == undefined) {
      return;
    }
    const newIds: string[] = [];

    compPositions.positions.forEach((position: { id: string }) => {
      console.log(position.id)
      newIds.push(position.id);
    });

    setIds(newIds);
  }, [compPositions]);

/*   useEffect(() => {
    if (!data)
      return
    const newIds: string[] = [];
    (data as Array<number>).forEach((element) => {
      newIds.push(element.toString());
    });

    setIds(newIds);
  }, [data]); */

  if (!isConnected && isMounted) {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>active positions | compounder.fi</title>
      </Head>

      {isMounted && isConnected && (
        <>
          {address == urlAddress && (
            <p className="px-4 text-xl">your active positions</p>
          )}
          {address !== urlAddress && (
            <p className="px-4 text-xl">{urlAddress}&apos;s active positions</p>
          )}
          <div className="mt-2">
            <HomePageGrid
              showAddPositionCard={address == urlAddress}
              ids={ids}
            ></HomePageGrid>
          </div>
        </>
      )}
    </>
  );
}

export default Index;
