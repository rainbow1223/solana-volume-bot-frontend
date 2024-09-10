import { useEffect } from "react";
import { getBotInfo } from "../services/api";

export const CurrentStatus = () => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      getBotInfo()
        .then(res => {
          console.log(res.data);
          // Here you can set the state with the received info if needed
        })
        .catch(err => console.log(err));
    }, 5000); // Polls every 5 seconds

    // This is important to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="px-4">
      <div className="text-2xl font-medium mb-8">Current Status</div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center justify-center text-lg leading-6">
          <label className="">Transaction Type:</label>
          <span className="font-medium">Buy</span>
        </div>
        
        <div className="flex gap-2 items-center justify-center text-lg leading-6">
          <label className="">Current Wallet:</label>
          <span className="font-medium">0x40oiwjkldf92kfwqep2sk20dkje</span>
        </div>
        
        <div className="flex gap-2 items-center justify-center text-lg leading-6">
          <label className="">Previous Trading Balance:</label>
          <span className="font-medium">0.02 SOL</span>
        </div>
        
        <div className="flex gap-2 items-center justify-center text-lg leading-6">
          <label className="">Current Trading Balance:</label>
          <span className="font-medium">0.0015 SOL</span>
        </div>
        
        <div className="flex gap-2 items-center justify-center text-lg leading-6">
          <label className="">Total Volume Amount:</label>
          <span className="font-medium">45 SOL</span>
        </div>
      </div>
    </div>
  );
};
