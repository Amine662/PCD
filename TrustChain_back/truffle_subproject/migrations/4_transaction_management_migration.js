const ProductManagement = artifacts.require("ProductManagement");
const TransactionManagement = artifacts.require("TransactionManagement");

module.exports = async function (deployer) { 
  // Get the deployed instance of ProductManagement
  // This assumes ProductManagement was deployed in a previous migration script
  const productManagementInstance = await ProductManagement.deployed();

  // Deploy TransactionManagement, passing the ProductManagement contract's address
  // as the constructor argument
  await deployer.deploy(TransactionManagement, productManagementInstance.address);
};