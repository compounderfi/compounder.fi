import Link from "next/link";

export default function Index() {
  return (
    <>
    <div className="px-4 grid-flow-col-dense grid grid-cols-12 gap-2 pt-24">
      <div className="col-start-1 col-end-8">
        <div className="grid gap-4">
          <div className="text-5xl sm:text-7xl font-bold">Automatically reinvest Uniswap v3 fees</div>
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
      <div className="pt-24 px-4 grid grid-cols-12">
        <div className="col-start-1 col-end-8">
          <div className="font-semibold text-4xl pb-4">
            Save gas
          </div>
          
        <div className="text-2xl">
          Spend 35% less gas than doing both transactions separately
        </div>
          </div>
        {/* <div className="bg-black col-start-9 col-end-13"> </div> */}

      </div>
      <div className="pt-24 px-4 grid grid-cols-12">
        <div className="col-start-1 col-end-8">
          <div className="font-semibold text-4xl pb-4">
            More fees
          </div>
          
        <div className="text-2xl">
        Gain as much as 20% more fees with compound interest
        </div>
          </div>
        {/* <div className="bg-black col-start-9 col-end-13"> </div> */}

      </div>
      <div className="pt-24 px-4 grid grid-cols-12">
        <div className="col-start-1 col-end-8">
          <div className="font-semibold text-4xl pb-4">
            Less hassle
          </div>
          
        <div className="text-2xl pb-24">
          Automatically compound without paying the gas yourself
        </div>
          </div>
        {/* <div className="bg-black col-start-9 col-end-13"> </div> */}

      </div>
    </>
  );
}
