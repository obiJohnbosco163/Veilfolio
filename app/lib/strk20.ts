import { AccountInterface, CairoCustomEnum, Contract, RpcProvider } from "starknet";
import {
  IDENTITY_MANAGER_ABI,
  ANONYMIZER_ABI,
  IDENTITY_MANAGER_ADDRESS,
  ANONYMIZER_ADDRESS,
  STRK20_PRIVACY_POOL_ADDRESS,
  TOKENS,
  type TokenSymbol,
} from "./contracts";

const STARKNET_RPC_URL =
  process.env.NEXT_PUBLIC_STARKNET_RPC_URL ||
  "https://starknet-sepolia-rpc.publicnode.com";

const MAINNET_RPC_URL = "https://starknet-mainnet.public.blastapi.io";

// starknet-react chain IDs (bigint → string)
const RPC_URLS: Record<string, string> = {
  // starknet-react bigint IDs
  "393402133025997798000961": STARKNET_RPC_URL,       // sepolia
  "23448594291968334": MAINNET_RPC_URL,               // mainnet
  // Also handle hex-encoded chain IDs from other sources
  "0x534e5f5345504f4c4941": STARKNET_RPC_URL,         // SN_SEPOLIA
  "0x534e5f4d41494e4e4554": MAINNET_RPC_URL,          // SN_MAIN
};

function isMainnetChainId(chainId?: string | number | bigint): boolean {
  if (!chainId) return false;
  const id = chainId.toString();
  return id === "23448594291968334" || id === "0x534e5f4d41494e4e4554";
}

function getProviderForChain(chainId?: string | number | bigint): RpcProvider {
  if (!chainId) {
    // No chain info yet — use sepolia as default (matches defaultChainId)
    return new RpcProvider({ nodeUrl: STARKNET_RPC_URL });
  }
  const id = chainId.toString();
  const nodeUrl = RPC_URLS[id] || (isMainnetChainId(chainId) ? MAINNET_RPC_URL : STARKNET_RPC_URL);
  return new RpcProvider({ nodeUrl });
}

export const provider = new RpcProvider({ nodeUrl: STARKNET_RPC_URL });

// ──────────────────────────────────────────────────
// Identity Manager Contract Interaction
// ──────────────────────────────────────────────────

function getIdentityManagerContract(account?: AccountInterface) {
  return new Contract({
    abi: IDENTITY_MANAGER_ABI as any,
    address: IDENTITY_MANAGER_ADDRESS,
    providerOrAccount: account || provider,
  });
}

export type OnChainIdentity = {
  id: bigint;
  name: string;
  identity_type: number;
  owner: string;
  created_at: bigint;
  is_active: boolean;
};

const IDENTITY_TYPE_MAP: Record<number, string> = {
  0: "TRADING",
  1: "DEFI",
  2: "YIELD",
  3: "LONG_TERM",
  4: "APP",
  5: "VENUE",
  6: "STRATEGY",
  7: "CUSTOM",
};

const IDENTITY_TYPE_REVERSE: Record<string, number> = {
  TRADING: 0,
  DEFI: 1,
  YIELD: 2,
  LONG_TERM: 3,
  APP: 4,
  VENUE: 5,
  STRATEGY: 6,
  CUSTOM: 7,
};

export const IDENTITY_TYPE_LABEL: Record<string, string> = {
  TRADING: "Trading",
  DEFI: "DeFi",
  YIELD: "Yield",
  LONG_TERM: "Long-Term",
  APP: "App",
  VENUE: "Venue",
  STRATEGY: "Strategy",
  CUSTOM: "Custom",
};

export function humanReadableIdentityName(typeName: string, id: number): string {
  const label = IDENTITY_TYPE_LABEL[typeName] ?? typeName;
  return `${label} #${id}`;
}

export function normalizeIdentity(raw: any): OnChainIdentity {
  let typeCode: number;
  if (raw.identity_type && typeof raw.identity_type === "object" && typeof raw.identity_type.activeVariant === "function") {
    const variant = raw.identity_type.activeVariant();
    typeCode = IDENTITY_TYPE_REVERSE[variant] ?? 7;
  } else if (typeof raw.identity_type === "object" && raw.identity_type !== null) {
    typeCode = raw.identity_type.TRADING !== undefined ? 0
      : raw.identity_type.DEFI !== undefined ? 1
      : raw.identity_type.YIELD !== undefined ? 2
      : raw.identity_type.LONG_TERM !== undefined ? 3
      : raw.identity_type.APP !== undefined ? 4
      : raw.identity_type.VENUE !== undefined ? 5
      : raw.identity_type.STRATEGY !== undefined ? 6
      : 7;
  } else {
    typeCode = typeof raw.identity_type === "number" ? raw.identity_type : 0;
  }

  // ContractAddress (felt252) may come back as BigInt, number, or hex string
  const rawOwner = raw.owner;
  let ownerStr: string;
  if (typeof rawOwner === "string") {
    ownerStr = rawOwner;
  } else if (typeof rawOwner === "bigint") {
    ownerStr = "0x" + rawOwner.toString(16).padStart(64, "0");
  } else if (typeof rawOwner === "number") {
    ownerStr = "0x" + BigInt(rawOwner).toString(16).padStart(64, "0");
  } else {
    ownerStr = String(rawOwner ?? "");
  }

  // felt252 zero means empty name — BigInt(0) or "0" should become ""
  const rawName = raw.name;
  let nameStr: string;
  if (!rawName || rawName === "0" || rawName === 0n || rawName === 0) {
    nameStr = "";
  } else if (typeof rawName === "bigint") {
    nameStr = String(rawName);
  } else {
    nameStr = String(rawName);
  }

  return {
    id: raw.id !== undefined ? BigInt(raw.id.low ?? raw.id) : BigInt(0),
    name: nameStr,
    identity_type: typeCode,
    owner: ownerStr,
    created_at: BigInt(raw.created_at ?? 0),
    is_active: raw.is_active === true || raw.is_active === 1 ||
      (typeof raw.is_active === "object" && raw.is_active !== null && typeof raw.is_active.activeVariant === "function" && raw.is_active.activeVariant() === "True") ||
      (typeof raw.is_active === "object" && raw.is_active !== null && "True" in raw.is_active),
  };
}

export function getIdentityTypeName(typeCode: number): string {
  return IDENTITY_TYPE_MAP[typeCode] || "CUSTOM";
}

export function getIdentityTypeCode(typeName: string): number {
  return IDENTITY_TYPE_REVERSE[typeName] ?? 7;
}

export async function getIdentitiesForOwner(ownerAddress: string): Promise<OnChainIdentity[]> {
  const contract = getIdentityManagerContract();
  try {
    const result = await contract.call("get_identities", [ownerAddress]);
    const rawArray = result as any[];
    return rawArray.map(normalizeIdentity);
  } catch (err) {
    console.error("Failed to fetch identities:", err);
    return [];
  }
}

export async function getIdentityCount(): Promise<bigint> {
  const contract = getIdentityManagerContract();
  try {
    const result = await contract.call("get_identity_count", []);
    return BigInt(result as any);
  } catch {
    return BigInt(0);
  }
}

export async function createOnChainIdentity(
  account: AccountInterface,
  name: string,
  typeName: string
): Promise<bigint> {
  const contract = getIdentityManagerContract(account);

  const allTypes = ['TRADING', 'DEFI', 'YIELD', 'LONG_TERM', 'APP', 'VENUE', 'STRATEGY', 'CUSTOM'];
  const identityType = new CairoCustomEnum(
    Object.fromEntries(allTypes.map((t) => [t, t === typeName ? true : undefined]))
  );
  await contract.invoke("create_identity", [name, identityType]);

  const count = await getIdentityCount();
  return count - BigInt(1);
}

export async function setIdentityStatus(
  account: AccountInterface,
  identityId: bigint,
  isActive: boolean
): Promise<void> {
  const idLow = identityId & ((BigInt(1) << BigInt(128)) - BigInt(1));
  const idHigh = identityId >> BigInt(128);
  // core::bool: False=0, True=1 — encode as variant index
  const boolValue = isActive ? 1 : 0;

  await account.execute(
    [
      {
        contractAddress: IDENTITY_MANAGER_ADDRESS,
        entrypoint: "set_identity_status",
        calldata: [
          idLow.toString(),
          idHigh.toString(),
          boolValue.toString(),
        ],
      },
    ],
  );
}

// ──────────────────────────────────────────────────
// STRK20 Privacy Pool Integration
// ──────────────────────────────────────────────────

export interface ShieldRequest {
  token: TokenSymbol;
  amount: string;
  identityId: bigint;
}

export interface PrivateTransferRequest {
  recipient: string;
  token: TokenSymbol;
  amount: string;
  sourceIdentityId: bigint;
}

export interface UnshieldRequest {
  token: TokenSymbol;
  amount: string;
  sourceIdentityId: bigint;
  recipient: string;
}

function getTokenAddress(symbol: TokenSymbol): string {
  return TOKENS[symbol].address;
}

function parseUnits(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

const ERC20_APPROVE_ABI = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "core::starknet::contract_address::ContractAddress" },
      { name: "amount", type: "core::integer::u256" },
    ],
    outputs: [{ type: "core::bool" }],
    state_mutability: "external",
  },
] as const;

/**
 * Shield funds into the STRK20 privacy pool.
 */
export async function shield(
  account: AccountInterface,
  request: ShieldRequest
): Promise<string> {
  const tokenAddress = getTokenAddress(request.token);
  const decimals = TOKENS[request.token].decimals;
  const amount = parseUnits(request.amount, decimals);

  const tokenContract = new Contract({
    abi: ERC20_APPROVE_ABI as any,
    address: tokenAddress,
    providerOrAccount: account,
  });

  const approveTx = await tokenContract.invoke("approve", [
    STRK20_PRIVACY_POOL_ADDRESS,
    { low: amount.toString(), high: "0" },
  ]);
  await provider.waitForTransaction(approveTx.transaction_hash);

  const poolContract = new Contract({
    abi: [
      {
        type: "function",
        name: "deposit",
        inputs: [
          { name: "token", type: "core::starknet::contract_address::ContractAddress" },
          { name: "amount", type: "core::integer::u128" },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ] as any,
    address: STRK20_PRIVACY_POOL_ADDRESS,
    providerOrAccount: account,
  });

  const depositTx = await poolContract.invoke("deposit", [
    tokenAddress,
    amount.toString(),
  ]);
  await provider.waitForTransaction(depositTx.transaction_hash);

  return depositTx.transaction_hash;
}

/**
 * Execute a private transfer within the STRK20 pool.
 */
export async function privateTransfer(
  account: AccountInterface,
  request: PrivateTransferRequest
): Promise<string> {
  const tokenAddress = getTokenAddress(request.token);
  const decimals = TOKENS[request.token].decimals;
  const amount = parseUnits(request.amount, decimals);

  const poolContract = new Contract({
    abi: [
      {
        type: "function",
        name: "transfer",
        inputs: [
          { name: "recipient", type: "core::starknet::contract_address::ContractAddress" },
          { name: "token", type: "core::starknet::contract_address::ContractAddress" },
          { name: "amount", type: "core::integer::u128" },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ] as any,
    address: STRK20_PRIVACY_POOL_ADDRESS,
    providerOrAccount: account,
  });

  const tx = await poolContract.invoke("transfer", [
    request.recipient,
    tokenAddress,
    amount.toString(),
  ]);
  await provider.waitForTransaction(tx.transaction_hash);

  return tx.transaction_hash;
}

/**
 * Unshield funds from the STRK20 privacy pool back to a public address.
 */
export async function unshield(
  account: AccountInterface,
  request: UnshieldRequest
): Promise<string> {
  const tokenAddress = getTokenAddress(request.token);
  const decimals = TOKENS[request.token].decimals;
  const amount = parseUnits(request.amount, decimals);

  const poolContract = new Contract({
    abi: [
      {
        type: "function",
        name: "withdraw",
        inputs: [
          { name: "token", type: "core::starknet::contract_address::ContractAddress" },
          { name: "amount", type: "core::integer::u128" },
          { name: "recipient", type: "core::starknet::contract_address::ContractAddress" },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ] as any,
    address: STRK20_PRIVACY_POOL_ADDRESS,
    providerOrAccount: account,
  });

  const tx = await poolContract.invoke("withdraw", [
    tokenAddress,
    amount.toString(),
    request.recipient,
  ]);
  await provider.waitForTransaction(tx.transaction_hash);

  return tx.transaction_hash;
}

/**
 * Get the shielded balance for an identity.
 * Note: In STRK20, balances are private. This returns 0 as a placeholder.
 */
export async function getShieldedBalance(_identityId: bigint): Promise<string> {
  return "0";
}

// ──────────────────────────────────────────────────
// ERC-20 Balance Reading
// ──────────────────────────────────────────────────

const ERC20_BALANCE_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "core::starknet::contract_address::ContractAddress" }],
    outputs: [{ type: "core::integer::u256" }],
    state_mutability: "view",
  },
] as const;

/**
 * Robustly extract a BigInt from an ERC-20 balanceOf response.
 * Handles: { low, high }, flat BigInt, number, hex string.
 */
function extractU256(raw: any): bigint {
  if (raw === null || raw === undefined) return 0n;
  // { low, high } struct from Cairo
  if (typeof raw === "object" && ("low" in raw || "high" in raw)) {
    const low = BigInt(raw.low ?? 0);
    const high = BigInt(raw.high ?? 0);
    return low + (high << 128n);
  }
  // Already a BigInt
  if (typeof raw === "bigint") return raw;
  // Number
  if (typeof raw === "number") return BigInt(raw);
  // Hex string or decimal string
  if (typeof raw === "string") {
    if (raw.startsWith("0x") || raw.startsWith("0X")) return BigInt(raw);
    return BigInt(raw);
  }
  return 0n;
}

/**
 * Read the ERC-20 STRK balance of an address.
 * Returns a human-readable string like "12.3456".
 */
export async function getStrkBalance(address: string, chainId?: string | number | bigint): Promise<string> {
  try {
    const rpcProvider = chainId ? getProviderForChain(chainId) : provider;
    const contract = new Contract({
      abi: ERC20_BALANCE_ABI as any,
      address: TOKENS.STRK.address,
      providerOrAccount: rpcProvider,
    });
    const result = await contract.call("balanceOf", [address]);
    const balance = extractU256(result);
    return formatUnits(balance, 18);
  } catch (err) {
    console.error("Failed to fetch STRK balance:", err);
    return "0.0000";
  }
}

/**
 * Read ERC-20 balances for STRK, USDC, and ETH.
 */
export async function getTokenBalances(address: string): Promise<Record<TokenSymbol, string>> {
  const [strk, usdc, eth] = await Promise.allSettled([
    getStrkBalance(address),
    getErc20Balance(address, TOKENS.USDC.address, TOKENS.USDC.decimals),
    getErc20Balance(address, TOKENS.ETH.address, TOKENS.ETH.decimals),
  ]);

  return {
    STRK: strk.status === 'fulfilled' ? strk.value : '0',
    USDC: usdc.status === 'fulfilled' ? usdc.value : '0',
    ETH: eth.status === 'fulfilled' ? eth.value : '0',
  };
}

async function getErc20Balance(address: string, tokenAddr: string, decimals: number): Promise<string> {
  const contract = new Contract({
    abi: ERC20_BALANCE_ABI as any,
    address: tokenAddr,
    providerOrAccount: provider,
  });
  const result = await contract.call("balanceOf", [address]);
  const balance = extractU256(result);
  return formatUnits(balance, decimals);
}

function formatUnits(raw: bigint, decimals: number): string {
  if (raw === 0n) return "0." + "0".repeat(Math.min(decimals, 4));
  const divisor = 10n ** BigInt(decimals);
  const whole = raw / divisor;
  const frac = raw % divisor;
  const showDigits = Math.min(decimals, 4);
  const fracStr = frac.toString().padStart(decimals, "0").slice(0, showDigits);
  return `${whole.toString()}.${fracStr}`;
}

// ──────────────────────────────────────────────────
// Transaction History (via Starknet RPC)
// ──────────────────────────────────────────────────

export interface TransactionRecord {
  txHash: string;
  type: 'TRANSFER' | 'INVOKE' | 'DEPLOY' | 'DECLARE' | 'L1_HANDLER' | 'UNKNOWN';
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: string;
}

/**
 * Normalize an address to felt252 format (0x + 64 zero-padded hex chars).
 */
function toFelt252(address: string): string {
  const hex = address.replace(/^0x/i, "").replace(/^0+/, "");
  return "0x" + hex.padStart(64, "0");
}

/**
 * Fetch recent transaction events for an address.
 * Uses starknet_getEvents with the Transfer event key.
 * Gracefully returns [] if RPC doesn't support address filtering.
 */
export async function getTransactionHistory(
  address: string,
  limit: number = 20,
  chainId?: string | number | bigint
): Promise<TransactionRecord[]> {
  const ERC20_TRANSFER_KEY = "0x99cd8bde5578148226dd4696a26a035fd34770fdd754b3198b26e3dba99f65b";
  const feltAddress = toFelt252(address);
  const rpcProvider = chainId ? getProviderForChain(chainId) : provider;

  try {
    const events = await rpcProvider.getEvents({
      address: feltAddress,
      from_block: { block_number: 0 },
      to_block: "pending",
      keys: [[ERC20_TRANSFER_KEY]],
      chunk_size: limit,
    } as any);

    return (events?.events ?? []).map((ev: any) => ({
      txHash: ev.transaction_hash ?? "",
      type: "TRANSFER" as const,
      from: ev.from_address ?? "",
      to: ev.data?.[0] ?? "",
      amount: ev.data?.[1] ?? "",
      timestamp: ev.block_number ?? 0,
      status: "ACCEPTED_ON_L2",
    }));
  } catch (err) {
    console.warn("getEvents with address filter failed, trying without filter:", err);
    try {
      const events = await rpcProvider.getEvents({
        from_block: { block_number: 0 },
        to_block: "pending",
        keys: [[ERC20_TRANSFER_KEY]],
        chunk_size: limit,
      } as any);

      return (events?.events ?? [])
        .filter((ev: any) => {
          const from = ev.from_address ?? "";
          const to = ev.data?.[0] ?? "";
          return from.toLowerCase() === address.toLowerCase() || to.toLowerCase() === address.toLowerCase();
        })
        .slice(0, limit)
        .map((ev: any) => ({
          txHash: ev.transaction_hash ?? "",
          type: "TRANSFER" as const,
          from: ev.from_address ?? "",
          to: ev.data?.[0] ?? "",
          amount: ev.data?.[1] ?? "",
          timestamp: ev.block_number ?? 0,
          status: "ACCEPTED_ON_L2",
        }));
    } catch {
      console.warn("Transaction history unavailable from RPC");
      return [];
    }
  }
}
