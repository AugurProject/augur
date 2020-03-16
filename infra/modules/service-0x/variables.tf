# service-0x/variables.tf

// shared ecs vars
variable "alb_sg" {}
variable "domain" {}
variable "ecs_cluster_arn" {}
variable "ecs_log_group" {}
variable "environment" {}
variable "region" {}
variable "service_discovery_namespace_id" {}
variable "public_subnets" {}
variable "private_subnets" {}
variable "vpc_id" {}
variable "vpc_sg" {}

// service specific vars
variable "ethereum_chain_id" {}
variable "ipfs_pubkey" {}
variable "zerox_bootstrap_tg_arn" {}
variable "zerox_rpc_tg_arn" {}
variable "zerox_trade_address" {}
