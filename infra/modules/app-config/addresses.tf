// Contract Addresses
variable "build_environment" {
  type = string
}

data local_file "contract-addresses" {
  filename = "../../../packages/augur-artifacts/src/environments/${var.build_environment}.json"
}

output "ethereum_chain_id" {
  value = parseint(jsondecode(data.local_file.contract-addresses.content)["networkId"], 10)
}

output "zerox_trade_address" {
  value = jsondecode(data.local_file.contract-addresses.content)["addresses"]["ZeroXTrade"]
}

output "proxy_factory_address" {
  value = jsondecode(data.local_file.contract-addresses.content)["addresses"]["ProxyFactory"]
}
