import * as anchor from '@project-serum/anchor';
import { PublicKey } from "@solana/web3.js";
import {
  PROGRAM_ID,
  NFT_CREATOR_SEED,
} from "./constants"

/** Get NFT Staking Account Keys  */

export const getNftCreatorKey = async () => {
  const [nftCreatorKey] = await asyncGetPda(
    [Buffer.from(NFT_CREATOR_SEED)],
    PROGRAM_ID
  );
  return nftCreatorKey;
};


const asyncGetPda = async (
  seeds,
  programId
) => {
  const [pubKey, bump] = await PublicKey.findProgramAddress(seeds, programId);
  return [pubKey, bump];
};