// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductManagement {
    struct Product {
        string name;
        string description;
        uint256 price; // in Wei
        uint256 quantity;
        address seller;
        bool available;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductAdded(uint256 productId, string name, address seller, uint256 price);
    event ProductUpdated(uint256 productId, string name, string description, uint256 price, uint256 quantity, bool available);

    function addProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantity
    ) external {
        uint256 productId = productCount++;
        products[productId] = Product({
            name: _name,
            description: _description,
            price: _price,
            quantity: _quantity,
            seller: msg.sender,
            available: true
        });
        emit ProductAdded(productId, _name, msg.sender, _price);
    }

    function updateProduct(
        uint256 _productId,
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantity,
        bool _available
    ) external {
        require(products[_productId].seller == msg.sender, "Only seller can update product");
        products[_productId].name = _name;
        products[_productId].description = _description;
        products[_productId].price = _price;
        products[_productId].quantity = _quantity;
        products[_productId].available = _available;

        emit ProductUpdated(_productId, _name, _description, _price, _quantity, _available);
    }

    function getProduct(uint256 _productId) external view returns (Product memory) {
        return products[_productId];
    }

    function getProductCount() external view returns (uint256) {
        return productCount;
    }

    function decreaseQuantity(uint256 _productId, uint256 _amount) external {
        require(products[_productId].quantity >= _amount, "Insufficient quantity");
        products[_productId].quantity -= _amount;
    }

    function setProductAvailability(uint256 _productId, bool _available) external {
        require(products[_productId].seller == msg.sender, "Only seller can change availability");
        products[_productId].available = _available;
    }
}
