import Header from "./components/header";
import Hero from "./components/hero";

export default function Index() {
  return (
    <>
      <div style={{ background: "linear-gradient(to bottom right, #bbd2c5, #536976, #292e49)", /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ }} >
      <Header></Header>
      <Hero></Hero>
      </div>
      
      <div className="mx-auto max-w-[1024px] pt-24 px-16 grid grid-cols-12">
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
      <div className="mx-auto max-w-[1024px] pt-24 px-16 grid grid-cols-12">
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
      <div className="mx-auto max-w-[1024px] pt-24 px-16 grid grid-cols-12">
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
