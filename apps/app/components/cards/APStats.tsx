import { useRouter } from "next/router";
import useSWR from "swr";
import { useNetwork } from "wagmi";

export default function APStats({ tokenID }: { tokenID: string }) {
  const router = useRouter();

  const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());
  const { chain } = useNetwork();
  const { data } = useSWR(["/api/" + chain?.id + "/getAllPositionDetails/" + tokenID, chain], fetcher);

  return (
    <div>
      <div className="text-xl">apr: {data ? Number(data?.apr).toFixed(2) : "Loading..."}%</div>
      <div className="text-xl">apy: {data ? Number(data?.apy).toFixed(2) : "Loading..."}%</div>
    </div>
  );
}
