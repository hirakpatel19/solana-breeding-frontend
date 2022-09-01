import * as anchor from "@project-serum/anchor"
import { PublicKey, Keypair } from "@solana/web3.js"
import { SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js"
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
  getMint,
  createCloseAccountInstruction,
  createAssociatedTokenAccountInstruction,
  createAccount,
  MintLayout,
  AccountLayout,
  createInitializeMintInstruction,
  createInitializeAccountInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token"
import { isValidSolanaAddress } from "@nfteyez/sol-rayz"
import { toast } from "react-toastify"

import {
  REWARD_TOKEN_MINT,
  CLASS_TYPES,
  PROGRAM_ID,
  SECONDS_PER_DAY,
  LOCK_DAY,
  REWARDS_BY_RARITY,
  CHAINLINK_FEED,
  CHAINLINK_PROGRAM_ID,
  ZZZ_TOKEN_MINT,
  PYTH_ACCOUNT,
} from "./constants"
import {
  getBuyerStateKey,
  getGlobalState,
  getZzzVaultKey,
  getRaffleKey,
  getRewardVaultKey,
  getAuctionKey,
  getBidderStateKey,
  getNftVaultKey,
  getNativeVaultKey,
  getNftCreatorKey,
} from "./keys"
import {
  getMultipleTransactions,
  sendMultiTransactions,
  getAssociatedTokenAccount,
  getNFTTokenAccount,
} from "./utils"

import { sendTransactions } from "./connection.tsx"

import * as bs58 from "bs58"

import BigNumber from "bignumber.js"
import axios from "axios"

const IDL = require("./idl")

export const getProgram = (wallet, connection) => {
  let provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  )
  const program = new anchor.Program(IDL, PROGRAM_ID, provider)
  return program
}

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)

const getMetadata = async (mint) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

const getMasterEdition = async (mint) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

const removeTraitId = (trait) => {
  let foundIdx = trait.indexOf("#")
  if (foundIdx != -1) {
    return trait.slice(0, foundIdx)
  }

  return trait
}

export const mintMainNft = async (wallet, connection, traitsList) => {
  let params = {}

  for (let i = 0; i < traitsList.length; i++) {
    let layer = "layer" + (i + 1)
    let trait = "trait" + (i + 1)
    params[layer] = traitsList[i].name
    params[trait] = removeTraitId(traitsList[i].trait)
  }

  console.log("mintMainNft params", params)

  try {
    let resMeta = await axios.get(`http://157.245.197.130:4000/query`, {
      params: params,
    })
    console.log("generating nft result", resMeta)
    if (resMeta.data.success) {
      let signersMatrix = []
      let instructionsMatrix = []
      let tmp = await mintOneNFT(wallet, connection, resMeta.data.jsonLink)
      instructionsMatrix.push(tmp.instructions)
      signersMatrix.push(tmp.signers)

      for (let i = 0; i < traitsList.length; i++) {
        let insts = await burnTraits(wallet, connection, traitsList[i].nftData)
        instructionsMatrix.push(insts)
      }

      let txs = await sendTransactions(
        connection,
        wallet,
        instructionsMatrix,
        signersMatrix
      )
      toast.success("Transaction confirmed")
      console.log("resMeta.data.jsonLink", resMeta.data.jsonLink)
      return resMeta.data.jsonLink
    }
    // return resMeta.data.jsonLink
  } catch (error) {
    toast.error("Transaction Failed")
    console.log("mintMainNft", error)
  }

  return null
}

export const mintTraits = async (wallet, connection, traitsList) => {
  let signersMatrix = []
  let instructionsMatrix = []

  for (let i = 0; i < traitsList.length; i++) {
    let layer = traitsList[i].layer
    let trait = traitsList[i].trait

    let params = {
      layer: layer,
      trait: trait,
    }

    try {
      console.log("start uploadtoipfs to server", params)
      let resMeta = await axios.get(`http://157.245.197.130:4000/uploadtoipfs`, {
        params: params,
      })
      console.log("trait ipfs result", resMeta)
      let tmp = await mintOneNFT(wallet, connection, resMeta.data)
      instructionsMatrix.push(tmp.instructions)
      signersMatrix.push(tmp.signers)
    } catch (error) {
      console.log("mint one nft error : ", error)
    }
  }

  try {
    if (instructionsMatrix.length > 0) {
      let txs = await sendTransactions(
        connection,
        wallet,
        instructionsMatrix,
        signersMatrix
      )
      toast.success("Transaction confirmed")
      return txs
    }
  } catch (error) {
    toast.error("Transaction Failed")
    console.log("mint transaction error : ", error)
    return null
  }
}

export const mintOneNFT = async (wallet, connection, jsonLink) => {
  const mintKey = anchor.web3.Keypair.generate()
  const program = getProgram(wallet, connection)

  const NftTokenAccount = new Keypair()

  const mintRent =
    await program.provider.connection.getMinimumBalanceForRentExemption(
      MintLayout.span
    )
  const accountRent =
    await program.provider.connection.getMinimumBalanceForRentExemption(
      AccountLayout.span
    )

  const mint_tx = new anchor.web3.Transaction().add(
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintKey.publicKey,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID,
      lamports: mintRent,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: NftTokenAccount.publicKey,
      lamports: accountRent,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKey.publicKey,
      0,
      wallet.publicKey,
      wallet.publicKey
    ),
    createInitializeAccountInstruction(
      NftTokenAccount.publicKey,
      mintKey.publicKey,
      wallet.publicKey
    )
  )

  let oneInstSet = {
    instructions: [...mint_tx.instructions],
    signers: [mintKey, NftTokenAccount],
  }

  const metadataAddress = await getMetadata(mintKey.publicKey)
  const masterEdition = await getMasterEdition(mintKey.publicKey)

  const nftCreatorKey = await getNftCreatorKey()

  let instMint = await program.methods
    .mintNft(jsonLink, "TTT", "2XS")
    .accounts({
      mintOwner: wallet.publicKey,
      mint: mintKey.publicKey,
      accToken: NftTokenAccount.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      metadata: metadataAddress,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      payer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      accMaster: masterEdition,
      maker: nftCreatorKey,
    })
    .instruction()

  oneInstSet.instructions.push(instMint)

  return oneInstSet
}

export const burnTraits = async (wallet, connection, nftData) => {
  const program = getProgram(wallet, connection)

  console.log("burn data", nftData)
  let nftMint = new PublicKey(nftData.mint)

  const accToken1 = await connection.getTokenAccountsByOwner(wallet.publicKey, {
    mint: nftMint,
  })

  if (accToken1.value.length == 0) {
    return []
  }

  const sourceAddr = accToken1.value[0].pubkey
  console.log("burn token account", sourceAddr.toBase58())

  let instructions = []
  let instBurn = await program.methods
    .burnMyNft()
    .accounts({
      authority: wallet.publicKey,
      mintAna: nftMint,
      userAna: sourceAddr,
    })
    .instruction()

  instructions.push(instBurn)

  return instructions
}

// export const bidRefund = async (wallet, connection, auctionId) => {
//     const program = getProgram(wallet, connection);

//     let res = await program.account.bidderState.all(
//         [
//             {
//                 memcmp: {
//                     offset: 8,
//                     bytes: bs58.encode([auctionId]),
//                 }
//             },
//         ]
//     );

//     let globalStateKey = await getGlobalState();
//     let auctionKey = await getAuctionKey(auctionId);

//     let instructions = [];
//     for (let i = 0; i < res.length; i++) {
//         let bidder = res[i].account.bidder;
//         const ix = await program.methods.bidRefund(auctionId).accounts({
//             admin: wallet.publicKey,
//             globalState: globalStateKey,
//             auction: auctionKey,
//             bidder: bidder,
//             bidderState: res[i].publicKey,
//             zzzMint: ZZZ_TOKEN_MINT,
//             zzzVault: await getZzzVaultKey(),
//             destAccount: res[i].account.refundReceiver,
//         }).instruction();
//         instructions.push(ix);
//     }

//     let instructionSet = await getMultipleTransactions(connection, wallet, instructions);
//     res = await sendMultiTransactions(connection, wallet, instructionSet);
//     console.log('bidRefund', res);
//     return res;
// }
