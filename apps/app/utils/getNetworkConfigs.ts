export default function getNetworkConfigs(networkId: number) {
  switch (networkId) {
    case 1:
      return {
        name: 'Mainnet',
        chainId: 1,
        rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/C2NvLk_LZDwrBdh9lvCMwqqU7AHWjKYO",
        explorerUrl: 'https://etherscan.io',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-mainnet',
        imageUrl: "/ethereum.svg"
      };
    case 137:
      return {
        name: 'Polygon',
        chainId: 137,
        rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/xdyZGzPCV9V7Tk7cyeMBunqq02S6e3j1",
        explorerUrl: 'https://polygonscan.com',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-polygon',
        imageUrl: "/polygon.svg"
      };
    case 42161:
      return {
        name: "Arbitrum",
        chainId: 42161,
        rpcUrl: "https://arb-mainnet.g.alchemy.com/v2/o0U7yt_riOpJ4Jk38AyVy3MqlxfSpXlC",
        explorerUrl: 'https://arbiscan.io',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-arbitrium',
        imageUrl: "/arbitrum.svg"
      };
    case 5:
      return {
        name: 'Goerli',
        chainId: 5,
        rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/pRQeyvDG-HCuf5xLTV-N3ads5vnbkvgt',
        explorerUrl: 'https://goerli.etherscan.io',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi',
        imageUrl: "/ethereum.svg"
      };
    case 10:
      return {
        name: 'Optimism',
        chainId: 10,
        rpcUrl: "https://opt-mainnet.g.alchemy.com/v2/sW3gbWnN9dD6vShz4bqQ_i_JAkBLUVrP",
        explorerUrl: 'https://optimistic.etherscan.io',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-optimism',
        imageUrl: "/optimism.svg"
      };
    case 56:
      return {
        name: 'Binance Smart Chain',
        chainId: 56,
        rpcUrl: "https://rpc.ankr.com/bsc",
        explorerUrl: 'https://bscscan.com',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-bsc',
        imageUrl: "/bsc.svg"
      };
    default:
      return {
        name: 'Mainnet',
        chainId: 1,
        rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/C2NvLk_LZDwrBdh9lvCMwqqU7AHWjKYO",
        explorerUrl: 'https://etherscan.io',
        graphUrl: 'https://api.thegraph.com/subgraphs/name/compounderfi/compounderfi-mainnet',
        imageUrl: "/ethereum.svg"
      };
  }
}