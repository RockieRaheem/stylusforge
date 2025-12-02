// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProjectFunding
 * @dev Crowdfunding contract for StylusForge marketplace projects
 */
contract ProjectFunding {
    struct Project {
        address payable creator;
        uint256 fundingGoal;
        uint256 totalFunded;
        uint256 deadline;
        bool completed;
        bool fundsWithdrawn;
        mapping(address => uint256) contributions;
        address[] backers;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;
    uint256 public platformFee = 5; // 5% platform fee
    address payable public platformWallet;

    event ProjectCreated(
        uint256 indexed projectId,
        address indexed creator,
        uint256 fundingGoal,
        uint256 deadline
    );

    event ContributionMade(
        uint256 indexed projectId,
        address indexed backer,
        uint256 amount
    );

    event FundsWithdrawn(
        uint256 indexed projectId,
        address indexed creator,
        uint256 amount
    );

    event RefundIssued(
        uint256 indexed projectId,
        address indexed backer,
        uint256 amount
    );

    modifier onlyCreator(uint256 _projectId) {
        require(
            msg.sender == projects[_projectId].creator,
            "Only creator can call this"
        );
        _;
    }

    modifier projectExists(uint256 _projectId) {
        require(_projectId < projectCount, "Project does not exist");
        _;
    }

    constructor(address payable _platformWallet) {
        platformWallet = _platformWallet;
    }

    /**
     * @dev Create a new project funding campaign
     */
    function createProject(
        uint256 _fundingGoal,
        uint256 _durationDays
    ) external returns (uint256) {
        require(_fundingGoal > 0, "Funding goal must be positive");
        require(_durationDays > 0 && _durationDays <= 90, "Invalid duration");

        uint256 projectId = projectCount++;
        Project storage project = projects[projectId];
        
        project.creator = payable(msg.sender);
        project.fundingGoal = _fundingGoal;
        project.totalFunded = 0;
        project.deadline = block.timestamp + (_durationDays * 1 days);
        project.completed = false;
        project.fundsWithdrawn = false;

        emit ProjectCreated(
            projectId,
            msg.sender,
            _fundingGoal,
            project.deadline
        );

        return projectId;
    }

    /**
     * @dev Contribute funds to a project
     */
    function contribute(uint256 _projectId)
        external
        payable
        projectExists(_projectId)
    {
        Project storage project = projects[_projectId];
        
        require(block.timestamp < project.deadline, "Funding period ended");
        require(msg.value > 0, "Contribution must be positive");
        require(!project.completed, "Project already completed");

        if (project.contributions[msg.sender] == 0) {
            project.backers.push(msg.sender);
        }

        project.contributions[msg.sender] += msg.value;
        project.totalFunded += msg.value;

        emit ContributionMade(_projectId, msg.sender, msg.value);
    }

    /**
     * @dev Withdraw funds if goal is reached
     */
    function withdrawFunds(uint256 _projectId)
        external
        projectExists(_projectId)
        onlyCreator(_projectId)
    {
        Project storage project = projects[_projectId];
        
        require(
            project.totalFunded >= project.fundingGoal,
            "Funding goal not reached"
        );
        require(!project.fundsWithdrawn, "Funds already withdrawn");
        require(block.timestamp < project.deadline, "Funding period ended");

        project.fundsWithdrawn = true;
        project.completed = true;

        uint256 platformAmount = (project.totalFunded * platformFee) / 100;
        uint256 creatorAmount = project.totalFunded - platformAmount;

        platformWallet.transfer(platformAmount);
        project.creator.transfer(creatorAmount);

        emit FundsWithdrawn(_projectId, project.creator, creatorAmount);
    }

    /**
     * @dev Claim refund if goal not reached by deadline
     */
    function claimRefund(uint256 _projectId)
        external
        projectExists(_projectId)
    {
        Project storage project = projects[_projectId];
        
        require(block.timestamp >= project.deadline, "Funding period not ended");
        require(
            project.totalFunded < project.fundingGoal,
            "Funding goal was reached"
        );
        require(!project.completed, "Project already completed");

        uint256 contribution = project.contributions[msg.sender];
        require(contribution > 0, "No contribution to refund");

        project.contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contribution);

        emit RefundIssued(_projectId, msg.sender, contribution);
    }

    /**
     * @dev Get project details
     */
    function getProject(uint256 _projectId)
        external
        view
        projectExists(_projectId)
        returns (
            address creator,
            uint256 fundingGoal,
            uint256 totalFunded,
            uint256 deadline,
            bool completed,
            bool fundsWithdrawn,
            uint256 backersCount
        )
    {
        Project storage project = projects[_projectId];
        return (
            project.creator,
            project.fundingGoal,
            project.totalFunded,
            project.deadline,
            project.completed,
            project.fundsWithdrawn,
            project.backers.length
        );
    }

    /**
     * @dev Get contribution amount for an address
     */
    function getContribution(uint256 _projectId, address _backer)
        external
        view
        projectExists(_projectId)
        returns (uint256)
    {
        return projects[_projectId].contributions[_backer];
    }

    /**
     * @dev Get all backers for a project
     */
    function getBackers(uint256 _projectId)
        external
        view
        projectExists(_projectId)
        returns (address[] memory)
    {
        return projects[_projectId].backers;
    }

    /**
     * @dev Update platform fee (only platform wallet)
     */
    function updatePlatformFee(uint256 _newFee) external {
        require(msg.sender == platformWallet, "Only platform can update fee");
        require(_newFee <= 10, "Fee too high");
        platformFee = _newFee;
    }

    /**
     * @dev Update platform wallet (only current platform wallet)
     */
    function updatePlatformWallet(address payable _newWallet) external {
        require(msg.sender == platformWallet, "Only platform can update wallet");
        require(_newWallet != address(0), "Invalid address");
        platformWallet = _newWallet;
    }
}
