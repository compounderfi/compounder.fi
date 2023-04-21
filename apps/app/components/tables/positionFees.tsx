import { useEffect, useState} from "react";
import useSWR from "swr";
import { useNetwork } from "wagmi";

export interface PositionFeesProps {
    tokenID: string;
    updater: any;
}
  

export default function PositionFees({tokenID, updater}: PositionFeesProps) {
    const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());
    const { chain } = useNetwork();
    const { data } = useSWR(["/api/" + chain?.id + "/getAllPositionDetails/" + tokenID, chain], fetcher);
    const [ unclaimed0Value, setUnclaimed0Value] = useState("")
    const [ unclaimed1Value, setUnclaimed1Value] = useState("")
    const [ symbol0, setSymbol0] = useState("")
    const [ symbol1, setSymbol1] = useState("")

    useEffect(() => {
        if (data) {
            updater(tokenID, data)
            setUnclaimed0Value((data["unclaimed0"] * data["token0USD"] * 0.02).toFixed(2))
            setUnclaimed1Value((data["unclaimed1"] * data["token1USD"] * 0.02).toFixed(2))
            setSymbol0(data["symbol0"])
            setSymbol1(data["symbol1"])
        }
    }, [data, updater, tokenID])
    return (
        <p>{unclaimed0Value > unclaimed1Value ? `$${unclaimed0Value} ${symbol0}` : `$${unclaimed1Value} ${symbol1}`}</p>
    )

}