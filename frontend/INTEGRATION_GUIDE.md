# 🚀 Nosen Platform Integration Guide

## Overview

The Nosen platform is now fully integrated with both **ENS subdomain management** and **decentralized professional verification**. This guide covers how to use all the integrated services.

## 🏗️ Architecture

```
Frontend (React/Next.js)
    ↓
ENS Service (L2ENSRegistrar) + Nosen Service (Main Contract)
    ↓
Lisk Sepolia L2 + Smart Contracts
    ↓
IPFS + The Graph (Indexing)
```

## 📋 Prerequisites

- **Wallet**: MetaMask or compatible Web3 wallet
- **Network**: Lisk Sepolia (Chain ID: 4202)
- **Tokens**: ETH for gas fees and platform fees
- **ENS Parent Domain**: `nosen.eth`

## 🔧 Contract Addresses

### Main Contracts
- **Nosen Platform**: `0xD15bb0dcA1397156c7940d243cb80379B6552E57`
- **L2ENSRegistrar**: `0xA6CAdB039c36480efe7C3CC7D5dD1Ced8b2A6950`

### Network Configuration
- **Lisk Sepolia**: L2 network for cost-effective operations
- **ENS Integration**: L2 subdomain management
- **Gas Optimization**: Reduced fees for L2 transactions

## 🎯 Core Features

### 1. ENS Identity Management
- **L2 Subdomain Registration**: Cost-effective ENS subdomains
- **Profile Management**: Professional web3 identity
- **CCIP Read Support**: Cross-chain profile resolution

### 2. Income Source Management
- **Add Income Sources**: Track professional earnings
- **Verification System**: Community-driven verification
- **Transaction Linking**: Connect blockchain transactions
- **Multi-Network Support**: ETH, USDC, USDT, DAI

### 3. Employer Verification
- **Company Profiles**: Professional employer database
- **Verification Process**: Community consensus
- **Network Support**: Multiple blockchain networks

### 4. Document Generation
- **Professional Documents**: Income verification, tax compliance
- **Blockchain Anchoring**: Immutable document records
- **Expiry Management**: Automatic expiration tracking

### 5. Reputation System
- **Verification Points**: Earn reputation by verifying others
- **Community Trust**: Build credibility in the network
- **Access Control**: Reputation-based verification permissions

## 🚀 Getting Started

### Step 1: Connect Wallet
```typescript
import { nosenService } from '../services/nosenService';

// Check wallet connection
const isConnected = await nosenService.isWalletConnected();
const account = await nosenService.getConnectedAccount();
```

### Step 2: Switch to Lisk Sepolia
```typescript
import { ensService } from '../services/ensService';

// Switch to L2 network
await ensService.switchNetwork(4202); // Lisk Sepolia
```

### Step 3: Create ENS Profile
```typescript
// Check subdomain availability
const availability = await ensService.checkSubdomainAvailability('yourname');
if (availability.available) {
    // Create ENS profile
    const result = await ensService.createENSProfile('yourname', {
        name: 'John Doe',
        role: 'Developer Relations',
        company: 'Phala Network',
        bio: 'Professional bio...',
        // ... other profile data
    });
}
```

### Step 4: Add Income Source
```typescript
// Add income source to Nosen platform
const result = await nosenService.addIncomeSource(
    'Phala Network DevRel',
    'Developer Relations',
    '0.5', // 0.5 ETH monthly
    'ETH',
    'Lisk Sepolia',
    'phala.nosen.eth', // ENS domain
    true, // recurring
    'monthly',
    'Qm...' // IPFS CID
);
```

## 📱 Service Integration

### ENS Service (`ensService.ts`)
```typescript
// Key Functions
await ensService.checkSubdomainAvailability(subdomain);
await ensService.createENSProfile(subdomain, profileData);
await ensService.resolveENSProfile(subdomain);
await ensService.renewL2Subdomain(subdomain, duration);
await ensService.transferL2Subdomain(subdomain, to);
```

### Nosen Service (`nosenService.ts`)
```typescript
// Income Sources
await nosenService.addIncomeSource(name, role, amount, token, network, ensDomain, isRecurring, frequency, ipfsCid);
await nosenService.verifyIncomeSource(sourceId);
await nosenService.linkTransactionToSource(sourceId, transactionHash);

// Employers
await nosenService.addEmployer(name, type, contactPerson, email, phone, website, ensDomain, ipfsCid, networks, tokens);
await nosenService.verifyEmployer(employerId);

// Documents
await nosenService.generateDocument(title, type, purpose, ipfsCid, validUntil, amount, currency, period, networks, sourceIds, proofs);
await nosenService.verifyDocument(documentId);

// Reputation
const reputation = await nosenService.getUserReputation(user);
const canVerify = await nosenService.canUserVerify(user);
```

## 💰 Fee Structure

### Platform Fees
- **Income Source Registration**: 0.0005 ETH
- **Employer Verification**: 0.002 ETH
- **Document Generation**: 0.0003 ETH

### Gas Costs (L2)
- **Subdomain Registration**: ~50,000 gas
- **Profile Updates**: ~25,000 gas
- **Verifications**: ~30,000 gas

## 🔐 Security Features

### Access Control
- **Ownership Verification**: Only owners can modify their data
- **Reputation Requirements**: Minimum reputation for verification
- **Verification Thresholds**: Community consensus (3 verifications)

### Data Integrity
- **IPFS Storage**: Decentralized content storage
- **Blockchain Anchoring**: Immutable verification records
- **Event Logging**: Transparent audit trail

## 📊 Dashboard Integration

### Income Streams Page
- **Income Source Management**: Add, edit, verify sources
- **Employer Database**: Company verification system
- **Reputation Display**: User verification statistics
- **Transaction Linking**: Connect blockchain transactions

### Documents Page
- **Document Generation**: Professional document creation
- **Verification Status**: Community verification progress
- **Expiry Management**: Automatic expiration tracking

### Reports Page
- **Income Analytics**: Monthly/yearly income tracking
- **Verification History**: Complete verification records
- **Network Statistics**: Multi-chain income overview

## 🔄 Workflow Examples

### Complete Profile Setup
1. **Connect Wallet** → Lisk Sepolia network
2. **Create ENS Profile** → `yourname.nosen.eth`
3. **Add Income Source** → Professional earnings tracking
4. **Link Transactions** → Connect blockchain data
5. **Generate Documents** → Professional verification docs

### Income Verification Process
1. **User Adds Income Source** → Pays registration fee
2. **Community Verification** → 3+ users verify (reputation-based)
3. **Verification Complete** → Source marked as verified
4. **Document Generation** → Professional verification documents
5. **Reputation Rewards** → Verifiers earn reputation points

### Employer Verification
1. **Add Employer Profile** → Company information
2. **Community Verification** → Professional network verification
3. **Verification Complete** → Employer marked as verified
4. **Network Building** → Connect verified professionals

## 🛠️ Development

### Adding New Features
1. **Contract Functions**: Add to `NOSEN_PLATFORM_ABI`
2. **Service Methods**: Implement in `NosenService` class
3. **Type Definitions**: Update interfaces
4. **Frontend Integration**: Add to dashboard pages
5. **Testing**: Verify on Lisk Sepolia testnet

### Error Handling
```typescript
try {
    const result = await nosenService.addIncomeSource(...);
    if (result.success) {
        // Handle success
    } else {
        // Handle error
        console.error('Error:', result.error);
    }
} catch (error) {
    // Handle exception
    console.error('Exception:', error);
}
```

### Event Listening
```typescript
// Listen for contract events
contract.on('IncomeSourceAdded', (user, sourceId, name, network) => {
    console.log('New income source added:', { user, sourceId, name, network });
    // Update UI
});
```

## 🧪 Testing

### Testnet Deployment
- **Network**: Lisk Sepolia (Chain ID: 4202)
- **Contracts**: Deployed and verified
- **ENS**: L2 subdomain management active
- **Fees**: Testnet ETH for testing

### Test Scenarios
1. **Wallet Connection**: MetaMask integration
2. **Network Switching**: L2 network detection
3. **ENS Registration**: Subdomain creation
4. **Income Source**: Add and verify sources
5. **Employer Verification**: Company verification process
6. **Document Generation**: Professional document creation

## 🚀 Deployment

### Production Checklist
- [ ] **Contracts Verified**: All contracts verified on Lisk Sepolia
- [ ] **ENS Integration**: L2ENSRegistrar fully functional
- [ ] **Frontend Services**: All services integrated
- [ ] **Error Handling**: Comprehensive error management
- [ ] **User Testing**: End-to-end workflow testing
- [ ] **Documentation**: User guides and API docs

### Environment Variables
```bash
# Contract Addresses
NEXT_PUBLIC_NOSEN_CONTRACT=0xD15bb0dcA1397156c7940d243cb80379B6552E57
NEXT_PUBLIC_L2_ENS_REGISTRAR=0xA6CAdB039c36480efe7C3CC7D5dD1Ced8b2A6950

# ENS Configuration
NEXT_PUBLIC_ENS_PARENT_DOMAIN=nosen.eth
NEXT_PUBLIC_ENS_USE_L2=true

# Network Configuration
NEXT_PUBLIC_LISK_SEPOLIA_RPC=https://rpc.sepolia.lisk.com
NEXT_PUBLIC_LISK_SEPOLIA_CHAIN_ID=4202
```

## 📚 Additional Resources

### Documentation
- **ENS Documentation**: https://docs.ens.domains/
- **Lisk Documentation**: https://lisk.com/documentation/
- **OpenZeppelin**: https://docs.openzeppelin.com/

### Support
- **Technical Issues**: GitHub Issues
- **Feature Requests**: Community discussions
- **Documentation**: Integration guide updates

## 🎉 Success Metrics

### Platform Adoption
- **ENS Profiles**: Number of active subdomains
- **Income Sources**: Verified income streams
- **Employers**: Verified company profiles
- **Documents**: Generated verification documents

### User Engagement
- **Verification Activity**: Community participation
- **Reputation Building**: User engagement metrics
- **Document Usage**: Professional document generation
- **Network Growth**: Professional network expansion

---

**Ready to build the future of professional verification on the blockchain! 🚀**
