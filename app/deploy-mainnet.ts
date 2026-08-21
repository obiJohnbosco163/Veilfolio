// @ts-nocheck
import { RpcProvider, Account, json } from "starknet";
import { readFileSync } from "fs";
import { resolve } from "path";

const RPC_URL = process.env.STARKNET_RPC || "https://starknet-rpc.publicnode.com";
const PRIVATE_KEY = "0x041d9197c26373d735f729b040d4f2615a69a4cd7f43923222a722e19a477667";
const ACCOUNT_ADDRESS = "0x03021D67062Af741348d87Bf9E9A6783e5f32cABcFb667525e78003D98d58aa0";

const CONTRACTS_DIR = resolve(__dirname, "../contracts/target/dev");

async function main() {
  console.log("Connecting to Starknet mainnet via", RPC_URL);
  const provider = new RpcProvider({ nodeUrl: RPC_URL });

  const chainId = await provider.getChainId();
  console.log("Chain ID:", chainId);

  console.log("Creating account...");
  const account = new Account({
    provider,
    address: ACCOUNT_ADDRESS,
    signer: PRIVATE_KEY,
    cairoVersion: "1",
  });

  console.log("Account address:", account.address);

  const gasDetails = {
    l2Gas: 50000000n,
    l1Gas: 0n,
    l1DataGas: 0n,
    tip: 0n,
  };

  // Declare IdentityManager
  console.log("\n--- Declaring VeilfolioIdentityManager ---");
  const imSierra = json.parse(
    readFileSync(resolve(CONTRACTS_DIR, "veilfolio_VeilfolioIdentityManager.contract_class.json"), "utf8")
  );
  const imCasm = json.parse(
    readFileSync(resolve(CONTRACTS_DIR, "veilfolio_VeilfolioIdentityManager.compiled_contract_class.json"), "utf8")
  );
  const imDeclare = await account.declare({ contract: imSierra, casm: imCasm }, gasDetails);
  console.log("IdentityManager class hash:", imDeclare.class_hash);
  console.log("IdentityManager declare tx:", imDeclare.transaction_hash);

  // Deploy IdentityManager
  console.log("\n--- Deploying VeilfolioIdentityManager ---");
  const imDeploy = await account.deployContract({
    classHash: imDeclare.class_hash,
    constructorCalldata: [],
  }, gasDetails);
  console.log("IdentityManager deployed at:", imDeploy.contract_address);

  // Declare Anonymizer
  console.log("\n--- Declaring VeilfolioAnonymizer ---");
  const azSierra = json.parse(
    readFileSync(resolve(CONTRACTS_DIR, "veilfolio_VeilfolioAnonymizer.contract_class.json"), "utf8")
  );
  const azCasm = json.parse(
    readFileSync(resolve(CONTRACTS_DIR, "veilfolio_VeilfolioAnonymizer.compiled_contract_class.json"), "utf8")
  );
  const azDeclare = await account.declare({ contract: azSierra, casm: azCasm }, gasDetails);
  console.log("Anonymizer class hash:", azDeclare.class_hash);
  console.log("Anonymizer declare tx:", azDeclare.transaction_hash);

  // Deploy Anonymizer
  console.log("\n--- Deploying VeilfolioAnonymizer ---");
  const azDeploy = await account.deployContract({
    classHash: azDeclare.class_hash,
    constructorCalldata: [],
  }, gasDetails);
  console.log("Anonymizer deployed at:", azDeploy.contract_address);

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("IdentityManager class_hash:", imDeclare.class_hash);
  console.log("IdentityManager address:", imDeploy.contract_address);
  console.log("Anonymizer class_hash:", azDeclare.class_hash);
  console.log("Anonymizer address:", azDeploy.contract_address);
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
