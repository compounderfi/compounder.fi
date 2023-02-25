import { useAccount } from "wagmi";
import HomePageGrid from "../../components/grids/homePageGrid";
import { useIsMounted } from "../../hooks/useIsMounted";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import { request, gql } from "graphql-request";
import getNetworkConfigs from "../../utils/getNetworkConfigs";

import {
  useNetwork
} from "wagmi";

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
  
  const { chain } = useNetwork();

  const subgraphURL = chain ? getNetworkConfigs(chain!.id).graphUrl : getNetworkConfigs(1).graphUrl;

  const fetcherComp = (variables: { address: string }) =>
    request(subgraphURL, grabAlreadyDepoedQuery, variables);

  let { data: compPositions } = useSWR({ address: address?.toLowerCase() }, fetcherComp);

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

  useEffect(() => {

  }, [chain])

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
