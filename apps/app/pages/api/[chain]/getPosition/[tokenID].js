import { ethers } from "ethers";
import abi from "../../../../utils/uniswapABI.json";
import { tickMath, getAmountsForLiquidityRange } from "@thanpolas/univ3prices";
import { tokenToSignificant } from "@thanpolas/crypto-utils";
import { request, gql } from "graphql-request";
import { getAddress } from "ethers/lib/utils";

const GetPositionQuery = gql`
  query getPosition($id: String!) {
    position(id: $id) {
      owner
      tickLower {
        tickIdx
      }
      tickUpper {
        tickIdx
      }
      pool {
        sqrtPrice
      }
      liquidity
      token0 {
        decimals
        symbol
        id
      }
      token1 {
        decimals
        symbol
        id
      }
    }
  }
`;

async function queryGraph(tokenID, chain, query) {
  const graphURL =
    chain == "1"
      ? "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
      : "https://api.thegraph.com/subgraphs/name/compositelabs/uniswap-v3-goerli";
  const data = await request(graphURL, query, { id: tokenID });
  return data.position;
}

export default async function handler(req, res) {
  const { tokenID, chain, fees } = req.query;
  const response = {};

  if (typeof tokenID !== "string") {
    res.status(400).json({ error: "tokenID must be string" });
    return;
  }

  if (typeof chain !== "string") {
    res.status(400).json({ error: "chain must be string" });
    return;
  }

  const graphResponse = await queryGraph(tokenID, chain, GetPositionQuery);
  const [amount0, amount1] = await calculateAmount0Amount1(graphResponse);

  response.amount0 = amount0;
  response.amount1 = amount1;

  if (fees !== "false") {
    const fees = await getFees(
      tokenID,
      graphResponse["token0"]["decimals"],
      graphResponse["token1"]["decimals"],
      graphResponse["owner"],
      chain
    );
    response.fees0 = fees[0];
    response.fees1 = fees[1];
  }

  response.token0 = graphResponse["token0"]["symbol"];
  response.token1 = graphResponse["token1"]["symbol"];
  response.token0Address = getAddress(graphResponse["token0"]["id"]);
  response.token1Address = getAddress(graphResponse["token1"]["id"]);

  res.status(200).json(response);
}

async function getFees(tokenID, token0decimals, token1decimals, owner, chain) {
  const rpcURL =
    chain == "1"
      ? "https://eth-mainnet.g.alchemy.com/v2/jDYE9Sr-LXOSHwB9rqVRPoGd2OQSn7mK"
      : "https://eth-goerli.g.alchemy.com/v2/pRQeyvDG-HCuf5xLTV-N3ads5vnbkvgt";

  const provider = new ethers.providers.JsonRpcBatchProvider(rpcURL);
  const contract = new ethers.Contract(
    "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    abi,
    provider
  );

  const results = await contract.callStatic.collect(
    {
      tokenId: tokenID,
      recipient: owner,
      amount0Max: "340282366920938463463374607431768211455",
      amount1Max: "340282366920938463463374607431768211455",
    },
    { from: owner }
  );

  const amount0fees = +tokenToSignificant(results["amount0"], token0decimals, {decimalPlaces: 3})
  const amount1fees = +tokenToSignificant(results["amount1"], token1decimals, {decimalPlaces: 3})

  return [amount0fees, amount1fees];
}

async function calculateAmount0Amount1(resp) {
  const tickLower = Number(resp["tickLower"]["tickIdx"]);
  const tickUpper = Number(resp["tickUpper"]["tickIdx"]);

  const sqrtPrice = resp["pool"]["sqrtPrice"];
  const sqrtRatioAX96 = tickMath.getSqrtRatioAtTick(tickLower);
  const sqrtRatioBX96 = tickMath.getSqrtRatioAtTick(tickUpper);

  const liquidity = resp["liquidity"];

  const decimals0 = resp["token0"]["decimals"];
  const decimals1 = resp["token1"]["decimals"];
  const [amount0, amount1] = getAmountsForLiquidityRange(
    sqrtPrice.toString(),
    sqrtRatioAX96.toString(),
    sqrtRatioBX96.toString(),
    liquidity
  );

  return [
    +tokenToSignificant(amount0, decimals0, {decimalPlaces: 3}),
    +tokenToSignificant(amount1, decimals1, {decimalPlaces: 3}),
  ];
}