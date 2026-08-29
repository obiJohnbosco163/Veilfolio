import { RpcProvider, Account, Contract, json, type CairoAssembly } from "starknet";
import { readFileSync } from "fs";
import { resolve } from "path";

const RPC_URL = process.env.STARKNET_RPC || "https://starknet.drpc.org";
const PRIVATE_KEY = process.env.STARKNET_DEPLOYER_KEY;
const ACCOUNT_ADDRESS = process.env.STARKNET_DEPLOYER_ADDRESS || "0x03021D67062Af741348d87Bf9E9A6783e5f32cABcFb667525e78003D98d58aa0";

if (!PRIVATE_KEY) {
  console.error(
    "ERROR: STARKNET_DEPLOYER_KEY env var is required (the deployer private key).\n" +
      "Never commit a private key to the repository. Generate a fresh key before any mainnet deploy."
  );
  process.exit(1);
}

const CONTRACTS_DIR = resolve(__dirname, "../contracts/target/dev");

const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const BALANCE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "felt" }],
    outputs: [{ name: "balance", type: "Uint256" }],
    stateMutability: "view",
  },
];

async function main() {
  console.log("Connecting to Starknet mainnet via", RPC_URL);
  const provider = new RpcProvider({ nodeUrl: RPC_URL });

  const chainId = await provider.getChainId();
  console.log("Chain ID:", chainId);

  console.log("Creating account...");
  const account = new Account({ provider, address: ACCOUNT_ADDRESS, signer: PRIVATE_KEY, cairoVersion: "1" });

  const strkContract = new Contract({ abi: BALANCE_ABI, address: STRK_TOKEN_ADDRESS, providerOrAccount: provider });
  const balanceRes = (await strkContract.call("balanceOf", [ACCOUNT_ADDRESS])) as { balance: bigint };
  const balanceStrk = Number(balanceRes.balance) / 1e18;
  console.log("Account STRK balance:", balanceStrk.toFixed(4));

  if (balanceStrk === 0) {
    console.error("ERROR: Account has zero STRK balance. Fund it first (a CEX with Starknet withdrawals or bridge from Ethereum).");
    process.exit(1);
  }

  const declareContracts: Array<{ name: string; sierra: any; casm: CairoAssembly }> = [
    {
      name: "VeilfolioIdentityManager",
      sierra: json.parse(
        readFileSync(resolve(CONTRACTS_DIR, "veilfolio_VeilfolioIdentityManager.contract_class.json"), "utf8")
      ),
      casm: json.parse(
        readFileSync(resolve(CONTRACTS_DIR, "veilfolio_VeilfolioIdentityManager.compiled_contract_class.json"), "utf8")
      ),
    },
    {
      name: "VeilfolioAnonymizer",
      sierra: json.parse(
        readFileSync(resolve(CONTRACTS_DIR, "veilfolio_VeilfolioAnonymizer.contract_class.json"), "utf8")
      ),
      casm: json.parse(
        readFileSync(resolve(CONTRACTS_DIR, "veilfolio_VeilfolioAnonymizer.compiled_contract_class.json"), "utf8")
      ),
    },
  ];

  const declared: Array<{ name: string; classHash: string | undefined }> = [];
  for (const { name, sierra, casm } of declareContracts) {
    console.log(`\n--- Declaring ${name} ---`);
    const declareTx = await account.declare({ contract: sierra, casm });
    console.log(`${name} class hash:`, declareTx.class_hash);
    console.log(`${name} declare tx:`, declareTx.transaction_hash);
    await provider.waitForTransaction(declareTx.transaction_hash, { retryInterval: 2000 });
    console.log(`${name} declare accepted`);
    declared.push({ name, classHash: declareTx.class_hash });
  }

  const deployed: Array<{ name: string; classHash: string | undefined; address: string | undefined; tx: string | undefined }> = [];
  for (const { name, classHash } of declared) {
    console.log(`\n--- Deploying ${name} ---`);
    const deployTx = await account.deployContract({
      classHash,
      constructorCalldata: [],
    });
    deployed.push({ name, classHash, address: deployTx.contract_address, tx: deployTx.transaction_hash });
    console.log(`${name} deployed at:`, deployTx.contract_address);
    console.log(`${name} deploy tx:`, deployTx.transaction_hash);
  }

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  for (const d of deployed) {
    console.log(`${d.name} class_hash: ${d.classHash}`);
    console.log(`${d.name} address: ${d.address}`);
    console.log(`${d.name} deploy tx: ${d.tx}`);
  }
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});