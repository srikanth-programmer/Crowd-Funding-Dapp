// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Crowdfunding} from "./CrowdFunding.sol";
import "./Clones.sol";

contract CrowdfundingFactory {
    address public owner;
    address public crowdfundingImplementation;
    bool public paused;

    struct Campaign {
        address campaignAddress;
        address owner;
        string name;
        uint256 creationTime;
    }

    Campaign[] public campaigns;
    mapping(address => Campaign[]) public userCampaigns;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner.");
        _;
    }

    modifier notPaused() {
        require(!paused, "Factory is paused");
        _;
    }

    constructor(address _crowdfundingImplementation) {
        owner = msg.sender;
        crowdfundingImplementation = _crowdfundingImplementation;
    }

    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays
    ) external notPaused {
        // Use OpenZeppelin Clones library to deploy a new clone
        address clone = Clones.clone(crowdfundingImplementation);

        // Initialize the clone
        Crowdfunding(clone).initialize(
            msg.sender,
            _name,
            _description,
            _goal,
            _durationInDays
        );

        Campaign memory campaign = Campaign({
            campaignAddress: clone,
            owner: msg.sender,
            name: _name,
            creationTime: block.timestamp
        });

        campaigns.push(campaign);
        userCampaigns[msg.sender].push(campaign);
    }

    function getUserCampaigns(
        address _user
    ) external view returns (Campaign[] memory) {
        return userCampaigns[_user];
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    function togglePause() external onlyOwner {
        paused = !paused;
    }

    // Update the logic contract for future clones
    function updateImplementation(
        address newImplementation
    ) external onlyOwner {
        crowdfundingImplementation = newImplementation;
    }
}
