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
            tick
            poolDayData(skip: 1, first: 7, orderBy: date, orderDirection: desc) {
              feesUSD
            }
          }
          tickLower {
            tickIdx
          }
          tickUpper {
            tickIdx
          }
          liquidity
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

async function calculateAvgFees(resp) {
  const pool = resp["pool"]["poolDayData"];
  const days = pool.length;

  let avg = 0;
  for (let i = 0; i < days; i++) {
    avg += +pool[i]["feesUSD"];
  }
  return avg / days;
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

async function calculateAnnualFeesUSD(resp) {
  const totalFees = (await calculateAvgFees(resp)) * 365;

  const userLiquidity = resp["liquidity"];
  const poolLiquidity = resp["pool"]["liquidity"];
  const userShare = userLiquidity / poolLiquidity;

  return totalFees * userShare;
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

export default async function handler(req, res) {
  const { tokenID, chain } = req.query;

  const data = await makeRequest(tokenID, chain);
  const resp = data["data"]["position"];

  const ethPriceUSD = +data["data"]["bundle"]["ethPriceUSD"];
  const [amount0, amount1] = await calculateAmount0Amount1(resp);

  const feesUSD = await calculateAnnualFeesUSD(resp);

  const [principalInUsd, token0InUSD, token1InUSD] = await calculatePrincipal(
    resp,
    ethPriceUSD,
    amount0,
    amount1
  );
  const apr = (feesUSD * 100) / principalInUsd;

  res.status(200).json({
    apr: apr.toFixed(2),
    amount0: amount0,
    amount1: amount1,
    token0InUSD: token0InUSD,
    token1InUSD: token1InUSD,
  });
}
