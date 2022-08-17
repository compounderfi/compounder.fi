import PositionCard from "./positionCard";
import { useAccount } from "wagmi";
import useSWR from "swr";

const query = (address: string) =>
  fetch("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3", {
    body: `{\"query\":\"{\\n  positions(where: {owner: \\\"${address}\\\"}) {\\n    id\\n  }\\n}\",\"variables\":null,\"extensions\":{\"headers\":null}}`,
    method: "POST",
  }).then((res) => res.json());

export default function PositionGrid() {
  const { isConnected, address } = useAccount();

  const { data, error } = useSWR(address, query);
  const positions = data?.data?.positions.map((position: { id: string }) => (
    <PositionCard key={position.id} id={position.id}></PositionCard>
  ));

  return (
    <div className="grid">
      <div
        style={{ gridArea: "1/1" }}
        className="flex flex-wrap gap-8 px-4 py-8 pt-4"
      >
        <PositionCard></PositionCard>
        {positions}
      </div>

      {!isConnected && (
        <div
          className="z-50 flex place-items-center backdrop-blur-md"
          style={{ gridArea: "1/1" }}
        >
          <p className="mx-auto text-xl font-bold">
            🔒 connect wallet to continue 🔒
          </p>
        </div>
      )}
    </div>
  );
}
