import { type Address } from '@starknet-react/chains';

export const IDENTITY_MANAGER_ABI = [
  {
    type: "impl",
    name: "VeilfolioIdentityManagerImpl",
    interface_name: "veilfolio::identity_manager::IVeilfolioIdentityManager",
  },
  {
    type: "enum",
    name: "veilfolio::identity_manager::IdentityType",
    variants: [
      { name: "TRADING", type: "()" },
      { name: "DEFI", type: "()" },
      { name: "YIELD", type: "()" },
      { name: "LONG_TERM", type: "()" },
      { name: "APP", type: "()" },
      { name: "VENUE", type: "()" },
      { name: "STRATEGY", type: "()" },
      { name: "CUSTOM", type: "()" },
    ],
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      { name: "low", type: "core::integer::u128" },
      { name: "high", type: "core::integer::u128" },
    ],
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      { name: "False", type: "()" },
      { name: "True", type: "()" },
    ],
  },
  {
    type: "struct",
    name: "veilfolio::identity_manager::Identity",
    members: [
      { name: "id", type: "core::integer::u256" },
      { name: "name", type: "core::felt252" },
      { name: "identity_type", type: "veilfolio::identity_manager::IdentityType" },
      { name: "owner", type: "core::starknet::contract_address::ContractAddress" },
      { name: "created_at", type: "core::integer::u64" },
      { name: "is_active", type: "core::bool" },
    ],
  },
  {
    type: "interface",
    name: "veilfolio::identity_manager::IVeilfolioIdentityManager",
    items: [
      {
        type: "function",
        name: "create_identity",
        inputs: [
          { name: "name", type: "core::felt252" },
          { name: "identity_type", type: "veilfolio::identity_manager::IdentityType" },
        ],
        outputs: [{ type: "core::integer::u256" }],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_identities",
        inputs: [
          { name: "owner", type: "core::starknet::contract_address::ContractAddress" },
        ],
        outputs: [{ type: "core::array::Array::<veilfolio::identity_manager::Identity>" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_identity",
        inputs: [{ name: "identity_id", type: "core::integer::u256" }],
        outputs: [{ type: "veilfolio::identity_manager::Identity" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "set_identity_status",
        inputs: [
          { name: "identity_id", type: "core::integer::u256" },
          { name: "is_active", type: "core::bool" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_identity_count",
        inputs: [],
        outputs: [{ type: "core::integer::u256" }],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [],
  },
  {
    type: "event",
    name: "veilfolio::identity_manager::VeilfolioIdentityManager::IdentityCreated",
    kind: "struct",
    members: [
      { name: "identity_id", type: "core::integer::u256", kind: "data" },
      { name: "owner", type: "core::starknet::contract_address::ContractAddress", kind: "data" },
      { name: "name", type: "core::felt252", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "veilfolio::identity_manager::VeilfolioIdentityManager::IdentityStatusUpdated",
    kind: "struct",
    members: [
      { name: "identity_id", type: "core::integer::u256", kind: "data" },
      { name: "is_active", type: "core::bool", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "veilfolio::identity_manager::VeilfolioIdentityManager::Event",
    kind: "enum",
    variants: [
      { name: "IdentityCreated", type: "veilfolio::identity_manager::VeilfolioIdentityManager::IdentityCreated", kind: "nested" },
      { name: "IdentityStatusUpdated", type: "veilfolio::identity_manager::VeilfolioIdentityManager::IdentityStatusUpdated", kind: "nested" },
    ],
  },
] as const;

export const ANONYMIZER_ABI = [
  {
    type: "impl",
    name: "VeilfolioAnonymizerImpl",
    interface_name: "veilfolio::anonymizer::IVeilfolioAnonymizer",
  },
  {
    type: "struct",
    name: "veilfolio::anonymizer::OpenNoteDeposit",
    members: [
      { name: "note_id", type: "core::felt252" },
      { name: "token", type: "core::starknet::contract_address::ContractAddress" },
      { name: "amount", type: "core::integer::u128" },
    ],
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      { name: "low", type: "core::integer::u128" },
      { name: "high", type: "core::integer::u128" },
    ],
  },
  {
    type: "interface",
    name: "veilfolio::anonymizer::IVeilfolioAnonymizer",
    items: [
      {
        type: "function",
        name: "privacy_invoke",
        inputs: [
          { name: "deposits", type: "core::array::Span::<veilfolio::anonymizer::OpenNoteDeposit>" },
          { name: "identity_id", type: "core::integer::u256" },
        ],
        outputs: [{ type: "core::array::Span::<veilfolio::anonymizer::OpenNoteDeposit>" }],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      { name: "privacy_pool", type: "core::starknet::contract_address::ContractAddress" },
    ],
  },
  {
    type: "event",
    name: "veilfolio::anonymizer::VeilfolioAnonymizer::PrivacyInvokeCalled",
    kind: "struct",
    members: [
      { name: "identity_id", type: "core::integer::u256", kind: "data" },
      { name: "deposit_count", type: "core::integer::u32", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "veilfolio::anonymizer::VeilfolioAnonymizer::Event",
    kind: "enum",
    variants: [
      { name: "PrivacyInvokeCalled", type: "veilfolio::anonymizer::VeilfolioAnonymizer::PrivacyInvokeCalled", kind: "nested" },
    ],
  },
] as const;

// STRK20 Privacy Pool — sepolia (mainnet: 0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a)
export const STRK20_PRIVACY_POOL_ADDRESS: Address =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as Address; // TODO: replace with sepolia pool address

// Veilfolio contract addresses (set after deployment)
// These are placeholder addresses - update after deploying contracts
export const IDENTITY_MANAGER_ADDRESS: Address =
  (process.env.NEXT_PUBLIC_IDENTITY_MANAGER_ADDRESS as Address) ||
  "0x0000000000000000000000000000000000000000000000000000000000000000" as Address;

export const ANONYMIZER_ADDRESS: Address =
  (process.env.NEXT_PUBLIC_ANONYMIZER_ADDRESS as Address) ||
  "0x0000000000000000000000000000000000000000000000000000000000000000" as Address;

// Common Starknet mainnet tokens (addresses are the same on Sepolia and Mainnet)
export const TOKENS = {
  STRK: {
    address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d" as Address,
    symbol: "STRK",
    name: "StarkNet Token",
    decimals: 18,
  },
  USDC: {
    address: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8" as Address,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
  ETH: {
    address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7" as Address,
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
  },
} as const;

export type TokenSymbol = keyof typeof TOKENS;
