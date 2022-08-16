import { InfuraProvider } from "@ethersproject/providers";
import { Contract } from "ethers";
const abi = [
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
];

const address = "0xc36442b4a4522e871399cd717abdd847ab11fe88";
const provider = new InfuraProvider();

export default async function handler(req, res) {
  const { id } = req.query;
  const contract = new Contract(address, abi, provider);
  const tokenURI = await contract.tokenURI(id);
  const tokenData = JSON.parse(
    Buffer.from(tokenURI.split(",", 2)[1], "base64").toString()
  );
  const encodedTokenSVG = tokenData["image"];
  const tokenSVG = Buffer.from(
    encodedTokenSVG.split(",", 2)[1],
    "base64"
  ).toString();
  res.status(200).send(encodedTokenSVG);
}
