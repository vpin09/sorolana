import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SorolanBridge } from "../target/types/sorolan_bridge";
import * as spltoken from "@solana/spl-token";
import nacl from "tweetnacl";
import { decodeUTF8, encodeUTF8 } from "tweetnacl-util";
import * as web3 from "@solana/web3.js";
import {
  LAMPORTS_PER_SOL,
  Keypair,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import fs from "fs";
import { base64 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
// import { abc } from "./msg";

//anchor test --skip-local-validator --skip-build --skip-deploy

const PROGRAM_SEED_PREFIX = "soroban_solana";
const USER_SEED_PREFIX = "prevent_duplicate_claimV1";
const AUTHORITY_SEED_PREFIX = "soroban_authority";
const amount = new anchor.BN(2 * LAMPORTS_PER_SOL);
const destination_address =
  "GDUUZPJFLI6BHGUHH32L7UMAJQHCI5VTHETE3PNRXS554W3OV7HBFIVR";
let user_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/user.json").toString()))
);
let validator0_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator.json").toString()))
);
let validator1_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator1.json").toString()))
);
let validator2_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator2.json").toString()))
);
let deployer_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/deployer.json").toString()))
);
let mint_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/mint.json").toString()))
);
let provider = anchor.AnchorProvider.env();

let sorolanaTokenParams = {
  name: "Sorolana",
  symbol: "WSOR",
  uri: "sorolana_bridge",
  decimals: 100,
};

let db_msg = {
  counter: 0,
  tokenAddress: "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT",
  tokenChain: "1234",
  to: "5fDJ2JsUcN4A14tLVxWVnGJHwAo8a4VCYfTLNZmZe4fE",
  toChain: "6789",
  fee: 100,
  amount: 0.001,
};

let Soroban_msg = {
  counter: 0,
  tokenAddress: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U",
  tokenChain: "1234",
  to: "9cxGAnXieeQ4dGYFK5QAAJtdBCVnRM1pWZDHDB9PCEW3",
  toChain: "5678",
  fee: 100,
  method: "Deposit",
  amount: 20,
};

let validator_signature =
  "aef69058e007dbc22c27eed672a86a813037265740ac4dedbc1de01183f2078d96bceabe6d8884e677eba40827780ee80861bb7464705700a5dd8c65197ae701";
let user_kp_pubkey = new PublicKey(
  "5fDJ2JsUcN4A14tLVxWVnGJHwAo8a4VCYfTLNZmZe4fE"
);
// let user_kp_pubkey = new PublicKey(
//   "Y959mtt5U4SRzLnXUtPvQDR5RRfX5vYwZJisrftWckC"
// );
let Withdraw_msg = {
  counter: 1,
  tokenAddress: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U",
  tokenChain: 123,
  to: "GGPud2eDjZ4QNrCrriLcppB617BEAKPXcyPGYsFrxeeP",
  toChain: 456,
  fee: 100,
  method: "Burn",
  amount: 1,
};

describe("sorolan_bridge", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SorolanBridge as Program<SorolanBridge>;
  let isRunTestCase = true;

  const getAuthorityPda = async () => {
    const authorityPdaInfo = web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(AUTHORITY_SEED_PREFIX),
        program.provider.publicKey.toBuffer(),
      ],
      program.programId
    );
    console.log(
      "🚀 ~ file: sorolan_bridge.ts:94 ~ getAuthorityPda ~ authorityPdaInfo:",
      authorityPdaInfo[0].toBase58()
    );
    return authorityPdaInfo;
  };
  const getProgramPda = async () => {
    console.log(
      "🚀 ~ file: sorolana.ts:23 ~ getProgramPda ~ Authority publicKey:",
      program.provider.publicKey.toBase58()
    );
    const programPdaInfo = web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(PROGRAM_SEED_PREFIX),
        program.provider.publicKey.toBuffer(),
      ],
      program.programId
    );
    console.log(
      "🚀 ~ file: sorolan_bridge.ts:108 ~ getProgramPda ~ programPdaInfo:",
      programPdaInfo[0].toBase58()
    );
    return programPdaInfo;
  };
  const getUserPda = async (user: PublicKey) => {
    const userPdaInfo = web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode(USER_SEED_PREFIX), user.toBuffer()],
      program.programId
    );
    return userPdaInfo;
  };

  // Get ATA
  const getAta = async (
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve?: boolean
  ) => {
    const ata = await spltoken.getAssociatedTokenAddress(
      mint,
      owner,
      allowOwnerOffCurve
    );
    // console.log("🚀 ~ file: verifyUtility.ts:42 ~ getAta ~ ata:", ata.toBase58());
    console.log(
      "🚀 ~ file: sorolan_bridge.ts:84 ~ describe ~ owner:",
      owner.toBase58()
    );
    return ata;
  };

  it("Can initialize a authority pda: ", async () => {
    if (isRunTestCase) {
      const [authorityPda, authorityBump] =
        web3.PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode(AUTHORITY_SEED_PREFIX),
            program.provider.publicKey.toBuffer(),
          ],
          program.programId
        );
      const tx = await program.methods
        .initAuthorityPda(authorityBump)
        .accounts({
          authority: program.provider.publicKey,
          authorityPda: authorityPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      console.log("🚀 ~ file: sorolan_bridge.ts:110 ~ it ~ tx:", tx);
    }
  });

  it("Authority can initialize the mint account: ", async () => {
    if (isRunTestCase) {
      try {
        let authorityPdaInfo = await getAuthorityPda();
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:142 ~ it ~ mint_kp.publicKey:",
          mint_kp.publicKey.toBase58()
        );
        const initPdaTx = await program.methods
          .initTokenMint()
          .accounts({
            authority: program.provider.publicKey,
            authorityPda: authorityPdaInfo[0],
            mint: mint_kp.publicKey,
            rent: web3.SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
          })
          .signers([mint_kp])
          .rpc();
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:52 ~ it ~ initPdaTx:",
          initPdaTx
        );
      } catch (error) {
        console.log("🚀 ~ file: sorolana.ts:56 ~ it ~ error:", error);
      }
    }
  });

  it("Users can deposit funds to the program pda: ", async () => {
    if (isRunTestCase) {
      try {
        const [program_pda, player_bump] = await getProgramPda();
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:209 ~ it ~ program_pda:",
          program_pda.toBase58()
        );

        const depositTx = await program.methods
          .deposit(amount, destination_address)
          .accounts({
            user: user_kp.publicKey,
            authority: program.provider.publicKey,
            programPda: program_pda,
            systemProgram: SystemProgram.programId,
          })
          .signers([user_kp])
          .rpc({ skipPreflight: true, commitment: "confirmed" });
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:75 ~ it ~ depositTx:",
          depositTx
        );
      } catch (error) {
        console.log("🚀 ~ file: sorolana.ts:78 ~ it ~ error:", error);
      }
    }
  });

  it("Listen events at the time of deposit the funds: ", async () => {
    if (!isRunTestCase) {
      try {
        const depositListener = program.addEventListener(
          "DepositEvent",
          (event, slot) => {
            console.log("DepositEvent: ", event, slot);
          }
        );
        const [program_pda, player_bump] = await getProgramPda();

        for (let i = 0; i < 3; i++) {
          const depositTx = await program.methods
            .deposit(amount, destination_address)
            .accounts({
              user: user_kp.publicKey,
              authority: program.provider.publicKey,
              programPda: program_pda,
              systemProgram: SystemProgram.programId,
            })
            .signers([user_kp])
            .rpc({ skipPreflight: true, commitment: "confirmed" });
          console.log(
            "🚀 ~ file: sorolan_bridge.ts:75 ~ it ~ depositTx:",
            depositTx
          );
        }

        await program.removeEventListener(depositListener);
      } catch (error) {
        console.log("🚀 ~ file: sorolan_bridge.ts:101 ~ it ~ error:", error);
      }
    }
  });

  it("Verfiy and mint method: ", async () => {
    if (isRunTestCase) {
      const message = JSON.stringify(db_msg);
      console.log("🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:", message);
      const messageBytes = Buffer.from(message, "utf-8");
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:280 ~ it ~ messageBytes:",
        messageBytes,
        messageBytes.length
      );
      const signer_pkey = validator0_kp.publicKey.toBytes();

      const signature = nacl.sign.detached(
        messageBytes,
        validator0_kp.secretKey
      );

      let signature_str = Buffer.from(signature).toString("hex");

      // let signature_buf = base64.decode(signature_str);
      let signature_buf = Buffer.from(validator_signature, "hex");

      const result = nacl.sign.detached.verify(
        messageBytes,
        signature_buf,
        validator0_kp.publicKey.toBytes()
      );
      console.log("🚀 ~ file: sorolan_bridge.ts:159 ~ it ~ result:", result);

      let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
        publicKey: validator0_kp.publicKey.toBytes(), // The public key associated with the instruction (as bytes)
        message: messageBytes, // The message to be included in the instruction (as a Buffer)
        signature: signature_buf, // The signature associated with the instruction (as a Buffer)
        // instructionIndex: 0
      });

      const [program_pda, player_bump] = await getProgramPda();
      let authorityPdaInfo = await getAuthorityPda();
      let [userPda, userBump] = await getUserPda(user_kp_pubkey);

      const claimIx = await program.methods
      .claim(
          //@ts-ignore
          validator_kp.publicKey.toBuffer(),
          Buffer.from(message),
          // Buffer.from(signature),
          signature_buf,
          userBump
        )
        .accounts({
          claimer: program.provider.publicKey,
          // user: user_kp.publicKey,
          user: user_kp_pubkey,
          authority: program.provider.publicKey,
          programPda: program_pda,
          userPda: userPda,
          authorityPda: authorityPdaInfo[0],
          tokenAccount: await getAta(mint_kp.publicKey, user_kp_pubkey, false),
          mint: mint_kp.publicKey,
          tokenProgram: spltoken.TOKEN_PROGRAM_ID,
          associatedTokenProgram: spltoken.ASSOCIATED_TOKEN_PROGRAM_ID,
          // authority: program.provider.publicKey,
          ixSysvar: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
          systemProgram: web3.SystemProgram.programId,
        })
        .instruction();
      // Instruction: 1

      let claimTx = new web3.Transaction().add(ix01, claimIx);
      claimTx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;
      claimTx.feePayer = program.provider.publicKey;

      let claimHash: string;
      try {
        claimHash = await web3.sendAndConfirmTransaction(
          provider.connection,
          claimTx,
          [deployer_kp]
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:213 ~ it ~ claimHash:",
          claimHash
        );
      } catch (error) {
        console.log("🚀 ~ file: sorolan_bridge.ts:211 ~ it ~ error:", error);
      }
    }
  });

  it("Burn the token from the user's wallet", async () => {
    if (!isRunTestCase) {
      try {
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:286 ~ it ~ await getAta(mint_kp.publicKey, user_kp.publicKey, false):",
          (await getAta(mint_kp.publicKey, user_kp.publicKey, false)).toBase58()
        );
        let balance = await spltoken.getAccount(
          provider.connection,
          await getAta(mint_kp.publicKey, user_kp.publicKey, false)
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:295 ~ it ~ balance:",
          balance
        );
        const withdrawTx = await program.methods
          .withdraw(new anchor.BN(0.06 * LAMPORTS_PER_SOL), "fghjk")
          .accounts({
            user: user_kp.publicKey,
            mint: mint_kp.publicKey,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            tokenAccount: await getAta(
              mint_kp.publicKey,
              user_kp.publicKey,
              false
            ),
          })
          .signers([user_kp])
          .rpc();
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:288 ~ it ~ withdrawTx:",
          withdrawTx
        );
      } catch (error) {
        console.log("🚀 ~ file: sorolan_bridge.ts:281 ~ it ~ error:", error);
      }
    }
  });

  it("release the funds into the user's wallet: ", async () => {
    if (!isRunTestCase) {
      try {
        const message = JSON.stringify(Withdraw_msg);
        const messageBytes = Buffer.from(message, "utf-8");
        const signer_pkey = validator0_kp.publicKey.toBytes();
        const signature = nacl.sign.detached(
          messageBytes,
          validator0_kp.secretKey
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:333 ~ it ~ signature:",
          signature
        );

        const result = nacl.sign.detached.verify(
          messageBytes,
          signature,
          validator0_kp.publicKey.toBytes()
        );
        console.log("🚀 ~ file: sorolan_bridge.ts:340 ~ it ~ result:", result);

        let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
          publicKey: validator0_kp.publicKey.toBytes(), // The public key associated with the instruction (as bytes)
          message: messageBytes, // The message to be included in the instruction (as a Buffer)
          signature: signature, // The signature associated with the instruction (as a Buffer)
          // instructionIndex: 0
        });

        const [program_pda, player_bump] = await getProgramPda();
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:362 ~ it ~ await getProgramPda()[0]:",
          program_pda.toBase58()
        );
        let [userPda, userBump] = await getUserPda(
          user_kp.publicKey
          // validator0_kp.publicKey
        );
        let authorityPdaInfo = await getAuthorityPda();

        const releaseIx = await program.methods
          .claim(
            //@ts-ignore
            validator0_kp.publicKey.toBuffer(),
            Buffer.from(message),
            Buffer.from(signature),
            userBump
          )
          .accounts({
            claimer: program.provider.publicKey,
            user: user_kp.publicKey,
            authority: program.provider.publicKey,
            programPda: program_pda,
            userPda: userPda,
            authorityPda: authorityPdaInfo[0],
            tokenAccount: await getAta(
              mint_kp.publicKey,
              user_kp.publicKey,
              false
            ),
            mint: mint_kp.publicKey,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            associatedTokenProgram: spltoken.ASSOCIATED_TOKEN_PROGRAM_ID,
            // authority: program.provider.publicKey,
            ixSysvar: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
          })
          .instruction();

        let releaseTx = new web3.Transaction().add(ix01, releaseIx);
        releaseTx.recentBlockhash = (
          await provider.connection.getLatestBlockhash()
        ).blockhash;

        let claimHash = await web3.sendAndConfirmTransaction(
          provider.connection,
          releaseTx,
          [deployer_kp]
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:378 ~ it ~ claimHash:",
          claimHash
        );
      } catch (error) {
        console.log("🚀 ~ file: sorolan_bridge.ts:325 ~ it ~ error:", error);
      }
    }
  });

  it("Claim from db", async () => {
    let msg = {
      counter: 0,
      tokenAddress: "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT",
      tokenChain: "1234",
      to: "AJahZgUcfgNcCsLjGuRbkfMt8NQp1U59F9SpjM3fq4nt",
      toChain: "6789",
      fee: 100,
      method: "deposit",
      amount: 200000000,
    };
    let signature =
      "lT8AhfmvYTSdAv7psxo2RCbqGBueRvRCuyOzL665AoCdpj71BK7FcT4IaXc1eROxkDUmbaGqV5d8Py9v5BZBBA==";
    let validator_key = "3USNdeEfH6hcf9RkczFYJhicBjJ7ugriTSX3j3snQxZE";
    console.log(
      "🚀 ~ file: sorolan_bridge.ts:537 ~ it ~ validator_kp.publicKey:",
      validator0_kp.publicKey.toBase58()
    );

    let message_str = JSON.stringify(msg);
    const messageBytes = Buffer.from(message_str, "utf-8");
    console.log(
      "🚀 ~ file: sorolan_bridge.ts:538 ~ it ~ base64.decode(signature):",
      base64.decode(signature)
    );

    const result = nacl.sign.detached.verify(
      messageBytes,
      base64.decode(signature),
      new PublicKey(validator_key).toBytes()
    );
    console.log("🚀 ~ file: sorolan_bridge.ts:539 ~ it ~ result:", result);
  });
});
