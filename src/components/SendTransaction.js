import React, { useCallback, useMemo  } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Keypair, SystemProgram, Transaction, clusterApiUrl, Connection } from '@solana/web3.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Token, TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";

export const SendTransactionComponent = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        console.log(publicKey)
        const NETWORK = clusterApiUrl("devnet");
        const connection = new Connection(NETWORK);

        const tokenAccount = Keypair.generate();
        console.log(`token account: ${tokenAccount.publicKey.toBase58()}`);
        let tx = new Transaction().add(
        // create token account
            SystemProgram.createAccount({
                fromPubkey: publicKey,
                newAccountPubkey: tokenAccount.publicKey,
                space: AccountLayout.span,
                lamports: await Token.getMinBalanceRentForExemptAccount(connection),
                programId: TOKEN_PROGRAM_ID,
            }),
            // init mint account
            // Token.createInitAccountInstruction(
            //     TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            //     mintPubkey, // mint
            //     tokenAccount.publicKey, // token account
            //     alice.publicKey // owner of token account
            // )
        );

        const blockHash = await connection.getRecentBlockhash()
        tx.feePayer = publicKey
        tx.recentBlockhash = await blockHash.blockhash
        console.log(tx)

        const signature = await sendTransaction(tx, connection);
        console.log(signature)

        await connection.confirmTransaction(signature, 'processed');
    }, [publicKey, sendTransaction, connection]);

    return (
        <button onClick={onClick} disabled={!publicKey}>
            Transaction
        </button>
    );
};