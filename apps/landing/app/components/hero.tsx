import Link from "next/link";

export default function Hero() {
    return (
    <div className="max-w-[1024px] mx-auto">
    <div className="h-[75vh] px-16 grid-flow-col-dense grid items-center grid-cols-12 gap-2 ">
      <div className="col-start-1 col-end-9">
        <div className="grid gap-4">
          <div className="text-5xl sm:text-7xl font-bold">Compounder automatically reinvests Uniswap v3 fees</div>
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