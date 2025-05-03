pragma solidity ^0.8.0;

library SafeTransferLib {
    function safeTransfer(address payable to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH transfer failed");
    }
}
