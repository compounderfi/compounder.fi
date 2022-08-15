import PositionCard from "./positionCard";
import { useAccount } from "wagmi";
import useSWR from "swr";

const query = (address: string) =>
  fetch("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3", {
    body: `{\"query\":\"{\\n  positions(where: {owner: \\\"${address}\\\"}) {\\n    id\\n  }\\n}\",\"variables\":null,\"extensions\":{\"headers\":null}}`,
    method: "POST",
  }).then((res) => res.json());

export default function PositionGrid() {
  // const { address } = useAccount();
  const address = "0x365f45298ae6039143c113eb4ad89c7227818aac";

  const { data, error } = useSWR(address, query);
  const positions = data?.data?.positions.map((position: { id: string }) => (
    <PositionCard key={position.id} id={position.id}></PositionCard>
  ));

  return (
    <div className="flex flex-wrap gap-4">
      <PositionCard></PositionCard>
      {positions}
    </div>
  );
}
