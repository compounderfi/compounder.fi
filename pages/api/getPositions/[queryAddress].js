import { InfuraProvider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";

const contractAddress = "0xcCd82390dc5C760403d48EA3cEc937C91d6051d7";
const provider = new InfuraProvider("goerli");

export default async function handler(req, res) {
  const { queryAddress } = req.query;
  const contract = new Contract(contractAddress, abi, provider);

  const tokensJSON = await contract.addressToTokens(queryAddress);

  const tokenIds = [];

  tokensJSON.forEach((element) => {
    tokenIds.push(element.toNumber());
  });

  res.status(200).send(tokenIds);
}
