import { tickMath, getAmountsForLiquidityRange } from "@thanpolas/univ3prices";
import { tokenToSignificant } from "@thanpolas/crypto-utils";
import axios from "axios";

async function makeRequest(tokenID, chain) {
  const graphURL =
    chain == "1"
      ? "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
      : "https://api.thegraph.com/subgraphs/name/compositelabs/uniswap-v3-goerli";

  const resp = await axios.post(graphURL, {
    query: `
      {
        position(id: ${tokenID}) {
          collectedFeesToken0
          collectedFeesToken1
          token0 {
            id
            decimals
            symbol
            name
            derivedETH
          }
          token1 {
            id
            decimals
            symbol
            name
            derivedETH
          }
          pool {
            feeTier
            sqrtPrice
            liquidity
            feeGrowthGlobal0X128
            tick
            poolDayData(skip: 1, first: 7, orderBy: date, orderDirection: desc) {
              feesUSD
            }
          }
          
          tickLower {
            tickIdx
            feeGrowthOutside0X128
          }
          tickUpper {
            tickIdx
            feeGrowthOutside0X128
          }
          liquidity
          feeGrowthInside0LastX128
          owner
        }
        bundle(id:1) {
          ethPriceUSD
        }
      }
              `,
    variables: null,
  });
  return resp.data;
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
    +tokenToSignificant(amount0, decimals0),
    +tokenToSignificant(amount1, decimals1),
  ];
}


async function calculatePrincipal(resp, ethPriceUSD, amount0, amount1) {
  const token0InUSD = +resp["token0"]["derivedETH"] * ethPriceUSD;
  const token1InUSD = +resp["token1"]["derivedETH"] * ethPriceUSD;

  return [
    amount0 * token0InUSD + amount1 + token1InUSD,
    token0InUSD,
    token1InUSD,
  ];
}

async function calculateUnclaimedFees(resp, ethPriceUSD) {
  //tick calculation
  const currentTick = resp["pool"]["tick"]
  const highTick = resp["tickUpper"]["tickIdx"]
  const lowTick = resp["tickLower"]["tickIdx"]
  
  const feeGrowthGlobal0X128 = +resp["pool"]["feeGrowthGlobal0X128"]
  const feeGrowthOutside0X128_lower = +resp["tickLower"]["feeGrowthOutside0X128"]
  const feeGrowthOutside0X128_upper = +resp["tickUpper"]["feeGrowthOutside0X128"]
  const feeGrowthInside0LastX128 = +resp["feeGrowthInside0LastX128"]
  const liquidity = resp["liquidity"]
  const decimals0 = resp["token0"]["decimals"]

  if (currentTick < highTick && currentTick > lowTick) {
    //within range
    const feetoken0 = ((feeGrowthGlobal0X128 - feeGrowthOutside0X128_lower - feeGrowthOutside0X128_upper - feeGrowthInside0LastX128)/(2**128))*liquidity/(1*10**decimals0)
    return feetoken0
  } else if (currentTick >= highTick) {
    //high tick
    const feetoken0 = ((feeGrowthOutside0X128_upper - feeGrowthOutside0X128_lower - feeGrowthInside0LastX128 ) / (2**128))*liquidity
    return feetoken0
  } else {
    //low tick
    const feetoken0  = ((feeGrowthOutside0X128_lower - feeGrowthOutside0X128_upper - feeGrowthInside0LastX128 ) / (2**128)) * liquidity
    return feetoken0
  }
  
  //When current tick is higher than tick upper
  //token0fee = ((feeGrowthOutside0X128_upper - feeGrowthOutside0X128_lower - feeGrowthInside0LastX128 ) / (2**128))*position.liquidity)
  
  //When current tick is lower than tick upper
  //token0fee = ((feeGrowthOutside0X128_lower - feeGrowthOutside0X128_upper - feeGrowthInside0LastX128 ) / (2**128))*position.liquidity)
  return feetoken0
}

export default async function handler(req, res) {
  const { tokenID, chain } = req.query;

  const data = await makeRequest(tokenID, chain); //creates the request and retrieves the response
  const resp = data["data"]["position"]; //resp

  const ethPriceUSD = +data["data"]["bundle"]["ethPriceUSD"];
  const [amount0, amount1] = await calculateAmount0Amount1(resp);

  console.log(calculateUnclaimedFees(resp, ethPriceUSD))

  const [principalInUsd, token0InUSD, token1InUSD] = await calculatePrincipal(
    resp,
    ethPriceUSD,
    amount0,
    amount1
  );

  res.status(200).json({
    amount0: amount0,
    amount1: amount1,
    token0InUSD: token0InUSD,
    token1InUSD: token1InUSD,
  });
}
