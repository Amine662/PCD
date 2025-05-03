const UserManagement = artifacts.require("UserManagement");

module.exports = function (deployer) {
  deployer.deploy(UserManagement);
};