import { useRouter } from "next/router";

export default function Position() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="px-4 text-xl">
      <p>viewing nft {id}</p>
    </div>
  );
}
