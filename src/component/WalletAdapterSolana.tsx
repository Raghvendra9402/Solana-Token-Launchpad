import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ReactNode } from 'react';

interface walletModalChildrenProps {
    children : ReactNode
}

export function WalletAdapterSolana({children} : walletModalChildrenProps){
    return (
        <div>
            <ConnectionProvider endpoint={"https://api.devnet.solana.com/"}>
                <WalletProvider wallets={[]} autoConnect>
                    <WalletModalProvider>
                        {children}
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    )
}