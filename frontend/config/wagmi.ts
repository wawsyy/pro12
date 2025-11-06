import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Encrypted Glucose Check',
  projectId: 'YOUR_PROJECT_ID', // Replace with your WalletConnect project ID
  chains: [hardhat, sepolia], // Hardhat for local development, Sepolia for testnet
  ssr: false,
});

