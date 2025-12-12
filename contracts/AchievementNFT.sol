// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title AchievementNFT
 * @dev NFT contract for Stylus Studio achievement badges
 * Each badge is a unique, soul-bound NFT representing tutorial completion
 */
contract AchievementNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;
    
    // Badge ID => Badge metadata
    mapping(string => BadgeMetadata) public badges;
    
    // User address => Badge ID => Token ID (0 if not earned)
    mapping(address => mapping(string => uint256)) public userBadges;
    
    // Token ID => Badge ID
    mapping(uint256 => string) public tokenBadge;
    
    // Authorized minters (backend services)
    mapping(address => bool) public authorizedMinters;

    struct BadgeMetadata {
        string name;
        string description;
        string category;
        uint256 level; // 1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert
        string color;
        bool exists;
    }

    event BadgeMinted(
        address indexed recipient,
        string badgeId,
        uint256 tokenId,
        uint256 timestamp
    );

    event BadgeRegistered(
        string badgeId,
        string name,
        uint256 level
    );

    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);

    constructor() ERC721("Stylus Studio Achievement", "STYLUS-BADGE") Ownable(msg.sender) {
        // Pre-register all badge types
        _registerBadge("stylus_beginner", "Stylus Beginner", "Completed Getting Started tutorial", "Beginner", 1, "#58a6ff");
        _registerBadge("storage_master", "Storage Master", "Mastered storage and state management", "Intermediate", 2, "#3fb950");
        _registerBadge("function_expert", "Function Expert", "Mastered contract functions and methods", "Intermediate", 2, "#a371f7");
        _registerBadge("event_master", "Event Master", "Mastered event emission and logging", "Intermediate", 2, "#f85149");
        _registerBadge("error_handler", "Error Handler", "Mastered error handling patterns", "Intermediate", 2, "#f85149");
        _registerBadge("test_master", "Test Master", "Mastered smart contract testing", "Advanced", 3, "#58a6ff");
        _registerBadge("gas_optimizer", "Gas Optimizer", "Mastered gas optimization techniques", "Advanced", 3, "#3fb950");
        _registerBadge("pattern_architect", "Pattern Architect", "Mastered advanced design patterns", "Advanced", 3, "#a371f7");
        _registerBadge("defi_builder", "DeFi Builder", "Built a complete DeFi token", "Expert", 4, "#f85149");
        _registerBadge("nft_master", "NFT Master", "Built a complete NFT marketplace", "Expert", 4, "#58a6ff");
    }

    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || owner() == msg.sender, "Not authorized to mint");
        _;
    }

    /**
     * @dev Register a new badge type (owner only)
     */
    function registerBadge(
        string memory badgeId,
        string memory name,
        string memory description,
        string memory category,
        uint256 level,
        string memory color
    ) external onlyOwner {
        _registerBadge(badgeId, name, description, category, level, color);
    }

    function _registerBadge(
        string memory badgeId,
        string memory name,
        string memory description,
        string memory category,
        uint256 level,
        string memory color
    ) internal {
        require(!badges[badgeId].exists, "Badge already registered");
        require(level >= 1 && level <= 4, "Invalid level");

        badges[badgeId] = BadgeMetadata({
            name: name,
            description: description,
            category: category,
            level: level,
            color: color,
            exists: true
        });

        emit BadgeRegistered(badgeId, name, level);
    }

    /**
     * @dev Mint an achievement badge to a user
     */
    function mintBadge(address recipient, string memory badgeId) 
        external 
        onlyAuthorizedMinter 
        returns (uint256) 
    {
        require(badges[badgeId].exists, "Badge does not exist");
        require(userBadges[recipient][badgeId] == 0, "User already has this badge");
        require(recipient != address(0), "Invalid recipient");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(recipient, tokenId);
        
        userBadges[recipient][badgeId] = tokenId;
        tokenBadge[tokenId] = badgeId;

        // Set token URI with on-chain metadata
        string memory tokenURI = _generateTokenURI(badgeId, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit BadgeMinted(recipient, badgeId, tokenId, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Check if user has earned a specific badge
     */
    function hasBadge(address user, string memory badgeId) external view returns (bool) {
        return userBadges[user][badgeId] != 0;
    }

    /**
     * @dev Get token ID for user's badge
     */
    function getUserBadgeTokenId(address user, string memory badgeId) external view returns (uint256) {
        return userBadges[user][badgeId];
    }

    /**
     * @dev Get all badges owned by a user
     */
    function getUserBadges(address user) external view returns (string[] memory) {
        uint256 balance = balanceOf(user);
        string[] memory badgeIds = new string[](balance);
        
        uint256 count = 0;
        uint256 totalSupply = _tokenIdCounter.current();
        
        for (uint256 i = 1; i <= totalSupply && count < balance; i++) {
            try this.ownerOf(i) returns (address owner) {
                if (owner == user) {
                    badgeIds[count] = tokenBadge[i];
                    count++;
                }
            } catch {
                continue;
            }
        }
        
        return badgeIds;
    }

    /**
     * @dev Generate on-chain SVG metadata for badge
     */
    function _generateTokenURI(string memory badgeId, uint256 tokenId) internal view returns (string memory) {
        BadgeMetadata memory badge = badges[badgeId];
        
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            '<defs>',
            '<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:', badge.color, ';stop-opacity:1" />',
            '<stop offset="100%" style="stop-color:', badge.color, '80;stop-opacity:1" />',
            '</linearGradient>',
            '<filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/>',
            '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
            '</defs>',
            '<rect width="400" height="400" fill="url(#grad)" rx="20"/>',
            '<circle cx="200" cy="150" r="60" fill="white" opacity="0.2" filter="url(#glow)"/>',
            '<text x="200" y="170" font-size="48" text-anchor="middle" fill="white" filter="url(#glow)">',
            unicode'🏆',
            '</text>',
            '<text x="200" y="250" font-size="28" font-weight="bold" text-anchor="middle" fill="white">',
            badge.name,
            '</text>',
            '<text x="200" y="285" font-size="16" text-anchor="middle" fill="white" opacity="0.9">',
            badge.description,
            '</text>',
            '<text x="200" y="330" font-size="14" text-anchor="middle" fill="white" opacity="0.7">',
            'Stylus Studio Achievement #', tokenId.toString(),
            '</text>',
            '</svg>'
        ));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "', badge.name, ' #', tokenId.toString(), '",',
                        '"description": "', badge.description, '",',
                        '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
                        '"attributes": [',
                        '{"trait_type": "Badge ID", "value": "', badgeId, '"},',
                        '{"trait_type": "Category", "value": "', badge.category, '"},',
                        '{"trait_type": "Level", "value": ', badge.level.toString(), '},',
                        '{"trait_type": "Color", "value": "', badge.color, '"}',
                        ']}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /**
     * @dev Authorize an address to mint badges (backend service)
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }

    /**
     * @dev Revoke minting authorization
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }

    /**
     * @dev Soul-bound: Prevent transfers (except minting)
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from = address(0))
        // Block all transfers (from != address(0))
        require(from == address(0), "Soul-bound: Transfers disabled");
        
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Override required for multiple inheritance
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override required for multiple inheritance
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Get total number of badges minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
