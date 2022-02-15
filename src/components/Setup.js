import React, { useCallback, useMemo  } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Keypair, SystemProgram, Transaction, clusterApiUrl, Connection } from '@solana/web3.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Token, TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";

import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { CreateAccount } from './CreateAccount';
import { CreateAssociatedAccount } from './CreateAssociatedAccount';

export default function Setup() {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
        ],
        [network]
    );

    return (
        <div>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <WalletMultiButton />
                        <br/>
                        <WalletDisconnectButton />
                        { /* Your app's components go here, nested within the context providers. */ }
                        <br/>
                        <br/>
                        <CreateAccount/>
                        <br/>
                        <br/>
                        <CreateAssociatedAccount/>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
            <br/>
            <br/>
        </div>
    );
}