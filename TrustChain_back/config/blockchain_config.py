# from web3 import Web3
# from eth_account import Account
# import os
# from dotenv import load_dotenv

# load_dotenv()

# # Ganache configuration
# BLOCKCHAIN_PROVIDER_URL = "http://127.0.0.1:7545"
# CHAIN_ID = 1337

# # Initialize Web3
# web3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_PROVIDER_URL))

# def create_wallet():
#     """Create a new Ethereum wallet"""
#     account = Account.create()
#     return {
#         "address": account.address,
#         "private_key": account._private_key.hex()
#     }

# def get_balance(address: str) -> float:
#     """Get balance of an Ethereum address"""
#     try:
#         balance = web3.eth.get_balance(address)
#         return web3.from_wei(balance, 'ether')
#     except Exception as e:
#         raise Exception(f"Failed to get balance: {str(e)}")

# def is_connected() -> bool:
#     """Check if connected to Ethereum network"""
#     return web3.is_connected()
