import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js';

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

export async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length === 0) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }

      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      console.log('✅ Wallet connected successfully!');
      return signer;
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      throw new Error('Connection to wallet failed');
    }
  } else {
    alert('Please install MetaMask or a compatible wallet.');
    throw new Error('No wallet found');
  }
}

export async function mintPrize() {
  if (!contract || !signer) {
    await connectWallet();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  }

  try {
    const tx = await contract.mintPrize();
    console.log('🎉 Minting transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed!', receipt);

    if (receipt.status === 1) {
      return true;
    } else {
      console.warn("⚠️ Transaction reverted or failed.");
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to mint prize:', error);
    return false;
  }
}

// Exposed for the button logic
export async function mintPrizeNFT() {
  return await mintPrize(); // ✅ return true/false
}
window.mintPrizeNFT = mintPrizeNFT;
