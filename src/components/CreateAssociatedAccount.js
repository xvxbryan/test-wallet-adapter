import React, { useCallback, useMemo  } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Keypair, SystemProgram, Transaction, clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Token, TOKEN_PROGRAM_ID, AccountLayout, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
const bs58 = require('bs58')

export const CreateAssociatedAccount = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, wallet, signTransaction } = useWallet();

    const onClick = useCallback(async () => {
        const NETWORK = clusterApiUrl("devnet");
        const connection = new Connection(NETWORK);

        const mintPubkey = new PublicKey("8fRJfw6PQhqjtfewvJWheUwA6vLPuv8QkqJq2Zv7JFYu");

        // let ata = await Token.getAssociatedTokenAddress(
        //     ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
        //     TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        //     mintPubkey, // mint
        //     publicKey // owner
        // );

        // let accountInfo = await connection.getParsedAccountInfo(ata);

        // console.log("accountInfo ", accountInfo)


        // console.log(`ATA: ${ata.toBase58()}`);
        
        // let associatedAccount = new PublicKey("GojtSKJDUomNrCvsiZmr5mFSWCxrCiCGmmgHfwMJ7LiR");

        const tokenAccount = Keypair.generate();

        let tx = new Transaction().add(
            Token.createApproveInstruction(
                TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
                mintPubkey, // token account
                tokenAccount.publicKey, // delegate
                publicKey, // original auth
                [], // for multisig
                1 // allowed amount
            )
        );

        console.log(tx)

        const blockHash = await connection.getRecentBlockhash()
        tx.recentBlockhash = await blockHash.blockhash;
        tx.feePayer = publicKey;
        
        const signature = await signTransaction(tx);
        console.log("signature ", signature)
        console.log(await connection.sendRawTransaction(signature.serialize()))

    }, [sendTransaction, connection]);

    return (
        <button onClick={onClick} disabled={!publicKey}>Create Associated Account</button>
    );
};