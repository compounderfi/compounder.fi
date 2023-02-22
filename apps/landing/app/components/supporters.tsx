import Image from "next/image";

export default function Supporter() {
    return (
        <div className="mx-auto max-w-screen-xl  px-4 sm:px-6">
        <div className="py-7 md:py-10">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-5 text-center md:pb-7">
            <p className="text-2xl text-gray-700" data-aos="zoom-y-out">
            Compounder.fi is a Uniswap Grants Recipient
            </p>
        </div>

        {/* Items */}
        <div className="mx-auto grid max-w-sm grid-cols-2 gap-2 md:max-w-4xl">
            {/* Item */}
            <div className="col-span-2 flex items-center justify-center py-2 md:col-auto">
            <Image
                alt="uniswap"
                src="/uniswapWords.png"
                width="300"
                height="5"
            ></Image>
            </div>

            {/* Item */}
            <div className="col-span-2 flex items-center justify-center py-2 md:col-auto">
            <Image
                alt="uniswap"
                src="/uniswapGrants.png"
                width="300"
                height="5"
            ></Image>
            </div>
        </div>
        </div>
        </div>
    )
}