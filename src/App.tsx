import { useEffect, useState } from 'react';
import './App.css'
import { TableInfo } from './components/TableInfo'
import { buyTokenManually, closeAccount, distributeSOLManually, distributeWSOLManually, generateWallet, getAllSubWallets, getBotInfo, sellTokenManually, startBot, stopBot } from './services/api';
import useRunStore from './store';
import { Button, Card, Input, Tooltip, Typography } from '@material-tailwind/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/Loader';

interface SubWallet {
  _id: string;
  key: string;
  solBalance: string;
  wsolBalance: string;
  tokenBalance: string;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [totalVolume, setTotalVolume] = useState(0);
  const [tokenAddress, setTokenAddress] = useState('');
  const [poolAddress, setPoolAddress] = useState('');
  const [walletCount, setWalletCount] = useState('');
  const [minTxAmount, setMinTxAmount] = useState('');
  const [maxTxAmount, setMaxTxAmount] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [wsolAmount, setWSolAmount] = useState('');
  const [timeInterval, setTimeInterval] = useState('');
  const [subWallets, setSubWallets] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [txAmounts, setTxAmounts] = useState<{ [key: string]: string }>({});
  const { isRunning, setIsRunning } = useRunStore();

  const TABLE_HEAD = [
    "Name",
    "Wallet Address",
    "Balance(SOL)",
    "Balance(WSOL)",
    "Balance(Token)",
    "Amount to Buy/Sell",
    "Actions",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isRunning) return;
      getBotInfo()
        .then(res => {
          setTotalVolume(res.data.volumeAmount);
          // setTotalVolume(res.data.volumeAmount);
        })
        .catch(err => console.log(err));
    }, 30000); // Polls every 30 seconds

    // This is important to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleGenWallets = () => {
    if (walletCount === '') {
      toast.error('Please input wallet count');
      return;
    }
    generateWallet(parseInt(walletCount)).then(res => {
      if (res.data.new) {
        toast.success('Sub Wallets generated successfully');
      } else {
        toast.info('You have already generated sub wallets');
      }
    }).catch(() => {
      toast.error('Something went wrong');
    });
  }

  const handleSolDistribute = async () => {
    if (solAmount === '') {
      toast.error('Please input amount');
      return;
    }
    setIsLoading(true);
    try {
      const res = await distributeSOLManually({ amount: solAmount })
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
  }

  const handleWSolDistribute = async () => {
    if (wsolAmount === '') {
      toast.error('Please input amount');
      return
    }
    setIsLoading(true);
    try {
      const res = await distributeWSOLManually({ amount: wsolAmount })
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
  }

  const loadSubWallets = async () => {
    setIsTableLoading(true);
    const res = await getAllSubWallets({ tokenAddr: tokenAddress, poolAddr: poolAddress });
    setSubWallets(res.data);
    setIsTableLoading(false);
  }

  useEffect(() => {
    // const poll = setInterval(() => {
    // }, 10000); // Poll every 5 seconds
    loadSubWallets();
    // return () => clearInterval(poll); // Clean up on component unmount
  }, []);

  const copyWalletAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Copied to clipboard');
  }

  const handleBuyToken = async (address: string, amount: string) => {
    if (tokenAddress === '' || poolAddress === '') {
      toast.error('Please input token and pool address');
      return;
    }
    if (amount === '') {
      toast.error('Please input amount');
      return;
    }
    setIsLoading(true);
    try {
      const res = await buyTokenManually({ tokenAddr: tokenAddress, poolAddr: poolAddress, txAmount: amount, walletKey: address });
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
  }

  const handleSellToken = async (address: string, amount: string) => {
    if (tokenAddress === '' || poolAddress === '') {
      toast.error('Please input token and pool address');
      return;
    }
    if (amount === '') {
      toast.error('Please input amount');
      return;
    }
    setIsLoading(true);
    try {
      const res = await sellTokenManually({ tokenAddr: tokenAddress, poolAddr: poolAddress, txAmount: amount, walletKey: address });
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
  }

  const handleCloseAccount = async (walletKey: string) => {
    setIsLoading(true);
    try {
      const res = await closeAccount({ tokenAddr: tokenAddress, poolAddr: poolAddress, walletKey });
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error('Something went wrong');
    }
    setIsLoading(false);
  }

  const start = async () => {
    if (tokenAddress === '' || poolAddress === '' || minTxAmount === '' || maxTxAmount === '' || timeInterval === '') {
      toast.error('Please fill all the fields');
      return;
    }
    try {
      const res = await getBotInfo();
      if (res.data.isRunning) {
        toast.info('Bot is already running');
      } else {
        const data = {
          tokenAddr: tokenAddress,
          poolAddr: poolAddress,
          minTxAmount: minTxAmount,
          maxTxAmount: maxTxAmount,
          timeInterval: timeInterval
        };
        toast.success('Bot started successfully');
        setIsRunning(true);
        const res = await startBot(data);
        if (res.data.success) {
          toast.success(res.data.message);
        } else {
          setIsRunning(false);
          toast.error(res.data.message);
        }
      }
    }
    catch {
      toast.error('Something went wrong');
    }
  }

  const stop = async () => {
    stopBot().then(res => {
      if (res.data.success) {
        toast.success(res.data.message);
        setIsRunning(false);
      } else {
        toast.error(res.data.message);
      }
    }
    ).catch(() => {
      toast.error('Something went wrong');
    });
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className=''>
        <ToastContainer />
        <div className='text-5xl font-semibold max-w-[1280px] mb-12'>Solana Volume Bot</div>
        <div className='mt-6 text-left'>
          <span className='text-2xl font-medium'>1. Input Your Target Info</span>
          <div className='flex gap-4 mt-2'>
            <Input label="Token Address" placeholder="Enter your Token address" className="input-placeholder-color" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
            <Input label="Pool Address" placeholder="Enter your Pool address" className="input-placeholder-color" value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} />
          </div>
        </div>

        <div className='mt-6 text-left'>
          <span className='text-2xl font-medium'>2. Generate Sub Wallets</span>
          <div className='flex items-center gap-4 mt-2'>
            <Input label="Wallet Count" placeholder="Enter your Wallet Count" className="input-placeholder-color" value={walletCount} onChange={(e) => setWalletCount(e.target.value)} />
            <Button color="blue" className='text-sm min-w-fit' onClick={handleGenWallets}>Generate Sub Wallets</Button>
          </div>
        </div>

        <div className='mt-6 text-left'>
          <span className='text-2xl font-medium'>3. Make Volume Automatically</span>
          <div className='flex items-center gap-4 mt-2'>
            <Input label="Min Tx Amount" placeholder="Enter your min Transaction amount" className="input-placeholder-color" value={minTxAmount} onChange={(e) => setMinTxAmount(e.target.value)} />
            <Input label="Max Tx Amount" placeholder="Enter your max Transaction amount" className="input-placeholder-color" value={maxTxAmount} onChange={(e) => setMaxTxAmount(e.target.value)} />
            <Input label="Time Interval" placeholder="Enter Time Interval" className="input-placeholder-color" value={timeInterval} onChange={(e) => setTimeInterval(e.target.value)} />
            {!isRunning && <Button color="blue" className='text-sm min-w-fit' onClick={start}>Start</Button>}
            {isRunning && <Button color="red" className='text-sm min-w-fit' onClick={stop}>Stop</Button>}
          </div>
        </div>

        <div className='mt-6 text-left'>
          <span className='text-2xl font-medium'>4. Distribute SOL Manually</span>
          <div className='flex items-center gap-4 mt-2'>
            <Input label="SOL Amount" placeholder="Enter your min Transaction amount" className="input-placeholder-color" value={solAmount} onChange={(e) => setSolAmount(e.target.value)} />
            <Button color="blue" className='text-sm min-w-fit' onClick={handleSolDistribute}>Distribute</Button>
          </div>
        </div>

        <div className='mt-6 text-left'>
          <span className='text-2xl font-medium'>5. Distribute WSOL Manually</span>
          <div className='flex items-center gap-4 mt-2'>
            <Input label="WSOL Amount" placeholder="Enter your min Transaction amount" className="input-placeholder-color" value={wsolAmount} onChange={(e) => setWSolAmount(e.target.value)} />
            <Button color="blue" className='text-sm min-w-fit' onClick={handleWSolDistribute}>Distribute</Button>
          </div>
        </div>

        <div className='mt-6 text-left'>
          <div className='flex items-center gap-4'>
            <span className='text-2xl font-medium'>6. Make Volume Manually</span>
            <Button color="blue" className='text-xs capitalize min-w-fit' size='sm' variant='outlined' onClick={loadSubWallets}>Refresh Table</Button>
          </div>
          <Card className="w-full h-full mt-2 overflow-auto">
            {isTableLoading ? (
              <Loader />
            ) :
              <table className="w-full text-left table-auto min-w-max">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th key={head} className="p-4 text-center">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subWallets.length > 0 ? (
                    subWallets.map((wallet: SubWallet, index) => (
                      <tr key={wallet._id}>
                        <td className="p-4 text-center">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            Wallet #{index + 1}
                          </Typography>
                        </td>
                        <td className="p-4 text-center">
                          <Tooltip content={"Click to copy"}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                              onClick={() => copyWalletAddress(wallet.key)}
                            >
                              {wallet.key.slice(0, 4)}...{wallet.key.slice(-4)}
                            </Typography>
                          </Tooltip>
                        </td>
                        <td className="p-4 text-center">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {wallet.solBalance}
                          </Typography>
                        </td>
                        <td className="p-4 text-center">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {wallet.wsolBalance}
                          </Typography>
                        </td>
                        <td className="p-4 text-center">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {wallet.tokenBalance}
                          </Typography>
                        </td>
                        <td className="p-4 text-center">
                          <Input label="WSOL or Token Amount" className="input-placeholder-color" value={txAmounts[wallet.key] || ''}
                            onChange={(e) => setTxAmounts({ ...txAmounts, [wallet.key]: e.target.value })} />
                        </td>
                        <td className="p-4 text-center">
                          <div className='flex justify-center gap-4'>
                            <Button color="green" className='text-sm' size='sm' onClick={() => handleBuyToken(wallet.key, txAmounts[wallet.key])}>Buy</Button>
                            <Button color="blue" className='text-sm' size='sm' onClick={() => handleSellToken(wallet.key, txAmounts[wallet.key])}>Sell</Button>
                            <Button color="red" className='text-sm' size='sm' onClick={() => handleCloseAccount(wallet.key)}>Close</Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center">
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          NO GENERATED SUB WALLETS YET
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            }
          </Card>
        </div>

        <div className='mt-6 mb-2 text-lg font-medium underline'>
          <span>Total Volume:</span> <span className='text-2xl'>${totalVolume}</span>
        </div>
        <TableInfo />
      </div>
    </>
  )
}

export default App
