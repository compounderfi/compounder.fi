import Head from "next/head";
import PositionsTable, { Position } from "../../components/tables/positions";

const tableData: Position[] = [];

while (tableData.length < 100) {
  tableData.push({
    tokenID: Math.floor(Math.random() * 10000) + "",
    estimatedFees: Math.random() * 100 + "",
  });
}

function AllPositions() {
  return (
    <>
      <Head>
        <title>all positions | compounder.fi</title>
      </Head>

      <PositionsTable data={tableData}></PositionsTable>
    </>
  );
}

export default AllPositions;
