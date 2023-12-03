# DHunt

DHunt is a decentralized application built on Ethereum that allows developers to earn rewards by solving bounties. It's a platform where users can create bounties for specific tasks, and developers can submit solutions for these tasks. The contract also includes a voting system for solutions and a competency rating system for developers.

## Features

- **Bounty Creation**: Users can create a bounty specifying the task details and the reward.
- **Solution Submission**: Developers can submit their solutions for a specific bounty.
- **Bounty Acceptance**: For bounties that require acceptance, developers can request to accept a bounty.
- **Solution Approval**: Bounty creators can approve a solution, marking the bounty as completed and transferring the reward to the developer.
- **Voting System**: Users can vote for a solution, which can be used to gauge the community's opinion on the solution.
- **Competency Rating**: Each developer has a competency rating, which can be used to assess the developer's skill level.

## Installation

To install the necessary dependencies, run the following command:

```bash
yarn install
```

## Usage

To interact with the contract, you need to have [Metamask](https://metamask.io/) installed and set up.

Here are the main functions of the contract:

- `createBounty(name, description, reward, requiresAcceptance)`: Creates a new bounty.
- `acceptBounty(bountyId)`: Accepts a bounty that requires acceptance.
- `submitSolution(bountyId, solution)`: Submits a solution for a bounty.
- `approveSolution(bountyId, solutionId)`: Approves a solution for a bounty.
- `voteForSolution(bountyId, solutionId)`: Votes for a solution.
- `getBounty(bountyId)`: Returns the details of a bounty.
- `getBounties()`: Returns the IDs of all bounties.
- `getSolution(solutionId)`: Returns the details of a solution.
- `getSolutions(bountyId)`: Returns the IDs of all solutions for a bounty.

## Testing

To run the tests, use the following command:
```bash
yarn run test
```