import useSWR from "swr";
import type { NextApiRequest, NextApiResponse } from 'next'
import { request, gql } from "graphql-request";
import { useEffect, useState } from "react";
import CompoundHistoryTable, {
    Compound,
  } from "../components/tables/compoundHistory";
// @ts-ignore
import { tokenToSignificant } from "@thanpolas/crypto-utils";
const query = gql`
{
    autoCompoundeds(
        orderBy: timestamp
        orderDirection: desc
      ) {
        transaction {
          timestamp
          id
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
        amountAdded0
        amountAdded1
        fee0
        fee1
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
        "https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-arbitrium"] },
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
            
            

            compoundHistory.autoCompoundeds.forEach((compound: any) => {
                tableData.push({
                  transactionHash: compound.transaction.id,
                  time: new Date(compound.transaction.timestamp * 1000).toLocaleString(),
                  token0Compounded: tokenToSignificant(
                    compound.amountAdded0,
                    compound.token0.decimals,
                    { decimalPlaces: 3 }
                  ),
                  token1Compounded: tokenToSignificant(
                    compound.amountAdded1,
                    compound.token1.decimals,
                    { decimalPlaces: 3 }
                  ),
                  callerReward:
                    compound.fee0 == "0"
                      ? tokenToSignificant(compound.fee1, compound.token1.decimals, {
                          decimalPlaces: 3,
                        }) +
                        " " +
                        compound.token1.symbol
                      : tokenToSignificant(compound.fee0, compound.token0.decimals, {
                          decimalPlaces: 3,
                        }) +
                        " " +
                        compound.token0.symbol,
                });
              });
        }
        console.log(tableData)
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
  