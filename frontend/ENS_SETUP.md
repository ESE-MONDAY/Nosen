# ENS Setup Guide

This guide explains how to set up and configure the ENS (Ethereum Name Service) functionality in your Nosen application.

## Overview

The ENS implementation allows users to create unique subdomains (e.g., `username.nosen.eth`) that serve as their professional identity on the platform. Each profile is stored on IPFS and linked to the ENS record.

## Features

✅ **Real ENS Subdomain Creation** - Creates actual ENS records on the blockchain  
✅ **IPFS Metadata Storage** - Profile data stored securely on IPFS  
✅ **Availability Checking** - Real-time subdomain availability verification  
✅ **Gas Estimation** - Shows estimated gas costs before creation  
✅ **Network Switching** - Automatically switches to correct blockchain network  
✅ **Multi-Network Support** - Works with Lisk Sepolia, Ethereum Sepolia, and Mainnet  
✅ **Browser Compatible** - No Node.js dependencies, works in all browsers  

## Configuration

### 1. Environment Variables

Create a `.env.local` file in your `frontend` directory:

```bash
# Network Configuration
NEXT_PUBLIC_NETWORK=sepolia  # or 'liskSepolia', 'mainnet'

# ENS Configuration
NEXT_PUBLIC_ENS_PARENT_DOMAIN=nosen.eth

# IPFS Configuration (optional)
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

### 2. Network Selection

- **`sepolia`** - Ethereum Sepolia testnet (recommended for testing)
- **`liskSepolia`** - Lisk Sepolia testnet (requires ENS contracts deployment)
- **`mainnet`** - Ethereum mainnet (production use)

### 3. ENS Contract Addresses

The system automatically uses the correct contract addresses for each network. For Lisk Sepolia, you'll need to deploy ENS contracts or update the addresses in `src/config/networks.ts`.

## How It Works

### 1. Subdomain Creation Flow

```
User Input → Availability Check → Gas Estimation → Profile Creation
    ↓              ↓                ↓              ↓
Subdomain    ENS Registry    Gas Calculation   Blockchain TX
Validation   Query          User Approval     IPFS Preparation
```

### 2. Technical Implementation

1. **Availability Check**: Queries ENS registry to verify subdomain availability
2. **Gas Estimation**: Estimates gas costs for the entire transaction
3. **Profile Creation**: 
   - Prepares profile metadata for IPFS storage
   - Creates ENS subdomain record
   - Sets resolver contract
   - Updates content hash with IPFS reference
   - Sets text records (name, bio, etc.)

### 3. Smart Contract Interactions

- **ENS Registry**: Creates subdomain ownership
- **Public Resolver**: Sets profile metadata and text records
- **Gas Management**: Configurable gas limits for each operation

## IPFS Integration

### Current Implementation

The current implementation uses a **simplified IPFS approach** that's fully browser-compatible:

- **Mock IPFS Hash Generation**: Creates realistic-looking IPFS CIDs for development
- **HTTP Gateway Support**: Can fetch data from IPFS gateways
- **No Node.js Dependencies**: Works in all browsers without server-side requirements

### Production IPFS Options

For production, you can integrate with real IPFS services:

1. **Pinata API** - Professional IPFS pinning service
2. **Infura IPFS** - Enterprise IPFS infrastructure
3. **Web3.Storage** - Free IPFS storage for Web3 projects
4. **Your Own IPFS Node** - Full control over data storage

### Upgrading to Real IPFS

To upgrade from mock IPFS to real IPFS:

1. Replace the `generateMockIPFSHash` method in `ensService.ts`
2. Integrate with your chosen IPFS service
3. Update the `uploadToIPFS` method to use real uploads
4. Test thoroughly on testnets before mainnet

## Testing

### 1. Test Networks

For testing, use Ethereum Sepolia testnet:
- Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- Network ID: 11155111
- RPC: https://rpc.sepolia.org

### 2. Test ENS Creation

1. Connect wallet to Sepolia testnet
2. Navigate to `/create-profile`
3. Enter a test subdomain (e.g., `test123`)
4. Check availability and gas estimate
5. Create profile with test data

## Production Considerations

### 1. Security

- **Contract Verification**: Ensure ENS contracts are verified on block explorer
- **Access Control**: Implement proper access control for subdomain creation
- **Rate Limiting**: Prevent spam subdomain creation

### 2. Gas Optimization

- **Batch Operations**: Consider batching multiple ENS operations
- **Gas Estimation**: Always estimate gas before transactions
- **Network Congestion**: Monitor network conditions for optimal gas prices

### 3. IPFS Reliability

- **Multiple Gateways**: Use multiple IPFS gateways for redundancy
- **Pinning Services**: Consider using IPFS pinning services for important data
- **Backup Strategy**: Implement backup strategies for profile data

## Troubleshooting

### Common Issues

1. **"Provider not initialized"**
   - Ensure MetaMask is installed and connected
   - Check if wallet is on correct network

2. **"Subdomain already taken"**
   - Try a different subdomain name
   - Check ENS registry directly

3. **"Failed to estimate gas"**
   - Ensure wallet has sufficient balance
   - Check network connectivity
   - Verify contract addresses

4. **"IPFS preparation failed"**
   - Check browser console for errors
   - Verify network connectivity
   - Check data format

### Debug Mode

Enable debug logging by checking browser console for detailed transaction information and error messages.

## Future Enhancements

- **Real IPFS Integration**: Upgrade from mock to real IPFS storage
- **Bulk Operations**: Create multiple subdomains in one transaction
- **Profile Updates**: Allow users to update existing profiles
- **Social Integration**: Link social media accounts to ENS records
- **Verification System**: Implement profile verification badges
- **Marketplace**: Allow subdomain trading and auctions

## Support

For technical support or questions about the ENS implementation, check the console logs and refer to the ENS documentation at [ens.domains](https://ens.domains/).
