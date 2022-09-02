import { ethers } from 'ethers'
import { Pool, Position } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import axios from "axios";
import abi from "../../../../utils/uniswapABI.json";


/*
async function main() {

  const TokenA = new Token(1, immutables.token0, 6, 'USDC', 'USD Coin')

  const TokenB = new Token(1, immutables.token1, 18, 'WETH', 'Wrapped Ether')

  const poolExample = new Pool(
    TokenA,
    TokenB,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick
  )
  console.log(poolExample)
}
*/
async function makeRequest(tokenID: Number, chain: String) {
    const graphURL = chain == "mainnet" ? "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3" : "https://api.thegraph.com/subgraphs/name/compositelabs/uniswap-v3-goerli";

    const response = await axios.post(
        graphURL,
        {
            'query': `
            {
                position(id: ${tokenID}) {
                  token0 {
                    id
                    decimals
                    symbol
                    name
                  }
                  token1 {
                    id
                    decimals
                    symbol
                    name
                  }
                  pool {
                    feeTier
                    sqrtPrice
                    liquidity
                    tick
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
              }
            `,
            'variables': null
        },
    );
    return response.data
}

export default async function handler(req, res) {
    const { tokenID, chain } = req.query;


    const json = await makeRequest(tokenID, chain);
    

    const data = json["data"]["position"];
    const owner = data["owner"];
    const token0 = data["token0"];

    const token0id = token0["id"];
    const token0decimals = token0["decimals"];
    const token0symbol = token0["symbol"];
    const token0name = token0["name"];
    
    const t0: Token = new Token(1, token0id, parseInt(token0decimals), token0symbol, token0name);

    const token1 = data["token1"];
    const token1id = token1["id"];
    const token1decimals = token1["decimals"];
    const token1symbol = token1["symbol"];
    const token1name = token1["name"];

    const t1: Token = new Token(1, token1id, parseInt(token1decimals), token1symbol, token1name);

    const poolData = data["pool"];
    const feeTier = poolData["feeTier"]
    const sqrtPriceX96 = poolData["sqrtPrice"];
    const poolliquidity = poolData["liquidity"];
    const tick = poolData["tick"];

    const pool: Pool = new Pool(
        t0,
        t1,
        parseInt(feeTier),
        sqrtPriceX96,
        poolliquidity,
        parseInt(tick)
    )
    const tickLower = data["tickLower"]["tickIdx"];
    const tickUpper = data["tickUpper"]["tickIdx"];
    const positionLiquidity = data["liquidity"];

    const position: Position = new Position(
        {
        pool: pool,
        liquidity: positionLiquidity,
        tickLower: parseInt(tickLower),
        tickUpper: parseInt(tickUpper)
        }
    )
    const amount0 = position.amount0.toExact();
    const amount1 = position.amount1.toExact();

    const [f0, f1] = await getFees(tokenID, token0decimals, token1decimals, owner, chain);

    const fees0 = f0.toString();
    const fees1 = f1.toString();


    res.status(200).json({
        amount0: amount0,
        amount1: amount1,
        fees0: fees0,
        fees1: fees1,
        token0: token0symbol,
        token1: token1symbol,
    })
}

async function getFees(tokenID: Number, token0decimals: String, token1decimals: String, owner: String, chain: String) {
    const rpcURL = chain == "mainnet" ? "https://eth-mainnet.g.alchemy.com/v2/jDYE9Sr-LXOSHwB9rqVRPoGd2OQSn7mK" : "https://eth-goerli.g.alchemy.com/v2/pRQeyvDG-HCuf5xLTV-N3ads5vnbkvgt";

    const provider = new ethers.providers.JsonRpcBatchProvider(rpcURL);
    const contract = new ethers.Contract(
        "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        abi,
        provider
    )

    
    const results = await contract.callStatic.collect(
    {
        tokenId: tokenID,
        recipient: owner, 
        amount0Max: "340282366920938463463374607431768211455",
        amount1Max: "340282366920938463463374607431768211455",
        
    }, {from: owner}
    )

    const amount0fees = results["amount0"].toString().padStart(token0decimals, "0").slice(0, -token0decimals) + "." + results["amount0"].toString().padStart(token0decimals, "0").slice(-token0decimals);
    const amount1fees = results["amount1"].toString().padStart(token1decimals, "0").slice(0, -token1decimals) + "." + results["amount1"].toString().padStart(token1decimals, "0").slice(-token1decimals);

    return [amount0fees, amount1fees];
}
