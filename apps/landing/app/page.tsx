import Link from "next/link";

export default function Index() {
  return (
    <div className="px-4 grid grid-cols-12 gap-2 pt-4">
      <div className="col-start-1 col-end-8">
        <div className="grid gap-4">
          <div className="text-5xl">Automatically reinvest Uniswap v3 fees</div>
          <div className="flex flex-wrap">
            <div className="text-2xl">
              <ul className="list-disc list-inside">
                <li>50% less gas</li>
              </ul>
            </div>
            <div className="flex-grow"></div>
            <div className="text-2xl">
              <ul className="list-disc list-inside">
                <li>20% more interest</li>
              </ul>
            </div>
          </div>

          <Link href={"https://app.compounder.fi"}>
            <div className="rounded-full w-fit bg-gray-400 py-2 px-4">
              launch app
            </div>
          </Link>
        </div>
      </div>
      <div className="sm:block hidden col-start-9 col-end-13 bg-black"> </div>
    </div>
  );
}
