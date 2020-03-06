// Contract Addresses
variable "ethereum_chain_id" {
  type = number
}

data local_file "contract-addresses" {
  filename = "../../../packages/augur-artifacts/src/addresses.json"
}

output "zerox-trade-address" {
  value = jsondecode(data.local_file.contract-addresses.content)[var.ethereum_chain_id]["ZeroXTrade"]
}

output "gnosis_safe_address" {
  value = jsondecode(data.local_file.contract-addresses.content)[var.ethereum_chain_id]["GnosisSafe"]
}

output "proxy_factory_addr" {
  value = jsondecode(data.local_file.contract-addresses.content)[var.ethereum_chain_id]["ProxyFactory"]
}
