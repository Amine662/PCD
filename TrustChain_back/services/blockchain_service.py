# from web3 import Web3
# from eth_account import Account
# from config.blockchain_config import web3, CHAIN_ID
# from models.blockchain_models import BlockchainTransaction, Wallet
# from datetime import datetime
# from typing import Optional, Dict, Any

# class BlockchainService:
#     def __init__(self):
#         self.web3 = web3

#     async def create_wallet(self) -> Wallet:
#         """Create a new Ethereum wallet"""
#         account = Account.create()
#         balance = await self.get_balance(account.address)
#         return Wallet(
#             address=account.address,
#             private_key=account.key.hex(),
#             balance=balance
#         )

#     async def get_balance(self, address: str) -> float:
#         """Get balance of an Ethereum address"""
#         balance = self.web3.eth.get_balance(address)
#         return self.web3.from_wei(balance, 'ether')

#     async def send_transaction(
#         self,
#         from_private_key: str,
#         to_address: str,
#         amount: float,
#         data: Optional[bytes] = None
#     ) -> BlockchainTransaction:
#         """Send an Ethereum transaction"""
#         try:
#             from_account = Account.from_key(from_private_key)
#             nonce = self.web3.eth.get_transaction_count(from_account.address)

#             transaction = {
#                 'nonce': nonce,
#                 'to': to_address,
#                 'value': self.web3.to_wei(amount, 'ether'),
#                 'gas': 21000 if data is None else 50000,
#                 'gasPrice': self.web3.eth.gas_price,
#                 'chainId': CHAIN_ID
#             }

#             if data:
#                 transaction['data'] = data

#             signed_txn = Account.sign_transaction(transaction, from_private_key)
#             try:
#                 tx_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
#             except Exception as e:
#                 print(str(e))
#             receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)

#             return BlockchainTransaction(
#                 transaction_hash=self.web3.to_hex(tx_hash),
#                 from_address=from_account.address,
#                 to_address=to_address,
#                 value=amount,
#                 gas_used=receipt['gasUsed'],
#                 status=receipt['status'] == 1,
#                 block_number=receipt['blockNumber'],
#                 timestamp=self.web3.eth.get_block(receipt['blockNumber'])['timestamp']
#             )
#         except Exception as e:
#             raise Exception(f"Transaction failed: {str(e)}")

#     async def get_transaction(self, tx_hash: str) -> BlockchainTransaction:
#         """Get transaction details"""
#         try:
#             tx = self.web3.eth.get_transaction(tx_hash)
#             receipt = self.web3.eth.get_transaction_receipt(tx_hash)
#             block = self.web3.eth.get_block(tx['blockNumber'])
            
#             return BlockchainTransaction(
#                 transaction_hash=tx_hash,
#                 from_address=tx['from'],
#                 to_address=tx['to'],
#                 value=self.web3.from_wei(tx['value'], 'ether'),
#                 gas_used=receipt['gasUsed'],
#                 status=receipt['status'] == 1,
#                 block_number=tx['blockNumber'],
#                 timestamp=block['timestamp']
#             )
#         except Exception as e:
#             raise Exception(f"Failed to get transaction: {str(e)}")

#     def is_connected(self) -> bool:
#         """Check if connected to Ethereum network"""
#         return self.web3.is_connected()

#     async def test_connection(self) -> Dict[str, Any]:
#         """Test the connection to Ganache and get basic network info"""
#         try:
#             is_connected = self.web3.is_connected()
#             if not is_connected:
#                 return {
#                     "status": "disconnected",
#                     "error": "Cannot connect to Ganache"
#                 }

#             # Get network information
#             network_id = self.web3.eth.chain_id
#             latest_block = self.web3.eth.block_number
#             gas_price = self.web3.eth.gas_price

#             # Get some accounts from Ganache
#             accounts = self.web3.eth.accounts[:3]
#             account_balances = {}
#             for account in accounts:
#                 balance = self.web3.eth.get_balance(account)
#                 account_balances[account] = self.web3.from_wei(balance, 'ether')

#             return {
#                 "status": "connected",
#                 "network_id": network_id,
#                 "latest_block": latest_block,
#                 "gas_price": self.web3.from_wei(gas_price, 'gwei'),
#                 "available_accounts": account_balances
#             }
#         except Exception as e:
#             return {
#                 "status": "error",
#                 "error": str(e)
#             }