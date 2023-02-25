export default function getNetworkConfigs(networkId: number) {
  switch (networkId) {
    case 1:
      return {
        name: 'Mainnet',
        chainId: 1,
        rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_KEY,
        explorerUrl: 'https://etherscan.io',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-mainnet'
      };
    case 137:
      return {
        name: 'Polygon',
        chainId: 137,
        rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_KEY,
        explorerUrl: 'https://polygonscan.com',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-polygon'
      };
    case 42161:
      return {
        name: "Arbitrum",
        chainId: 42161,
        rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_KEY,
        explorerUrl: 'https://arbiscan.io',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-arbitrium'
      };
    case 5:
      return {
        name: 'Goerli',
        chainId: 5,
        rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/pRQeyvDG-HCuf5xLTV-N3ads5vnbkvgt',
        explorerUrl: 'https://goerli.etherscan.io',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi'
      };
    case 10:
      return {
        name: 'Optimism',
        chainId: 10,
        rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_KEY,
        explorerUrl: 'https://optimistic.etherscan.io',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-optimism'
      };
    default:
      return {
        name: 'Mainnet',
        chainId: 1,
        rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_KEY,
        explorerUrl: 'https://etherscan.io',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-mainnet'
      };
  }
}