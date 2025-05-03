pragma solidity ^0.8.0;

import "./ProductManagement.sol";
import "./SafeTransferLib.sol";

contract TransactionManagement {
    using SafeTransferLib for address payable;

    ProductManagement public productManagement;

    struct Transaction {
        uint256 productId;
        address buyer;
        uint256 amount;
        uint256 timestamp;
        TransactionStatus status;
    }

    enum TransactionStatus {
        PENDING,
        CONFIRMED,
        SHIPPED,
        COMPLETED,
        CANCELLED
    }

    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCount;

    event TransactionCreated(uint256 transactionId, uint256 productId, address buyer, uint256 amount);
    event TransactionStatusUpdated(uint256 transactionId, TransactionStatus newStatus);

    constructor(address _productManagementAddress) {
        productManagement = ProductManagement(_productManagementAddress);
    }

    function createTransaction(uint256 _productId) external payable {
        ProductManagement.Product memory product = productManagement.getProduct(_productId);
        require(product.available, "Product is not available");
        require(product.quantity > 0, "Product is out of stock");
        require(msg.value == product.price, "Incorrect amount sent");

        address payable seller = payable(product.seller);
        seller.safeTransfer(msg.value);

        productManagement.decreaseQuantity(_productId, 1); 

        uint256 transactionId = transactionCount++;
        transactions[transactionId] = Transaction({
            productId: _productId,
            buyer: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            status: TransactionStatus.PENDING
        });

        emit TransactionCreated(transactionId, _productId, msg.sender, msg.value);
    }

    function updateTransactionStatus(uint256 _transactionId, TransactionStatus _newStatus) external {
        Transaction storage transaction = transactions[_transactionId];
        transaction.status = _newStatus;
        emit TransactionStatusUpdated(_transactionId, _newStatus);
    }

    function getTransaction(uint256 _transactionId)
        external
        view
        returns (
            uint256 productId,
            address buyer,
            uint256 amount,
            uint256 timestamp,
            TransactionStatus status
        )
    {
        Transaction memory tx = transactions[_transactionId];
        return (tx.productId, tx.buyer, tx.amount, tx.timestamp, tx.status);
    }
}
