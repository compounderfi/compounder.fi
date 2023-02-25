import axios from "axios";
import useSWR from "swr";
import type { NextApiRequest, NextApiResponse } from 'next'
import { request, gql } from "graphql-request";
import getNetworkConfigs from "../../utils/getNetworkConfigs";

const query = gql`
  query GetHistory($tokenId: BigInt!) {
    autoCompoundeds(first: 10) {
        id
        tokenId
        timestamp
        liquidityPercentIncrease
        transaction {
        gasUsed
        gasPrice
        }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const graphFetcher = (variables: { tokenId: string }) =>
    request(
      getNetworkConfigs(Number(1)).graphUrl,
      query,
      variables
    );
    const { data: compoundHistory } = await useSWR(graphFetcher);

    res.status(200).json({ compoundHistory })
}