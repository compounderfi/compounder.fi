import Link from "next/link";

export default function Hero() {
    return (
    <div className="max-w-[1024px] mx-auto">
    <div className="h-[75vh] px-16 grid-flow-col-dense grid items-center grid-cols-12 gap-2 ">
      <div className="col-start-1 col-end-8">
        <div className="grid gap-4">
          <div className="text-5xl sm:text-7xl font-bold">Uniswap v3 fees reinvested with 50% less gas & 25% more interest</div>
          <div className="flex flex-wrap pt-4">
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
            <div className="rounded-full w-fit bg-gray-200 py-2 px-4 my-4">
              launch app
            </div>
          </Link>
        </div>
      </div>
      {/* <div className="col-start-9 col-end-13 bg-black"> </div> */}
    </div>
    </div>
    )
}