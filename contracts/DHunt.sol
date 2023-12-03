// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./proof-of-identity/interfaces/IProofOfIdentity.sol";

contract DHunt is AccessControl {
    // STATE VARIABLES
    //===============================================
    /*

    */
    IProofOfIdentity private _proofOfIdentity;

    uint256 private _competencyRatingThreshold;

    struct Bounty {
        string name;
        string description;
        uint256 reward;
        address creator;
        bool isCompleted;
        address acceptedDeveloper;
        uint256[] solutionIds;
        bool requiresAcceptance;
    }

    Bounty[] public bounties;

    struct Solution {
        uint256 bountyId;
        string solution;
        address developer;
        bool isApproved;
    }

    Solution[] public solutions;

    mapping(address => uint256) public developerScores;
    mapping(uint256 => mapping(uint256 => uint256)) public solutionVotes;

    // EVENTS
    event BountyCreated(
        uint256 indexed bountyId,
        string name,
        string description,
        uint256 reward,
        address indexed creator
    );

    event SolutionSubmitted(
        uint256 indexed bountyId,
        uint256 indexed solutionid,
        string solution,
        address indexed developer
    );

    event SolutionApproved(
        uint256 indexed bountyId,
        uint256 indexed solutionId,
        address indexed developer
    );

    /**
     * @notice Emits the new Proof of Identity contract address.
     * @param poiAddress The new Proof of Identity contract address.
     */
    event POIAddressUpdated(address indexed poiAddress);

    // ERRORS
    error DHunt__ZeroAddress();

    /**
     * @notice Error to throw when an account does not have a Proof of Identity
     * NFT.
     */
    error DHunt__NoIdentityNFT();

    /**
     * @notice Error to throw when an account is suspended.
     */
    error DHunt__Suspended();

    error DHunt__CompetencyRating(uint256 rating, uint256 threshold);

    error DHunt__AttributeExpired(string attribute, uint256 expiry);

    // MORDIFIERS
    modifier onlyBountyCreator(uint256 bountyId) {
        require(
            bounties[bountyId].creator == msg.sender,
            "Only the bounty creator can call this funtion"
        );
        _;
    }

    modifier onlyPermissioned(address account) {
        if (!_hasID(account)) revert DHunt__NoIdentityNFT();

        if (!_isSuspended(account)) revert DHunt__Suspended();

        // _checkUserTypeExn(account);
        _checkCompetencyRatingExn(account);
        _;
    }

    // CONTRUCTOR
    constructor(address proofOfIdentity_, uint256 competencyRatingThreshold_) {
        _setPOIAddress(proofOfIdentity_);
        setCompetencyRatingThreshold(competencyRatingThreshold_);
    }

    // FUNCTIONS
    function createBounty(
        string memory name,
        string memory description,
        uint256 reward,
        bool requiresAcceptance
    ) external payable {
        // Check that the msg.value sent equals the reward.
        require(msg.value == reward, "Sent value must equal the reward");
        Bounty memory newBounty = Bounty({
            name: name,
            description: description,
            reward: reward,
            isCompleted: false,
            creator: msg.sender,
            acceptedDeveloper: address(0),
            solutionIds: new uint256[](0),
            requiresAcceptance: requiresAcceptance
        });
        bounties.push(newBounty);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        uint newBountyId = bounties.length - 1;
        emit BountyCreated(newBountyId, name, description, reward, msg.sender);
    }

    function acceptBounty(
        uint256 bountyId
    ) external onlyPermissioned(msg.sender) {
        // check that the bounty exist
        require(bountyId < bounties.length, "Bounty does not exist");

        // check that the bounty requires acceptance
        require(
            bounties[bountyId].requiresAcceptance,
            "Bounty does not require acceptance"
        );

        // Check that the bounty has not been accepted yet
        require(!bounties[bountyId].isCompleted, "Bounty is already completed");

        // Check that the bounty has not been accepted by another developer
        require(
            bounties[bountyId].acceptedDeveloper == address(0),
            "Bounty is already accepted by another developer"
        );

        bounties[bountyId].acceptedDeveloper = msg.sender;
    }

    function submitSolution(
        uint256 bountyId,
        string memory solution
    ) public onlyPermissioned(msg.sender) {
        // check that the bounty already exist
        require(bountyId < bounties.length, "bounty does not exist");

        // Check that the bounty is not completed
        require(!bounties[bountyId].isCompleted, "Bounty is already completed");

        // if the bounty requires acceptance, check that the msg.sender is the accepted developer
        if (bounties[bountyId].requiresAcceptance) {
            require(
                bounties[bountyId].acceptedDeveloper == msg.sender,
                "Only accepted developer can submit a solution"
            );
        }

        require(bytes(solution).length > 0, "Solution cannot be empty");

        // Create a solution a struct
        Solution memory newSolution = Solution({
            bountyId: bountyId,
            solution: solution,
            developer: msg.sender,
            isApproved: false
        });

        // Add the new solution to the solutions array
        solutions.push(newSolution);

        // Get the id of the new solution
        uint256 newSolutionId = solutions.length - 1;

        // Add the new solution ID to the solutionIds array of the bounty
        bounties[bountyId].solutionIds.push(newSolutionId);
        emit SolutionSubmitted(bountyId, newSolutionId, solution, msg.sender);
    }

    function approveSolution(
        uint256 bountyId,
        uint256 solutionId
    ) public onlyBountyCreator(bountyId) {
        // Check that the bounty exists
        require(bountyId < bounties.length, "Bounty does not exist");

        // check that solution exists
        require(solutionId < solutions.length, "Solution does not exist");

        // check that the solution is for the bounty
        require(
            solutions[solutionId].bountyId == bountyId,
            "Solution is not for this bounty"
        );

        // Check that the solution is not completed
        require(!bounties[bountyId].isCompleted, "Bounty is already completed");

        // Check that the solution is not already approved.
        require(
            !solutions[solutionId].isApproved,
            "Solution is already approved"
        );

        // Mark the solution as approved
        solutions[solutionId].isApproved = true;

        // Mark the bounty as completed
        bounties[bountyId].isCompleted = true;

        address developer = solutions[solutionId].developer;

        // Transfer the bounty reward to the developer
        payable(developer).transfer(bounties[bountyId].reward);
        // Increment the developer score
        developerScores[developer]++;
        emit SolutionApproved(bountyId, solutionId, developer);
    }

    function voteForSolution(
        uint256 bountyId,
        uint256 solutionId
    ) public onlyPermissioned(msg.sender) {
        // Check that county and solution exist
        require(bountyId < bounties.length, "Bounty does not exist");
        require(solutionId < solutions.length, "Solution does not exist");
        // increase the vote count of the solution
        solutionVotes[bountyId][solutionId]++;
    }

    function getBounty(
        uint256 bountyId
    )
        public
        view
        returns (string memory name, string memory description, uint256 amount)
    {
        // ...
    }

    function getBounties() public view returns (uint256[] memory bountyIds) {
        // ...
    }

    function getSolution(
        uint256 solutionId
    ) public view returns (string memory solution, address developer) {
        // ...
    }

    function getSolutions(
        uint256 bountyId
    ) public view returns (uint256[] memory solutionIds) {
        // ...
    }

    /**
     * @notice Sets the Proof of Identity contract address.
     * @param poi The address for the Proof of Identity contract.
     * @dev May revert with:
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     * May revert with `DHunt__ZeroAddress`.
     * May emit a `POIAddressUpdated` event.
     */
    function _setPOIAddress(address poi) private {
        if (poi == address(0)) revert DHunt__ZeroAddress();
        _proofOfIdentity = IProofOfIdentity(poi);
        emit POIAddressUpdated(poi);
    }

    function setCompetencyRatingThreshold(
        uint256 threshold
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _competencyRatingThreshold = threshold;
        emit CompetencyRatingThresholdUpdated(threshold);
    }

    /**
     * @notice Validates that a given `expiry` is greater than the current
     * `block.timestamp`.
     *
     * @param expiry The expiry to check.
     *
     * @return True if the expiry is greater than the current timestamp, false
     * otherwise.
     */
    function _validateExpiry(uint256 expiry) private view returns (bool) {
        return expiry > block.timestamp;
    }

    /**
     * @notice Returns whether an account holds a Proof of Identity NFT.
     * @param account The account to check.
     * @return True if the account holds a Proof of Identity NFT, else false.
     */
    function _hasID(address account) private view returns (bool) {
        return _proofOfIdentity.balanceOf(account) > 0;
    }

    /**
     * @notice Returns whether an account is suspended.
     * @param account The account to check.
     * @return True if the account is suspended, false otherwise.
     */
    function _isSuspended(address account) private view returns (bool) {
        return _proofOfIdentity.isSuspended(account);
    }

    function _checkCompetencyRatingExn(address account) private view {
        (uint256 rating, uint256 expiry, ) = _proofOfIdentity
            .getCompetencyRating(account);

        if (rating < _competencyRatingThreshold) {
            revert DHunt__CompetencyRating(rating, _competencyRatingThreshold);
        }

        if (!_validateExpiry(expiry)) {
            revert DHunt__AttributeExpired("competencyRating", expiry);
        }
    }
}
