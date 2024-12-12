import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react";

export default function Balance() {
    const wallet = useWallet();
    const {connection} = useConnection();
    const [balance , setBalance] = useState<number | null>();

    useEffect(() => {
        
        async function fetchBalance() {
            try {
            if (!wallet.publicKey){
                setBalance(null);
                return;
            }
            const balance = await connection.getBalance(wallet.publicKey)/1e9;
            setBalance(balance);
        }catch(e) {
            console.log("can't fetch");
        }
        }

        fetchBalance();
    },[connection, wallet.publicKey]);
    return (
        <div className="text-white font-medium">{balance ? balance.toFixed(5) + " SOL" : "Balance"} </div>
    )
}