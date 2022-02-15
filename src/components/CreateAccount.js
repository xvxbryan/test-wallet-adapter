import React, { useCallback, useMemo  } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Keypair, SystemProgram, Transaction, clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Token, TOKEN_PROGRAM_ID, AccountLayout, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
const bs58 = require('bs58')

export const CreateAccount = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, wallet, signTransaction } = useWallet();

    const onClick = useCallback(async () => {
        console.log(publicKey)
        const NETWORK = clusterApiUrl("devnet");
        const connection = new Connection(NETWORK);
        const tokenAccount = Keypair.generate();

        const mintPubkey = new PublicKey("8fRJfw6PQhqjtfewvJWheUwA6vLPuv8QkqJq2Zv7JFYu");

        let ata = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            mintPubkey, // mint
            publicKey // owner
        );

        console.log(`ATA: ${ata.toBase58()}`);

        let tx = new Transaction().add(
        // create token account
            SystemProgram.createAccount({
                fromPubkey: publicKey,
                newAccountPubkey: tokenAccount.publicKey,
                space: AccountLayout.span,
                lamports: await Token.getMinBalanceRentForExemptAccount(connection),
                programId: TOKEN_PROGRAM_ID,
            }),
            Token.createAssociatedTokenAccountInstruction(
                ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
                TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
                mintPubkey, // mint
                ata, // ata
                publicKey, // owner of token account
                publicKey // fee payer
            )
        );

        console.log("tx ", tx)
       
        const blockHash = await connection.getRecentBlockhash()
        tx.recentBlockhash = await blockHash.blockhash;
        tx.feePayer = publicKey;
        tx.partialSign(tokenAccount)
        console.log(tokenAccount.publicKey, " tokenAccount.publicKeytokenAccount.publicKeytokenAccount.publicKeytokenAccount.publicKey")
        
        const signature = await signTransaction(tx);
        console.log("signature ", signature)
        console.log(await connection.sendRawTransaction(signature.serialize()))

        //SIGNATURE: 3Vm9sZDdkqvdzuFreFw8NtRxxq1hpCt9UfFG3QAudT9f9aDzkyRXXiB99mXhAsnFu6mNo1FNrzHXpG3hDsYSreyJ
    }, [sendTransaction, connection]);

    return (
        <button onClick={onClick} disabled={!publicKey}>Create Account</button>
    );
};