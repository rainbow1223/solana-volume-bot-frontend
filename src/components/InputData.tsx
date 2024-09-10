import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { startBot, stopBot } from "../services/api";

export const InputData = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [poolAddress, setPoolAddress] = useState('');
  const [walletCount, setWalletCount] = useState('');
  const [minTxAmount, setMinTxAmount] = useState('');
  const [maxTxAmount, setMaxTxAmount] = useState('');
  const [alertMsg, setAlertMsg] = useState('');

  const [isStarted, setIsStarted] = useState(false);

  const start = () => {
    if (isStarted) return;
    console.log('Start Bot');
    console.log('Private Key:', privateKey);
    console.log('Token Address:', tokenAddress);
    console.log('Pool Address:', poolAddress);
    console.log('Wallet Count:', walletCount);
    console.log('Min Tx Amount:', minTxAmount);
    console.log('Max Tx Amount:', maxTxAmount);

    if (!privateKey || !tokenAddress || !poolAddress || !walletCount || !minTxAmount || !maxTxAmount) {
      alert('Please fill all fields');
      return;
    }

    setIsStarted(true);
    startBot({
      privateKey: privateKey,
      tokenAddr: tokenAddress,
      poolAddr: poolAddress,
      walletCount: parseInt(walletCount),
      minTxAmount: parseFloat(minTxAmount),
      maxTxAmount: parseFloat(maxTxAmount)
    }).then((res) => setAlertMsg(res.data)).catch(err => console.log(err));

  }

  const stop = () => {
    if (!isStarted) return;
    stopBot()
      .then(() => setIsStarted(false))
      .catch(err => console.log(err));
  }

  return (
    <div className="px-4">
      <div className="mb-8 text-2xl font-medium">Make Volume</div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <label className="min-w-[160px] text-left">Private Key:</label>
          <Input label="Master Wallet Private Key" placeholder="Enter your Master Wallet Private Key" className="input-placeholder-color" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="min-w-[160px] text-left">Token Address:</label>
          <Input label="Token Address" placeholder="Enter your Token address" className="input-placeholder-color" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="min-w-[160px] text-left">Pool Address:</label>
          <Input label="Pool Address" placeholder="Enter your Pool address" className="input-placeholder-color" value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="min-w-[160px] text-left">Wallet Count:</label>
          <Input label="Wallet Count" placeholder="Enter your Wallet Count" className="input-placeholder-color" value={walletCount} onChange={(e) => setWalletCount(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="min-w-[160px] text-left">Min Tx Amount(SOL):</label>
          <Input label="Min Tx Amount" placeholder="Enter your min Transaction amount" className="input-placeholder-color" value={minTxAmount} onChange={(e) => setMinTxAmount(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="min-w-[160px] text-left">Max Tx Amount(SOL):</label>
          <Input label="Max Tx Amount" placeholder="Enter your max Transaction amount" className="input-placeholder-color" value={maxTxAmount} onChange={(e) => setMaxTxAmount(e.target.value)} />
        </div>

        <div className="text-xl font-medium text-red-900">{alertMsg}</div>

        <div className="mt-2">
          {!isStarted ?
            <Button color="blue" className="text-sm" size="sm" onClick={start}>Start</Button>
            :
            <Button color="blue" className="text-sm" size="sm" onClick={stop}>Stop</Button>
          }
        </div>
      </div>
    </div>
  );
};
