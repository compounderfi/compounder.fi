import { useRouter } from "next/router";
import useSWR from "swr";
import { useNetwork } from "wagmi";

export default function APStats({ tokenID }: { tokenID: string }) {
  const router = useRouter();

  const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());
  const { chain } = useNetwork();
  const { data } = useSWR("/api/" + chain?.id + "/getAllPositionDetails/" + tokenID, fetcher);

  return (
    <div>
      <div className="text-xl">apr: {data?.apr || "?.??"}%</div>
      <div className="text-xl">apy: {data?.apy || "?.??"}%</div>
    </div>
  );
}
