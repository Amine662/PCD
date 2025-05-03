const SafeTransferLib = artifacts.require("SafeTransferLib");

module.exports = function (deployer) {
  deployer.deploy(SafeTransferLib);
};