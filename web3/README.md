# Crowdfunding Smart Contract System

A decentralized crowdfunding platform that allows users to create and manage fundraising campaigns with multiple reward tiers. Built with gas optimization in mind using OpenZeppelin's Clones library.

## Overview

This system uses the minimal proxy pattern (EIP-1167) through OpenZeppelin's Clones library to significantly reduce gas costs when deploying new campaigns. Instead of deploying the entire contract code for each new campaign, it deploys a minimal proxy that delegates all calls to an implementation contract.

## Gas Optimization

### Minimal Proxy Pattern

- Uses only ~45 bytes of bytecode per deployment compared to full contract deployment
- Each new campaign costs approximately 10x less gas to deploy
- All campaigns share the same implementation logic while maintaining separate storage
- Enables cheap deployment of unlimited campaign instances

## Smart Contracts

The system consists of two main contracts:

1. `Crowdfunding.sol`: The implementation contract for individual campaigns
2. `CrowdfundingFactory.sol`: Factory contract that deploys campaign clones using minimal proxy pattern

## Features

- **Optimized Deployment**: Uses minimal proxy pattern for gas-efficient campaign creation
- **Multiple Reward Tiers**: Set up different funding levels with unique rewards
- **Campaign Management**: Tools for campaign owners
- **Automatic Refunds**: Built-in refund mechanism for failed campaigns
- **Flexible Control**: Pause/unpause functionality and deadline extensions

## Technical Details

### Prerequisites

- Solidity ^0.8.17
- OpenZeppelin Contracts (for Clones library)
- thirdweb deployment tools

## Deployment Using thirdweb

1. Install thirdweb CLI:

```bash
npm install -g @thirdweb-dev/cli
```

2. Initialize your project:

```bash
npx thirdweb create contract
```

3. Deploy using thirdweb:

```bash
npx thirdweb deploy
```

### Smart Contract Architecture

#### Factory Contract Flow

```
1. Deploy implementation contract (Crowdfunding.sol)
2. Deploy factory with implementation address
3. Factory creates clones using Clones.clone()
4. Each clone is initialized with unique campaign parameters
```

## Core Functions

### Factory Contract

```solidity
// Creates a new campaign using minimal proxy pattern
function createCampaign(
    string memory _name,
    string memory _description,
    uint256 _goal,
    uint256 _durationInDays
)

// Get all campaigns by a specific user
function getUserCampaigns(address _user)

// Get all created campaigns
function getAllCampaigns()
```

### Campaign Contract

```solidity
// Initialize clone with campaign details
function initialize(
    address _owner,
    string memory _name,
    string memory _description,
    uint256 _goal,
    uint256 _durationInDays
)

// Contribute to a specific tier
function fund(uint256 _tierIndex)

// Manage campaign tiers
function addTier(string memory _name, uint256 _amount)
function removeTier(uint256 _index)
```

## Campaign States

1. `Active`: Accepting contributions
2. `Successful`: Reached goal
3. `Failed`: Ended without reaching goal

## Usage with thirdweb

### Deploying the System

1. Deploy through thirdweb dashboard
2. Connect your wallet
3. Deploy implementation contract
4. Deploy factory contract with implementation address

### Creating a Campaign

```javascript
// Using thirdweb SDK
const contract = await sdk.getContract("CONTRACT_ADDRESS");

await contract.call("createCampaign", [
  "Campaign Name",
  "Campaign Description",
  1000, // Goal amount
  30, // Duration in days
]);
```

### Contributing to a Campaign

```javascript
await contract.call("fund", [tierIndex], {
  value: tierAmount,
});
```

## Security Features

- Protected initialization
- Owner-only access control
- Pausable functionality
- State-based guards
- Safe math operations (Solidity ^0.8.17)

## Development

### Build and Deploy

```bash
# Build contracts
npx thirdweb build

# Deploy to your chosen network
npx thirdweb deploy
```

### Testing

```bash
npx hardhat test
```

## License

This project is licensed under the MIT License.

## Security

For security concerns, please open an issue or contact the repository maintainers.
