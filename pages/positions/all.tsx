import Head from "next/head";
import PositionsTable, { Position } from "../../components/tables/positions";

const tableData: Position[] = [];

while (tableData.length < 1000) {
  tableData.push({
    tokenID: Math.floor(Math.random() * 30000) + "",
    estimatedFees: Math.random() * 100 + "",
  });
}

function AllPositions() {
  return (
    <>
      <Head>
        <title>all positions | compounder.fi</title>
      </Head>

      <p className="px-4 text-xl">viewing all compounder.fi positions</p>

      <PositionsTable data={tableData}></PositionsTable>
    </>
  );
}

export default AllPositions;
