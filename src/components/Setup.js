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
import { SendTransactionComponent } from './SendTransaction';

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

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        console.log(publicKey)

        // const NETWORK = clusterApiUrl("devnet");
        // const connection = new Connection(NETWORK);
        // let provider = wallets[0]._publicKey;
        // console.log(provider)

        // const tokenAccount = Keypair.generate();
        // console.log(`token account: ${tokenAccount.publicKey.toBase58()}`);
        // let tx = new Transaction().add(
        // // create token account
        //     SystemProgram.createAccount({
        //         fromPubkey: provider.publicKey,
        //         newAccountPubkey: tokenAccount.publicKey,
        //         space: AccountLayout.span,
        //         lamports: await Token.getMinBalanceRentForExemptAccount(connection),
        //         programId: TOKEN_PROGRAM_ID,
        //     }),
        //     // init mint account
        //     // Token.createInitAccountInstruction(
        //     //     TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        //     //     mintPubkey, // mint
        //     //     tokenAccount.publicKey, // token account
        //     //     alice.publicKey // owner of token account
        //     // )
        // );

        // console.log(tx)

        // const blockHash = await connection.getRecentBlockhash()
        // tx.feePayer = provider
        // tx.recentBlockhash = await blockHash.blockhash
        // const signed = await provider.signTransaction(tx);
        // console.log(signed, " signedsignedsigned")
        // signed.serialize()
        
        // if (!publicKey) throw new WalletNotConnectedError();

        // const transaction = new Transaction().add(
        //     SystemProgram.transfer({
        //         fromPubkey: publicKey,
        //         toPubkey: Keypair.generate().publicKey,
        //         lamports: 1,
        //     })
        // );

        // const signature = await sendTransaction(transaction, connection);

        // await connection.confirmTransaction(signature, 'processed');
    }, [publicKey, sendTransaction, connection]);

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
                        <SendTransactionComponent/>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
            <br/>
            <br/>
        </div>
    );
}