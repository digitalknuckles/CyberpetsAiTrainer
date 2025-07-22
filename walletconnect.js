import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js';

const POLYGON_CHAIN_ID = "0x89"; // 137
const CONTRACT_ADDRESS = '0x36b8192ef6bc601dcf380af0fa439ba8b78417cb';
const ABI = [
  {
    inputs: [],
    name: 'mintPrize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

let provider;
let signer;
let contract;

async function switchToPolygon() {
  const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (currentChainId !== POLYGON_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_CHAIN_ID }],
      });
      console.log('🔁 Switched to Polygon');
    } catch (err) {
      console.error('❌ Failed to switch to Polygon', err);
      throw new Error('Please switch to the Polygon network.');
    }
  }
}

export async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask or a compatible wallet.");
    throw new Error("No wallet found");
  }

  await switchToPolygon(); // 🔄 Ensure Polygon

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  console.log("✅ Wallet connected & contract ready");
  return signer;
}

export async function mintPrize() {
  try {
    if (!contract || !signer) {
      await connectWallet(); // 🔁 Ensure signer is refreshed after network switch
    }

    const tx = await contract.mintPrize();
    console.log("🚀 Minting tx sent:", tx.hash);
    await tx.wait();
    console.log("✅ NFT minted successfully!");
    return true;
  } catch (error) {
    console.error("❌ Mint error:", error);
    return false;
  }
}

export async function mintPrizeNFT() {
  const success = await mintPrize();
  if (success) {
    sessionStorage.setItem("PETS_minted", "true");
  }
  return success;
}

window.mintPrizeNFT = mintPrizeNFT;
