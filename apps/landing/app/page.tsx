import Hero from "./components/hero";

export default function Index() {
  return (
    <>
      <Hero></Hero>
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
