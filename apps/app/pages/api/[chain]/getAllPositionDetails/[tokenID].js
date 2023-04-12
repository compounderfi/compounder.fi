import { tickMath, getAmountsForLiquidityRange } from "@thanpolas/univ3prices";
import { tokenToSignificant } from "@thanpolas/crypto-utils";
import axios from "axios";
import { ethers } from "ethers";
import abi from "../../../../utils/uniswapABI.json";
import { NFPM_ADDRESS } from "../../../../utils/constants";
import getNetworkConfigs from "../../../../utils/getNetworkConfigs";

async function makeRequest(tokenID, chain) {
  let graphURL;

  switch (chain) {
    case "1":
      graphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-mainnet"
      break;
    case "137":
      graphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-polygon"
      break;
    case "42161":
      graphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-arbitrum"
      break;
    case "10":
      graphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-optimism"
      break;
    default:
      graphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-mainnet"
      break; 
  }

  const query = `
  {
    position(id: ${tokenID}) {
      collectedFeesToken0
      collectedFeesToken1
      transaction {
        timestamp
      }
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
      }
      tickLower
      tickUpper
      liquidity
      feeGrowthInside0LastX128
      owner
    }
    bundle(id:1) {
      ethPriceUSD
    }
  }

  `
  const resp = await axios.post(graphURL, {
    query: query,
    variables: null,
  });
  return resp.data;
}

async function calculateAmount0Amount1(resp) {
  const tickLower = Number(resp["tickLower"]);
  const tickUpper = Number(resp["tickUpper"]);

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


async function calculatePrincipalUSD(amount0, amount1, ethPriceUSD, token0ETH, token1ETH) {
  const token0InUSD = token0ETH * ethPriceUSD;
  const token1InUSD = token1ETH * ethPriceUSD;

  return amount0 * token0InUSD + amount1 * token1InUSD;
}

async function calculateUnclaimedFeesUSD(unclaimed0, unclaimed1, ethPriceUSD, token0ETH, token1ETH) {
  const token0UnclaimedInUSD = token0ETH * ethPriceUSD * unclaimed0;
  const token1UnclaimedInUSD = token1ETH * ethPriceUSD * unclaimed1;
  const total = token0UnclaimedInUSD + token1UnclaimedInUSD

  return [total, token0UnclaimedInUSD, token1UnclaimedInUSD];
}

async function calculateClaimedFeesUSD(claimed0, claimed1, ethPriceUSD, token0ETH, token1ETH) {
  const token0InUSD = token0ETH * ethPriceUSD;
  const token1InUSD = token1ETH * ethPriceUSD;

  return claimed0 * token0InUSD + claimed1 * token1InUSD;
}



async function calculateUnclaimedFees(chain, tokenID, owner, decimals0, decimals1) {
  const rpcURL = getNetworkConfigs(Number(chain)).rpcUrl;

  const provider = new ethers.providers.JsonRpcBatchProvider(rpcURL);
  const contract = new ethers.Contract(
    NFPM_ADDRESS,
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

  
  const amount0fees = +tokenToSignificant(results["amount0"], decimals0, {decimalPlaces: 3})
  const amount1fees = +tokenToSignificant(results["amount1"], decimals1, {decimalPlaces: 3})

  return [amount0fees, amount1fees];
}

async function getTimestampInSeconds () {
  return Math.floor(Date.now() / 1000)
}

async function calculateAPRPercentage(transactionTimestamp, principalInUSD, unclaimedInUSD, claimedInUSD) {
  console.log(transactionTimestamp, principalInUSD, unclaimedInUSD, claimedInUSD)
  const totalFeesUSD = unclaimedInUSD + claimedInUSD
  const now = await getTimestampInSeconds();

  const secondsPassed = now - transactionTimestamp
  const yearsPassed = secondsPassed / 31536000

  if (principalInUSD == 0) {
    return 0
  }

  const feesPercentage = totalFeesUSD / principalInUSD
  
  return (feesPercentage / yearsPassed) * 100;
}

const aprToApy = (interest, frequency) => ((1 + (interest / 100) / frequency) ** frequency - 1) * 100;

async function calculateAPYPercentage(chainId, APR, principalInUSD, unclaimedFeesUSD) {
  let gasFee;
  switch(chainId) {
    case "1": //ethereum
      gasFee = 5
      break;
    case "42161": //arbitrium
      gasFee = 0.1
      break;
    case "10": //optimism
      gasFee = 0.1
      break;
    case "137": //polygon
      gasFee = 0.1
      break
    default:
      // code block
      gasFee = 5
      break;
  }

  const requiredToCompoundUSD = (gasFee * 35) - unclaimedFeesUSD; //2% fee but also account for that they only claim 1 of the two tokens 
  
  const percentageNeeded = requiredToCompoundUSD * 100 / principalInUSD

  const yearsToGetPercentageNeeded = percentageNeeded / APR;
  const daysUntilNextCompound = yearsToGetPercentageNeeded * 365;
  const numberOfCompoundsPerYear = 1 / yearsToGetPercentageNeeded

  const apy = aprToApy(APR, numberOfCompoundsPerYear)

  return [apy, daysUntilNextCompound]
}


export default async function handler(req, res) {
  const { tokenID, chain } = req.query;

  const data = await makeRequest(tokenID, chain); //creates the request and retrieves the response

  const resp = data["data"]["position"]; //resp

  const decimals0 = resp["token0"]["decimals"];
  const decimals1 = resp["token1"]["decimals"];

  const tokenAddress0 = resp["token0"]["id"];
  const tokenAddress1 = resp["token1"]["id"];

  const symbol0 = resp["token0"]["symbol"];
  const symbol1 = resp["token1"]["symbol"];

  const name0 = resp["token0"]["name"];
  const name1 = resp["token1"]["name"];

  const token0ETH = +resp["token0"]["derivedETH"];
  const token1ETH = +resp["token1"]["derivedETH"];

  const owner = resp["owner"]
  const ethPriceUSD = +data["data"]["bundle"]["ethPriceUSD"];
  

  const claimed0 = resp["collectedFeesToken0"]
  const claimed1 = resp["collectedFeesToken1"]

  const timestamp = resp["transaction"]["timestamp"]

  const [amount0, amount1] = await calculateAmount0Amount1(resp);

  const [unclaimed0, unclaimed1] = await calculateUnclaimedFees(chain, tokenID, owner, decimals0, decimals1)

  const principalInUSD = await calculatePrincipalUSD(amount0, amount1, ethPriceUSD, token0ETH, token1ETH);
  const [unclaimedInUSD, token0UnclaimedInUSD, token1UnclaimedInUSD]= await calculateUnclaimedFeesUSD(unclaimed0, unclaimed1, ethPriceUSD, token0ETH, token1ETH);

  const claimedInUSD = await calculateClaimedFeesUSD(claimed0, claimed1, ethPriceUSD, token0ETH, token1ETH)

  const APRpercentage = await calculateAPRPercentage(timestamp, principalInUSD, unclaimedInUSD, claimedInUSD)
  const [APYpercentage, daysUntilNextCompound] = await calculateAPYPercentage(chain, APRpercentage, principalInUSD, unclaimedInUSD)


  res.status(200).json({
    apr: APRpercentage,
    apy: APYpercentage,
    daysUntilNextCompound: daysUntilNextCompound,
    amount0: amount0,
    amount1: amount1,
    unclaimed0: unclaimed0,
    unclaimed1: unclaimed1,
    tokenAddress0: tokenAddress0,
    tokenAddress1: tokenAddress1,
    symbol0: symbol0,
    symbol1: symbol1,
    name0: name0,
    name1: name1,
    principalInUSD: principalInUSD,
    unclaimedInUSD: unclaimedInUSD,
    token0UnclaimedInUSD: token0UnclaimedInUSD,
    token1UnclaimedInUSD: token1UnclaimedInUSD,
    claimedInUSD: claimedInUSD,
    token0USD: token0ETH * ethPriceUSD,
    token1USD: token1ETH * ethPriceUSD,
    ethPriceUSD: ethPriceUSD
  });
}
