import Image from "next/image";

export default function Hero() {
    return (
    <>
      <section className="max-w-screen-xl mx-auto">
        <div className="h-[61vh] min-h-[600px] px-16 grid-flow-col-dense grid items-center gap-2 grid py-8 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="col-start-1 col-end-9 place-self-center mr-auto lg:col-span-8">
                <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl">Simple interest<svg className="inline-block" width="40px" height="50px" viewBox="0 -6.5 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>right-arrow</title> <desc>Created with Sketch.</desc> <g id="icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="ui-gambling-website-lined-icnos-casinoshunter" transform="translate(-1511.000000, -158.000000)" fill="#000000" fillRule="nonzero"> <g id="1" transform="translate(1350.000000, 120.000000)"> <path d="M187.812138,38.5802109 L198.325224,49.0042713 L198.41312,49.0858421 C198.764883,49.4346574 198.96954,49.8946897 199,50.4382227 L198.998248,50.6209428 C198.97273,51.0514917 198.80819,51.4628128 198.48394,51.8313977 L198.36126,51.9580208 L187.812138,62.4197891 C187.031988,63.1934036 185.770571,63.1934036 184.990421,62.4197891 C184.205605,61.6415481 184.205605,60.3762573 184.990358,59.5980789 L192.274264,52.3739093 L162.99947,52.3746291 C161.897068,52.3746291 161,51.4850764 161,50.3835318 C161,49.2819872 161.897068,48.3924345 162.999445,48.3924345 L192.039203,48.3917152 L184.990421,41.4019837 C184.205605,40.6237427 184.205605,39.3584519 184.990421,38.5802109 C185.770571,37.8065964 187.031988,37.8065964 187.812138,38.5802109 Z" id="right-arrow"> </path> </g> </g> </g> </g></svg><br/> Compound interest</h1>
                <p className=" max-w-2xl font-light text-gray-500 mb-4 md:text-lg lg:text-xl dark:text-gray-500">compounder collects your uniswapv3 fees and reinvests them back into your position. Automatically, efficiently, and at a low fee.</p>
                
                <div className="networks flex">
                  <Image className="mr-3" src="/uniswap.svg" width="24" height="24" alt="Ethereum network"></Image>
                  <Image src="/ethereum.svg" width="24" height="24" alt="Ethereum network"></Image>
                  <Image src="/polygon.svg" width="24" height="24" alt="Polygon network"></Image>
                  <Image src="/optimism.svg" width="24" height="24" alt="Optimism network"></Image>
                  <Image src="/arbitrum.svg" width="24" height="24" alt="Arbitrum network"></Image>
                </div>
                <a href="https://compounder-fi.gitbook.io/compounder.fi/" className="inline-flex justify-center items-center py-3 mr-3 text-base font-medium text-center text-gray-700 rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                    view docs
                    <svg className="ml-2 mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
                <a href="https://app.compounder.fi" className="rounded-full bg-[#81e291] py-2 px-4">
                    launch app
                </a> 
            </div>
            <div className="hidden lg:mt-0 lg:col-span-3 lg:flex">
                <Image className="col-start-1 col-end-9 max-w-6xl" width={1000} height={500} src="/app.png" alt="mockup"></Image>
            </div>                
        </div>
    </section>

    
  
    </>
    )
}
