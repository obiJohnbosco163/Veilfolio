# Veilfolio

**One portfolio. Separate identities. Private by design.**

A privacy-first portfolio layer for Starknet that lets users organize one unified portfolio into separate, privacy-aware execution identities for apps, venues and strategies, powered by STRK20.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- A Starknet wallet (e.g., Argent, Braavos)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd veilfolio

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
```

### Building

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📁 Project Structure

```
veilfolio/
├── app/               # Next.js frontend application
│   ├── app/          # App Router
│   ├── components/   # React components
│   ├── lib/          # Utilities and helpers
│   ├── pages/        # Page components
│   └── styles/       # Global styles
├── contracts/        # Cairo smart contracts
│   ├── src/         # Cairo source code
│   ├── tests/       # Cairo tests
│   └── Scarb.toml   # Scarb configuration
├── assets/          # Shared assets (logos, images)
└── strk20.json      # STRK20 integration metadata
```

## 🔐 Privacy Model

Veilfolio uses **STRK20** to implement private transactions and balances:

### What is Private
- Transaction amounts inside the STRK20 pool
- Recipient identities for private transfers
- Private DeFi execution paths
- Shielded balances

### What Remains Public
- Deposit transactions (ERC-20 → pool)
- Withdrawal transactions (pool → ERC-20)
- Public entry/exit on the Starknet blockchain

For detailed privacy documentation, see [Privacy Center](./docs/PRIVACY.md).

## 🏗️ Architecture

Veilfolio consists of 5 layers:

1. **User Wallet** — Standard Starknet wallet connection
2. **STRK20 Privacy Layer** — Shield, transfer, and unshield operations
3. **Execution Identity Manager** — Portfolio bucket abstraction
4. **Portfolio Aggregation Engine** — Unified balance and PnL tracking
5. **Mainnet Execution** — Real STRK20 pool interaction

## 🔌 STRK20 Integration

- Privacy Wallet API for standard operations
- STRK20 pool shielding and unshielding
- Private transfers within the pool
- Private DeFi where supported
- Proof-backed privacy transactions

## 🎯 Core Features

- **Unified Portfolio** — One dashboard for all execution identities
- **Private Execution Identities** — Separate contexts for trading, DeFi, yield, long-term holdings, and custom strategies
- **Privacy Center** — Transparent documentation of what is and isn't private
- **Real Mainnet Integration** — Live STRK20 pool interaction
- **Allocation Tracking** — Visual portfolio allocation by identity
- **PnL Calculation** — Realized and unrealized gains/losses
- **Risk Scoring** — Portfolio and identity-level risk metrics

## 📊 Demo

See the [3-minute demo](./docs/DEMO.md) for a walkthrough of core features.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test -w app

# Run contract tests only
npm run contracts:test
```

## 📦 Deployment

### Mainnet

```bash
npm run build
npm run start
```

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

### Contract Deployment

Contracts are deployed to mainnet via Scarb.

See [Smart Contracts](./contracts/README.md) for details.

## 📚 Documentation

- [Privacy Model](./docs/PRIVACY.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [STRK20 Integration](./docs/STRK20.md)
- [Security Considerations](./docs/SECURITY.md)
- [Threat Model](./docs/THREAT_MODEL.md)
- [Smart Contracts](./contracts/README.md)

## 🔍 Mainnet Transactions

Verified STRK20 pool transactions demonstrating the product:

| Type | Hash | Status |
|------|------|--------|
| Shield | TBD | — |
| Private Transfer | TBD | — |
| Unshield | TBD | — |

## 🛣️ Roadmap

**V1** — STRK20 privacy primitives, execution identities, unified portfolio

**V2** — Native STRK20 private sub-account integration (when available)

**V3** — Per-app execution identities

**V4** — Per-venue execution identities

**V5** — Automated strategy identities

**V6** — Institutional private portfolio management

## ⚖️ License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## 👥 Contributors

- Veilfolio Team

## ❓ FAQ

### Is Veilfolio a wallet?

No. Veilfolio is a **portfolio layer** that works with existing Starknet wallets. It uses STRK20 for private execution.

### What makes it different?

Unlike traditional wallets that expose all activity as one public identity, Veilfolio lets you organize one unified portfolio into multiple privacy-aware execution identities. This separates your strategies without turning your portfolio into a public graph.

### Is it 100% anonymous?

No. Veilfolio is not anonymous; it is **privacy-aware**. STRK20 hides transaction details inside the pool, but deposit and withdrawal transactions remain visible on the public blockchain as ERC-20 transfers. See [Privacy Model](./docs/PRIVACY.md) for details.

### Can I use this on mainnet?

Yes. Veilfolio is designed for mainnet Starknet and real STRK20 pool interaction. Always test thoroughly before moving funds.

### Is the code audited?

This is a hackathon project. While we aim for security best practices, no formal audit has been conducted. Review code carefully before using with significant funds.

## 🤝 Contributing

Contributions are welcome! Please open issues and pull requests on GitHub.

## 📞 Support

For issues, questions, or feedback, please open an issue on GitHub.

---

**Built for the STRK20 Private Sprint 2026.**

Veilfolio is the portfolio layer for private execution on Starknet.
