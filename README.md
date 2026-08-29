# Veilfolio

**One portfolio. Separate identities. Private by design.**

Veilfolio is a privacy-first portfolio management layer for Starknet. It lets users organize a single wallet into multiple isolated execution identities — each with its own context, strategy, and privacy profile — powered by STRK20 privacy pools.

Built for the [STRK20 Private Sprint 2026](https://github.com/starkience/strk20-hackathon) hackathon.

## Live Demo

| | |
|---|---|
| **Demo** | [https://veilfolio.vercel.app](https://veilfolio.vercel.app) |
| **Network** | Starknet Sepolia (mainnet ready) |
| **Wallet** | Argent / Braavos via starknet-react |

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- A Starknet wallet (Argent or Braavos)

### Install & Run

```bash
git clone <repo-url>
cd veilfolio
cd app
npm install
cp ../.env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What Veilfolio Does

Veilfolio solves a real problem: on Starknet, all your DeFi activity, trades, and portfolio movements are linked to a single public address. Anyone can trace your entire financial history.

Veilfolio gives you **isolated execution identities** — separate on-chain personas for trading, DeFi, yield farming, long-term holdings, and more. Each identity is:

- **On-chain** — Created via the IdentityManager contract on Starknet
- **Separate** — Activity under one identity doesn't leak to others
- **Private-ready** — Connected to STRK20 for shielding, private transfers, and unshielding
- **Switchable** — Toggle between identities from one dashboard

## Architecture

```
veilfolio/
├── contracts/              # Cairo smart contracts
│   ├── src/
│   │   ├── identity_manager.cairo   # Identity CRUD + status management
│   │   ├── anonymizer.cairo         # STRK20 privacy pool helper
│   │   └── lib.cairo
│   ├── tests/              # snforge tests (5 passing)
│   └── Scarb.toml          # Scarb 2.18.0, starknet 2.18.0
│
├── app/                    # Next.js 16 frontend
│   ├── app/                # App Router pages
│   │   ├── page.tsx                # Dashboard (connected + disconnected)
│   │   ├── identity/new/page.tsx   # Identity creation wizard
│   │   ├── identity/[id]/page.tsx  # Identity detail + operations
│   │   ├── privacy/page.tsx        # Privacy education center
│   │   └── architecture/page.tsx   # Architecture docs
│   ├── components/
│   │   ├── WalletBar.tsx           # Nav bar + wallet connect
│   │   ├── IdentityCard.tsx        # Identity card with numbered layout
│   │   ├── PrivacyOperations.tsx   # Shield / Transfer / Unshield modals
│   │   └── PortfolioOverview.tsx   # Portfolio stats grid
│   ├── context/
│   │   └── PortfolioContext.tsx     # Portfolio state + chain-aware balance
│   ├── lib/
│   │   ├── strk20.ts               # STRK20 SDK, identity ops, balance, tx history
│   │   ├── contracts.ts            # Contract addresses + ABIs
│   │   └── sounds.ts               # Web Audio UI sound effects (no assets)
│   └── providers/
│       ├── StarknetProvider.tsx     # Multi-chain provider (mainnet + sepolia)
│       └── ThemeProvider.tsx        # Dark / Light / System toggle
│
├── scripts/
│   └── deploy-mainnet.ts   # Mainnet deployment script
└── strk20.json             # STRK20 hackathon submission metadata
```

## Smart Contracts

### IdentityManager (`identity_manager.cairo`)

On-chain identity registry deployed on Starknet Sepolia.

| | |
|---|---|
| **Address** | `0x05e9b7866bb7a77a8c9881e46847963eae20b5d7222c99c5f9f0985560d4d1fb` |
| **Class Hash** | `0xe977670cc859d20a5d6c8dd31211e661cfa4bd0ddf419555797450633c2bfa` |
| **Network** | Starknet Sepolia |

**Entry points:**

- `create_identity(name, identity_type)` — Create a new execution identity
- `get_identities(owner)` — List all identities for an owner address
- `get_identity(id)` — Get a single identity by ID
- `set_identity_status(id, is_active)` — Activate or deactivate an identity
- `get_identity_count()` — Total identities created

**Identity types:** TRADING, DEFI, YIELD, LONG_TERM, APP, VENUE, STRATEGY, CUSTOM

### Anonymizer (`anonymizer.cairo`)

STRK20 privacy pool helper contract.

| | |
|---|---|
| **Address** | `0x0066bb5b454d5a8488cd3988afd9a6790e38dc6f9e51e7ba162237a903c44ab3` |
| **Network** | Starknet Sepolia |

## Frontend

**Stack:** Next.js 16, React 19, starknet-react v5, starknet.js v10, Tailwind CSS v4

### Pages

- **Dashboard** (`/`) — Wallet balance with animated counters, identity grid with numbered cards, stat pills, connect/disconnect
- **Create Identity** (`/identity/new`) — 5-step wizard: Type > Name > Privacy > Confirm > Done
- **Identity Detail** (`/identity/[id]`) — Balance card, quick actions (Shield/Transfer/Unshield), shielded mode toggle, on-chain details, privacy operations modal, activity tab, settings (activate/deactivate)
- **Privacy Center** (`/privacy`) — The cryptography, science and vision behind STRK20: the founder's story, the STARK proof system, post-quantum security, Cairo, what "private" means in practice, limitations, and 10 primary sources
- **Architecture** (`/architecture`) — The 5-layer design, the Cairo contracts, and why the stack is post-quantum-secure by architecture

### Key Features

- **Multi-network support** — Detects mainnet vs sepolia from wallet, fetches balances from the correct RPC
- **Animated counters** — Balance numbers animate on load with cubic easing
- **Dark/Light/System theme** — Persisted in localStorage, flash-prevention script in `<head>`
- **Identity type system** — 8 types with color-coded icons, human-readable labels, purpose descriptions
- **Shielded mode toggle** — Per-identity privacy mode stored in localStorage
- **Privacy operations** — In-page modal popups for Shield, Private Transfer, Unshield with pre-selected tabs
- **Transaction history** — Fetches ERC-20 Transfer events from RPC with felt252 normalization
- **Coming Soon banner** — Gracefully shows STRK20 pool status when not deployed on current network
- **UI sound effects** — Synthesized Web Audio tones (clicks, pops, success/error arpeggios) with a mute toggle, persisted in localStorage
- **Responsive design** — Mobile-first with touch-friendly targets (min 44px), adaptive layouts

### Wallet Balance

STRK balance is fetched directly from the ERC-20 contract via RPC — no indexer required:

```
STRK Token: 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
```

Handles all RPC response formats: `{low, high}` u256 structs, flat BigInt, number, hex string.

## Privacy Model

### What STRK20 Hides (inside the pool)

- Sender identity
- Recipient identity
- Transaction amounts
- Token information
- Transaction details

### What Remains Public

- Deposit transactions (ERC-20 transfer from wallet to pool)
- Withdrawal transactions (ERC-20 transfer from pool to wallet)
- Deposit amounts
- Block-level metadata and timing correlations

Veilfolio stores **nothing server-side**. All identity metadata stays in your browser's localStorage.

## The Cryptography Behind It

Veilfolio rides on the cryptography that StarkWare built — and inherits its post-quantum posture.

### STARK proofs

STRK20 shields every operation with a **STARK** proof (Scalable Transparent Argument of Knowledge), introduced by Eli Ben-Sasson, Iddo Bentov, Lior Horesh and Michael Riabzev in the paper *[Scalable, Transparent, and Post-Quantum Secure Computational Integrity](https://eprint.iacr.org/2018/046)*. STARKs verify in polylogarithmic time, need **no trusted setup**, and run on **hash functions only** — which is exactly what makes them post-quantum.

### Post-quantum by architecture

Most chains rest on elliptic curves, breakable by Shor's algorithm (exponential speedup on a quantum computer). STARKs use only hashes, which a quantum computer attacks with at worst a quadratic (Grover's) speedup — a structural, not bolted-on, advantage. StarkWare's roadmap (June 2026) is already replacing Pedersen hashes and signatures with post-quantum primitives while coordinating the Layer-1 ECDSA migration — "changing an airplane's engine mid-flight," in Ben-Sasson's words.

### Cairo: programs that prove themselves

Our contracts — the IdentityManager and the Anonymizer — are written in **Cairo 2024_07**, the language from the *[Cairo: A Turing-Complete STARK-Friendly CPU Architecture](https://eprint.iacr.org/2021/1063)* paper. As the [Cairo Book](https://www.starknet.io/cairo-book/) puts it, echoing C.S. Lewis: Cairo is "the crypto-community's answer" to *doing the right thing, even when no one is watching*.

Primary sources and deep dives — including the founder's vision ([Eli Ben-Sasson](https://x.com/EliBenSasson)) and the Nightfall institutional-privacy integration — are collected in the app's **Privacy Center** (`/privacy`).

## Testing

```bash
# Cairo contract tests
cd contracts && snforge test

# Frontend build check
cd app && npm run build
```

5/5 contract tests passing. Frontend builds clean with zero TypeScript errors.

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contracts | Cairo edition 2024_07, starknet 2.18.0, Sierra 1.8.0 |
| Contract tooling | Scarb 2.18.0, snforge 0.61.0, sncast 0.61.0 |
| Frontend | Next.js 16, React 19, TypeScript |
| Starknet SDK | starknet.js v10, starknet-react v5.0.3 |
| Styling | Tailwind CSS v4 |
| Network | Starknet Sepolia (mainnet ready) |

## Roadmap

- **V1 (current)** — Identity management, wallet balance, STRK20 privacy operations UI
- **V2** — Native STRK20 private sub-account integration
- **V3** — Per-app execution identities
- **V4** — Per-venue execution identities
- **V5** — Automated strategy identities
- **V6** — Institutional private portfolio management

## License

MIT

---

**Built for the STRK20 Private Sprint 2026.**
