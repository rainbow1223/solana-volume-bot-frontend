import { Button, Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getTableData } from "../services/api";
import useRunStore from "../store";

interface TableRows {
  txn_date: string;
  txn_type: string;
  txn_maker: string;
  txn_amount: string;
  txn_id: string;
}

const TABLE_HEAD = ["Date", "Type", "Maker", "Amount(SOL)", "Tx Link"];

export function TableInfo() {
  const [tableData, setTableData] = useState<TableRows[]>([]);
  const { isRunning } = useRunStore();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isRunning) return;
      getTableData().then((res) => {
        setTableData(res.data);
        // Here you can set the state with the received info if needed
      }).catch((err) => console.log(err));
    }, 30000); // Polls every 30 seconds

    // This is important to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const refreshTable = () => {  
    getTableData().then((res) => {
      setTableData(res.data);
      // Here you can set the state with the received info if needed
    }).catch((err) => console.log(err));
  }

  return (
    <>
      <Button color="blue" className='mb-2 text-xs capitalize w-fit' size='sm' variant='outlined' onClick={refreshTable}>Refresh Table</Button>
      <Card className="">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => {
              const isLast = index === tableData.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={index}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {data.txn_date}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-normal ${data.txn_type === 'buy' ? "text-green-900" : "text-red-900"}`}
                    >
                      {data.txn_type.toUpperCase()}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {data.txn_maker.slice(0, 5)}....{data.txn_maker.slice(-5)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {data.txn_amount}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      <a href={`https://solscan.io/tx/${data.txn_id}`} className="underline" target="_blank">View Tx</a>
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}