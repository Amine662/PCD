# # services/blockchain_service.py
# from web3 import Web3
# from eth_account import Account
# from config.blockchain_config import (
#     web3,
#     CHAIN_ID,
#     TRANSACTION_MANAGEMENT_CONTRACT_ABI,
#     TRANSACTION_MANAGEMENT_CONTRACT_ADDRESS,
#     USER_MANAGEMENT_CONTRACT_ABI,
#     USER_MANAGEMENT_CONTRACT_ADDRESS
# )

# class BlockchainService:
#     def __init__(self):
#         self.web3 = web3
        
#         # Initialize both contracts
#         self.transaction_contract = self.web3.eth.contract(
#             address=TRANSACTION_MANAGEMENT_CONTRACT_ADDRESS,
#             abi=TRANSACTION_MANAGEMENT_CONTRACT_ABI
#         )
        
#         self.user_contract = self.web3.eth.contract(
#             address=USER_MANAGEMENT_CONTRACT_ADDRESS,
#             abi=USER_MANAGEMENT_CONTRACT_ABI
#         )

#     def _build_and_send_tx(self, func, private_key: str, *args) -> str:
#         from_account = Account.from_key(private_key)
#         nonce = self.web3.eth.get_transaction_count(from_account.address)
#         transaction = func(*args).build_transaction({
#             'chainId': CHAIN_ID,
#             'gas': 200000,
#             'gasPrice': self.web3.eth.gas_price,
#             'nonce': nonce
#         })
#         signed_txn = self.web3.eth.account.sign_transaction(transaction, private_key)
#         tx_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
#         return self.web3.to_hex(tx_hash)

#     async def create_transaction(self, private_key: str, product_id: int, amount: int) -> str:
#         return self._build_and_send_tx(
#             self.transaction_contract.functions.createTransaction,
#             private_key,
#             product_id,
#             amount
#         )

#     def get_transaction(self, transaction_id: int):
#         return self.transaction_contract.functions.getTransaction(transaction_id).call()

#     async def register_seller(self, private_key: str) -> str:
#         return self._build_and_send_tx(
#             self.user_contract.functions.registerSeller,
#             private_key
#         )

#     async def set_user_role(self, admin_key: str, user_address: str, role: int) -> str:
#         return self._build_and_send_tx(
#             self.user_contract.functions.setUserRole,
#             admin_key,
#             user_address,
#             role
#         )

#     async def set_user_name(self, private_key: str, user_address: str, hashed_name: bytes) -> str:
#         return self._build_and_send_tx(
#             self.user_contract.functions.setUserName,
#             private_key,
#             user_address,
#             hashed_name
#         )

#     def get_user_role(self, address: str) -> int:
#         return self.user_contract.functions.getUserRole(address).call()

#     def get_user_name(self, address: str) -> bytes:
#         return self.user_contract.functions.getUserName(address).call()