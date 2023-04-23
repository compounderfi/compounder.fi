import useSWR from "swr";
import { request, gql } from "graphql-request";
import { useEffect, useState } from "react";
import CompoundHistoryTable, {
    Compound,
  } from "../components/tables/compoundHistory";
// @ts-ignore
import { tokenToSignificant } from "@thanpolas/crypto-utils";

const query = gql`
{
  compoundeds(
        orderBy: timestamp
        orderDirection: desc
      ) {
        transaction {
          timestamp
          id
          gasUsed
          gasPrice
        }
        token0 {
          decimals
          id
          symbol
        }
        token1 {
          decimals
          id
          symbol
        }
        liquidityPercentIncrease
        amountAdded0
        amountAdded1
        fee0Caller
        fee1Caller
        tokenId
      }
}
`;
//https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-mainnet
//https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-polygon
//https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-optimism
//https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-arbitrum



function Compounds() {
    const [tableData, setTableData] = useState<Compound[]>([]);
    const { data } = useSWR(
        { urls: ["https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-mainnet",
        "https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-polygon",
        "https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-optimism",
        "https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-arbitrium",
        "https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-bsc"
      ] },
        ({urls}) =>
        Promise.all(
            urls.map((url) =>
                {

                    return request(url,query)
                }
        )
    ))

    useEffect(() => {
        if (!data) {
            return
        }

        const tableData: Compound[] = [];
        for (let i = 0; i < data.length; i++) {
            const compoundHistory = data[i];
            console.log(compoundHistory)
            compoundHistory.compoundeds.forEach((compound: any) => {
            
            const chainId = (() => {switch (i) {
                case 0:
                  return 1;
                case 1:
                  return 137;
                case 2:
                  return 10;
                case 3:
                  return 42161;
                case 4:
                  return 56;
                default:
                  return 1;
              }
            })();
          

                tableData.push({
                  tokenId: {tokenId: compound.tokenId, chainId: chainId},
                  chain: chainId, //compound.transaction.id
                  transactionHash: (() => {
                    switch (i) {
                      case 0:
                        return "https://etherscan.io/tx/" + compound.transaction.id;
                      case 1:
                        return "https://polygonscan.com/tx/" + compound.transaction.id;
                      case 2:
                        return "https://optimistic.etherscan.io/tx/" + compound.transaction.id;
                      case 3:
                        return "https://arbiscan.io/tx/" + compound.transaction.id;
                      case 4:
                        return "https://bscscan.com/tx/" + compound.transaction.id;
                      default:
                        return "https://etherscan.io/tx/" + compound.transaction.id;
                    }
                  })(),
                  time: Number(compound.transaction.timestamp) * 1000,
                  percentLiquidityAdded: "" + compound.liquidityPercentIncrease,
                  gasPrice: compound.transaction.gasPrice,
                  gasUsed: compound.transaction.gasUsed,
                  callerReward:
                    compound.fee0Caller=== "0"
                      ? tokenToSignificant(compound.fee1Caller, compound.token1.decimals, {
                          decimalPlaces: 3,
                        }) +
                        " " +
                        compound.token1.symbol
                      : tokenToSignificant(compound.fee0Caller, compound.token0.decimals, {
                          decimalPlaces: 3,
                        }) +
                        " " +
                        compound.token0.symbol,
                });
              });
        }
      
        setTableData(tableData);
    }, [data])
    return (
      <>
        <CompoundHistoryTable
            token0={"???"}
            token1={"???"}
            data={tableData}
          ></CompoundHistoryTable>
      </>
    );
  }
  
export default Compounds;
  