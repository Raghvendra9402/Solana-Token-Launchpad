import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { pack, createInitializeInstruction } from "@solana/spl-token-metadata";

export default function TokenLaunchPad() {
  const wallet = useWallet();
  const { connection } = useConnection();

  async function createToken() {
    if (!wallet.publicKey) return;
    const mintKeypair = Keypair.generate();
    const metadata = {
      mint: mintKeypair.publicKey,
      name: "RS",
      symbol: "PUTT JATT DA",
      uri: "https://cdn.100xdevs.com/metadata.json",
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        wallet.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintKeypair.publicKey,
        metadata: mintKeypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
      })
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(mintKeypair);

    await wallet.sendTransaction(transaction, connection);

    console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
    const associatedToken = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    console.log("ATA ", associatedToken.toBase58());

    const transaction2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedToken,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(transaction2, connection);

    const transaction3 = new Transaction().add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedToken,
        wallet.publicKey,
        1000000000,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    const signature = await wallet.sendTransaction(transaction3, connection);

    console.log("Minted! & sign is ", signature);
  }

  return (
    <div className="flex flex-col bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-8 text-gray-700 text-center">
        Solana Token Creator
      </h2>
      <div className="flex flex-col mb-4">
        <label className="mb-2 font-medium text-gray-600">Name</label>
        <input
          type="text"
          placeholder="Enter token name"
          className="bg-gray-100 text-gray-900 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-2 font-medium text-gray-600">Symbol</label>
        <input
          type="text"
          placeholder="Enter token symbol"
          className="bg-gray-100 text-gray-900 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-2 font-medium text-gray-600">Description</label>
        <input
          type="text"
          placeholder="Enter token description"
          className="bg-gray-100 text-gray-900 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-2 font-medium text-gray-600">Supply</label>
        <input
          type="text"
          placeholder="Enter total supply"
          className="bg-gray-100 text-gray-900 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-2 font-medium text-gray-600">Decimals</label>
        <input
          type="text"
          placeholder="Enter number of decimals"
          className="bg-gray-100 text-gray-900 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <button
        className="bg-black text-white p-2 mt-6 rounded-lg"
        onClick={createToken}
      >
        Create Token
      </button>
    </div>
  );
}
