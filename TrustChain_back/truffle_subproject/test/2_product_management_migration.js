const ProductManagement = artifacts.require("ProductManagement");

module.exports = function (deployer) {
  deployer.deploy(ProductManagement);
};