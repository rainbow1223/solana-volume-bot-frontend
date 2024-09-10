import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { refund, sellToken } from "../services/api";

export const SellToken = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [poolAddress, setPoolAddress] = useState('');

  const [isSelling, setIsSelling] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  const sell = () => {
    if (isSelling) return;

    if (!privateKey || !tokenAddress || !poolAddress) {
      alert('Please fill all fields');
      return;
    }

    setIsSelling(true);
    sellToken({
      privateKey: privateKey,
      tokenAddr: tokenAddress,
      poolAddr: poolAddress
    }).then((res) => {
      console.log(res.data);
      setIsSelling(false);
    }).catch(err => {
      console.log(err);
      setIsSelling(false);
    });

  }

  const handleRefund = () => {
    if (isRefunding) return;
    console.log('Refund');

    setIsRefunding(true);
    refund().then((res) => {
      console.log(res.data);
      setIsRefunding(false);
    }).catch(err => {
      console.log(err);
      setIsRefunding(false);
    });
  }

  return (
    <div className="px-4">
      <div className="mb-8 text-2xl font-medium">Sell Token & Refund</div>
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

        <div className="">
          {isSelling ?
            <span className="text-sm">Bot is running...</span>
            :
            <Button color="blue" className="text-sm" size="sm" onClick={sell}>Sell</Button>
          }
        </div>

        <Button color="red" className="text-sm" size="sm" onClick={handleRefund}>Refund</Button>
        <span>(Click this button if you want to refund all SOL and WSOL to master wallet)</span>
      </div>
    </div>
  );
};
