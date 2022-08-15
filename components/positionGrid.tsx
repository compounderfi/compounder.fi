import PositionCard from "./positionCard";
import { useAccount } from "wagmi";
import useSWR from 'swr'

const query = (address: string) => fetch("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3", {
  "body": `{\"query\":\"{\\n  positions(where: {owner: \\\"${address}\\\"}) {\\n    id\\n  }\\n}\",\"variables\":null,\"extensions\":{\"headers\":null}}`,
  "method": "POST",
}).then((res) => res.json())

export default function PositionGrid() {
  const { address } = useAccount();

  const { data, error } = useSWR(address, query)


  console.log(data);
  console.log(error);


  return (
    <div className="flex flex-wrap gap-4">
      <PositionCard add></PositionCard>
      <PositionCard></PositionCard>
      <PositionCard></PositionCard>
      <PositionCard></PositionCard>
    </div>
  );
}
