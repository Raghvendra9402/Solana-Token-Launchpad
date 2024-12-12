import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {createInitializeAccount2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID} from "@solana/spl-token"


export default function TokenLaunchPad(){
  const wallet = useWallet();
  const {connection} = useConnection();
  

  async function createToken(){
    const mintKeypair = Keypair.generate();
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    if(!wallet.publicKey){
      return;
    }
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey : wallet.publicKey,
        newAccountPubkey : mintKeypair.publicKey,
        space : MINT_SIZE,
        lamports,
        programId : TOKEN_PROGRAM_ID
      }),
      createInitializeAccount2Instruction(mintKeypair.publicKey,wallet.publicKey,wallet.publicKey,TOKEN_PROGRAM_ID)
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintKeypair);
    await wallet.sendTransaction(transaction,connection);
  }
  
    return (
        <div className="flex flex-col bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
  <h2 className="text-4xl font-bold mb-8 text-gray-700 text-center">Solana Token Creator</h2>
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
  <button className="bg-black text-white p-2 mt-6 rounded-lg" onClick={createToken}>
    Create Token
  </button>
</div>
    )
}