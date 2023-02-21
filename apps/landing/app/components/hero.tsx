import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
    <>
      <section className="max-w-[1024px] mx-auto">
        <div className="h-[61vh] px-16 grid-flow-col-dense grid items-center gap-2 grid py-8 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="col-start-1 col-end-9 place-self-center mr-auto lg:col-span-8">
                <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl">Simple interest-{">"} compound interest</h1>
                <p className=" max-w-2xl font-light text-gray-500 mb-4 md:text-lg lg:text-xl dark:text-gray-500">Compounder collects your uniswapv3 fees and reinvests them back into your position. Automatically, efficiently, and at a low fee.</p>
                
                <div className="networks flex">
                  <Image className="mr-3" src="/uniswap.svg" width="24" height="24" alt="Ethereum network"></Image>
                  <Image src="/ethereum.svg" width="24" height="24" alt="Ethereum network"></Image>
                  <Image src="/polygon.svg" width="24" height="24" alt="Polygon network"></Image>
                  <Image src="/optimism.svg" width="24" height="24" alt="Optimism network"></Image>
                  <Image src="/arbitrum.svg" width="24" height="24" alt="Arbitrum network"></Image>
                </div>
                <a href="#" className="inline-flex justify-center items-center py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                    View docs
                    <svg className="ml-2 mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
                <a href="https://app.compounder.fi" className="rounded-full bg-gray-200 py-2 px-4">
                    Launch App
                </a> 
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                <Image className="col-start-1 col-end-9 max-w-2xl" width={1000} height={500} src="/app.png" alt="mockup"></Image>
            </div>                
        </div>
    </section>

    
  
    </>
    )
}
