import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import Balance from './Balance';
import('@solana/wallet-adapter-react-ui/styles.css');

export default function Header() {
    return (
        <div className='sticky top-0 flex justify-between items-center px-12 py-4 bg-black'> 
            <ConnectionProvider endpoint={"https://api.devnet.solana.com/"}>
            <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
                <div className='text-white text-lg font-bold font-mono hover:text-purple-300 cursor-pointer' >
                    <a href="/">RSxDevs</a>
                </div>
                <div className='flex justify-center items-center'>
                    <Balance />
                    <WalletMultiButton style={{backgroundColor : "black", color: "white", fontSize : "18px", borderRadius : "8px"}}/>
                </div>
            </WalletModalProvider>
            </WalletProvider>
            </ConnectionProvider>
        </div>
    )
}