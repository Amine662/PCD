pragma solidity ^0.8.0;

contract UserManagement {
    
    enum UserRole {
        BUYER,
        SELLER,
        ADMIN
    }

    mapping(address => UserRole) public userRoles;
    mapping(address => bytes32) public userNames;

    address public admin;

    event UserRoleSet(address user, UserRole role);
    event SellerRegistered(address seller);
    event UserNameSet(address user, bytes32 hashedName);

    constructor() {
        admin = msg.sender;
        userRoles[msg.sender] = UserRole.ADMIN;
        emit UserRoleSet(msg.sender, UserRole.ADMIN);
    }

    function setUserRole(address _user, UserRole _role) external onlyAdmin {
        userRoles[_user] = _role;
        emit UserRoleSet(_user, _role);
    }

    function getUserRole(address _user) external view returns (UserRole) {
        return userRoles[_user];
    }

    function registerSeller() external {
        userRoles[msg.sender] = UserRole.SELLER;
        emit SellerRegistered(msg.sender);
    }

    function setUserName(address _user, bytes32 _hashedName) external {
        userNames[_user] = _hashedName;
        emit UserNameSet(_user, _hashedName);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
}
