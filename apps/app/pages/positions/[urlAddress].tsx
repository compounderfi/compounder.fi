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

  let { data: compPositions } = useSWR([{ address: address?.toLowerCase() }, chain], fetcherComp);

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
    newIds.reverse()
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
            <>
            <p className="px-4 text-xl">Currently compounding positions on {chain!.name}:</p>
            <div className="bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 rounded-md shadow-md m-4">
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.729 1.568A1 1 0 0110.271 1h-.542a1 1 0 01-.542.568l-7 3.5A1 1 0 011 5v10a1 1 0 01.729.432l7-3.5a1 1 0 01.542-.432l7 3.5A1 1 0 0119 15V5a1 1 0 01-1.729-.568l-7-3.5zM7.03 9.568a.75.75 0 011.44 0l1.109 4.434a.75.75 0 11-1.439.536l-1.11-4.434a.75.75 0 010-.536zm.69 5.742a.998.998 0 111.999 0 .998.998 0 01-1.999 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold">
                    It may take up to a minute for your positions to appear here.
                  </p>
                </div>
              </div>
            </div>
            </>
            

            
          )}
          {address !== urlAddress && (
            <p className="px-4 text-xl">{urlAddress}&apos;s active positions on {chain!.name}</p>
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
