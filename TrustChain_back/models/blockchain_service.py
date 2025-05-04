from .blockchain_config import web3, product_contract, transaction_contract
from web3.exceptions import ContractLogicError

# Example: Add a product (for sellers)
def add_product(name, description, price, quantity, seller_private_key):
    account = web3.eth.account.from_key(seller_private_key)
    nonce = web3.eth.get_transaction_count(account.address)
    txn = product_contract.functions.addProduct(name, description, price, quantity).build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': 3000000,
        'gasPrice': web3.to_wei('20', 'gwei')
    })
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=seller_private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    return web3.to_hex(tx_hash)

# Example: Update a product (for sellers)
def update_product(product_id, name, description, price, quantity, available, seller_private_key):
    account = web3.eth.account.from_key(seller_private_key)
    nonce = web3.eth.get_transaction_count(account.address)
    txn = product_contract.functions.updateProduct(product_id, name, description, price, quantity, available).build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': 3000000,
        'gasPrice': web3.to_wei('20', 'gwei')
    })
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=seller_private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    return web3.to_hex(tx_hash)

# Example: Buy a product (for buyers)
def buy_product(product_id, buyer_private_key, value):
    account = web3.eth.account.from_key(buyer_private_key)
    nonce = web3.eth.get_transaction_count(account.address)
    txn = transaction_contract.functions.createTransaction(product_id).build_transaction({
        'from': account.address,
        'nonce': nonce,
        'value': value,  # in Wei
        'gas': 3000000,
        'gasPrice': web3.to_wei('20', 'gwei')
    })
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=buyer_private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    return web3.to_hex(tx_hash) 