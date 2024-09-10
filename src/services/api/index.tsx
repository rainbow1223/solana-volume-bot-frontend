import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;;

interface BotData {
  tokenAddr: string;
  poolAddr: string;
  minTxAmount: string;
  maxTxAmount: string;
  timeInterval: string;
}

export const startBot = async (data: BotData) => {
  return await axios.post(`${BASE_URL}/start`, data);
}

export const stopBot = async () => {
  return await axios.get(`${BASE_URL}/stop`);
}

export const getBotInfo = async () => {
  return await axios.get(`${BASE_URL}/info`);
}

export const getTableData = async () => {
  return await axios.get(`${BASE_URL}/get-tx-data`);
}

export const sellToken = async (data: { privateKey: string, tokenAddr: string, poolAddr: string }) => {
  return await axios.post(`${BASE_URL}/sell-token`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const refund = async () => {
  return await axios.get(`${BASE_URL}/refund`);
}

export const generateWallet = async (walletCount: number) => {
  return await axios.post(`${BASE_URL}/gen-wallet`, { walletCount });
}

export const distributeSOLManually = async (data: { amount: string }) => {
  return await axios.post(`${BASE_URL}/distribute-sol`, data);
}

export const distributeWSOLManually = async (data: { amount: string }) => {
  return await axios.post(`${BASE_URL}/distribute-wsol`, data);
}

export const getAllSubWallets = async (data: {tokenAddr: string, poolAddr: string}) => {
  return await axios.post(`${BASE_URL}/get-all-sub-wallets`, data);
}

export const buyTokenManually = async (data: { tokenAddr: string, poolAddr: string, txAmount: string, walletKey: string }) => {
  return await axios.post(`${BASE_URL}/buy-token-manually`, data);
}

export const sellTokenManually = async (data: { tokenAddr: string, poolAddr: string, txAmount: string, walletKey: string }) => {
  return await axios.post(`${BASE_URL}/sell-token-manually`, data);
}

export const closeAccount = async (data: {tokenAddr: string, poolAddr: string, walletKey: string}) => {
  return await axios.post(`${BASE_URL}/close-account`, data);
}