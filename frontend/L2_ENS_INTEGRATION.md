# L2 ENS Integration Guide

This guide explains how to implement and use L2 ENS subnames for the Nosen platform on Lisk Sepolia.

## Overview

We've implemented **L2 ENS subnames** using CCIP Read (Cross-Chain Interoperability Protocol) to provide:
- **Lower costs**: Gas fees are significantly reduced on L2
- **Faster transactions**: L2 block times are much faster than L1
- **Better UX**: Users can register subdomains without high Ethereum gas fees
- **Cross-chain resolution**: Subdomains work seamlessly across L1 and L2

## Architecture

```
L1 (Ethereum Mainnet)
├── ENS Registry (.eth domains)
├── Public Resolver
└── CCIP Read Gateway

L2 (Lisk Sepolia)
├── L2 ENS Registrar Contract
├── Subdomain Management
└── Profile Data Storage
```

## Key Components

### 1. L2 ENS Registrar Smart Contract

**Location**: `contracts/L2ENSRegistrar.sol`

**Features**:
- Subdomain registration with configurable fees
- Duration-based registration (30 days to 10 years)
- Ownership transfer and renewal
- CCIP Read support for cross-chain resolution
- Admin controls for fee management

**Key Functions**:
```solidity
function registerSubdomain(string subdomain, uint256 duration) external payable
function renewSubdomain(string subdomain, uint256 duration) external payable
function transferSubdomain(string subdomain, address newOwner) external
function getSubdomainInfo(string subdomain) external view returns (...)
function isSubdomainAvailable(string subdomain) external view returns (bool)
```

### 2. Enhanced ENS Service

**Location**: `src/services/ensService.ts`

**L2 Features**:
- Automatic L2/L1 fallback
- Registration fee calculation
- Gas estimation optimization
- CCIP Read integration
- Subdomain management (renew, transfer)

**Key Methods**:
```typescript
async createENSProfile(subdomain: string, profile: ENSProfile): Promise<string>
async getSubdomainRegistrationFee(subdomain: string): Promise<string>
async renewL2Subdomain(subdomain: string, duration: number): Promise<string>
async transferL2Subdomain(subdomain: string, newOwner: string): Promise<string>
```

### 3. Network Configuration

**Location**: `src/config/networks.ts`

**L2 Settings**:
```typescript
liskSepolia: {
  isL2: true,
  l2ENSRegistrar: process.env.NEXT_PUBLIC_LISK_ENS_REGISTRAR,
  ccipGateway: process.env.NEXT_PUBLIC_CCIP_GATEWAY,
  // ... other config
}
```

## Deployment Instructions

### 1. Deploy L2 ENS Registrar

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Deploy to Lisk Sepolia
npx hardhat run scripts/deploy-l2-ens.js --network liskSepolia
```

### 2. Update Environment Variables

```bash
# .env.local
NEXT_PUBLIC_LISK_ENS_REGISTRAR=0x... # Deployed contract address
NEXT_PUBLIC_CCIP_GATEWAY=https://ccip.ens.domains
NEXT_PUBLIC_ENS_PARENT_DOMAIN=nosen.eth
```

### 3. Update Network Configuration

The deployment script will output the contract address. Update `src/config/networks.ts`:

```typescript
liskSepolia: {
  // ... existing config
  l2ENSRegistrar: '0x...', // Your deployed contract address
}
```

## Usage Examples

### 1. Register a New Subdomain

```typescript
import { ensService } from '../services/ensService';

const profile = {
  ensName: 'alice.nosen.eth',
  displayName: 'Alice',
  bio: 'Web3 Developer',
  // ... other fields
};

try {
  const ipfsHash = await ensService.createENSProfile('alice', profile);
  console.log('Profile created:', ipfsHash);
} catch (error) {
  console.error('Failed to create profile:', error);
}
```

### 2. Check Subdomain Availability

```typescript
const isAvailable = await ensService.checkSubdomainAvailability('alice');
console.log('Available:', isAvailable);
```

### 3. Get Registration Fee

```typescript
const fee = await ensService.getSubdomainRegistrationFee('alice');
console.log('Registration fee:', fee, 'LSK');
```

### 4. Renew Subdomain

```typescript
const txHash = await ensService.renewL2Subdomain('alice', 365 * 24 * 60 * 60); // 1 year
console.log('Renewed:', txHash);
```

## CCIP Read Integration

### How It Works

1. **L2 Registration**: User registers subdomain on Lisk Sepolia
2. **CCIP Gateway**: L2 contract data is accessible via CCIP Read
3. **L1 Resolution**: ENS resolvers can query L2 data through CCIP
4. **Seamless Experience**: Users get L2 benefits with L1 compatibility

### Implementation Status

- ✅ L2 ENS Registrar contract with CCIP Read support
- ✅ CCIP Read data encoding/decoding
- 🔄 CCIP Gateway integration (requires ENS infrastructure)
- 🔄 Cross-chain resolver setup

## Gas Optimization

### L2 vs L1 Gas Costs

| Operation | L1 (Ethereum) | L2 (Lisk Sepolia) | Savings |
|-----------|----------------|-------------------|---------|
| Subdomain Creation | ~200,000 gas | ~50,000 gas | 75% |
| Set Resolver | ~100,000 gas | ~25,000 gas | 75% |
| Set Text Records | ~50,000 gas | ~10,000 gas | 80% |

### Estimated Costs

- **L1**: ~$50-100 per subdomain (depending on gas prices)
- **L2**: ~$0.50-2 per subdomain (much more affordable)

## Testing

### 1. Local Testing

```bash
# Run Hardhat tests
npx hardhat test

# Run specific test file
npx hardhat test test/L2ENSRegistrar.test.js
```

### 2. Testnet Testing

```bash
# Deploy to testnet
npx hardhat run scripts/deploy-l2-ens.js --network liskSepolia

# Test contract functions
npx hardhat console --network liskSepolia
```

### 3. Integration Testing

```bash
# Start development server
npm run dev

# Test profile creation flow
# Navigate to /create-profile and test subdomain registration
```

## Security Considerations

### 1. Access Control

- Only contract owner can modify fees and settings
- Users can only manage their own subdomains
- Reentrancy protection on payable functions

### 2. Input Validation

- Subdomain length limits (3-20 characters)
- Character validation (a-z, 0-9, hyphens only)
- Duration limits (30 days to 10 years)

### 3. Fee Management

- Configurable base fees
- Custom fees per subdomain
- Refund mechanism for excess payments

## Troubleshooting

### Common Issues

1. **Contract Not Deployed**
   - Check network configuration
   - Verify contract address in .env
   - Ensure sufficient LSK balance for deployment

2. **Subdomain Registration Fails**
   - Check subdomain availability
   - Verify sufficient LSK balance
   - Check gas limits and fees

3. **CCIP Read Not Working**
   - Verify CCIP Gateway configuration
   - Check contract CCIP Read support
   - Ensure proper data encoding

### Debug Commands

```typescript
// Check L2 status
console.log('L2 Enabled:', ensService.isL2Enabled());

// Check network
console.log('Current Network:', ensService.getCurrentNetwork());

// Test subdomain functions
const info = await ensService.getL2SubdomainInfo('test');
console.log('Subdomain Info:', info);
```

## Future Enhancements

### 1. Advanced Features

- [ ] Subdomain marketplace
- [ ] Bulk operations
- [ ] Advanced fee structures
- [ ] Integration with other L2s

### 2. CCIP Read Improvements

- [ ] Full ENS integration
- [ ] Cross-chain profile resolution
- [ ] Multi-chain subdomain support

### 3. User Experience

- [ ] Subdomain management dashboard
- [ ] Renewal reminders
- [ ] Transfer workflows
- [ ] Analytics and insights

## Support

For questions or issues with L2 ENS integration:

1. Check the troubleshooting section above
2. Review contract logs and events
3. Test with simple subdomains first
4. Verify network and contract configuration

## Resources

- [ENS Documentation](https://docs.ens.domains/)
- [CCIP Read Specification](https://eips.ethereum.org/EIPS/eip-3668)
- [Lisk Documentation](https://lisk.com/documentation/)
- [Hardhat Documentation](https://hardhat.org/docs/)
