# import json
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

# def load_contract_info(contract_name: str):
#     with open(f'./abis/{contract_name}.json') as f:
#         contract_info = json.load(f)
#         abi = contract_info['abi']
#         address = contract_info['networks'][str(CHAIN_ID)]['address']
#         return abi, address

# TRANSACTION_MANAGEMENT_CONTRACT_ABI, TRANSACTION_MANAGEMENT_CONTRACT_ADDRESS = load_contract_info('TransactionManagement')

# USER_MANAGEMENT_CONTRACT_ABI, USER_MANAGEMENT_CONTRACT_ADDRESS = load_contract_info('UserManagement')
