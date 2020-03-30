# service-gnosis/variables.tf

// shared ecs vars
variable "alb_sg" {}
variable "domain" {}
variable "environment" {}
variable "ecs_cluster_arn" {}
variable "ecs_log_group" {}
variable "private_subnets" {}
variable "public_subnets" {}
variable "region" {}
variable "service_discovery_namespace_id" {}
variable "vpc_id" {}
variable "vpc_sg" {}

// service specific vars
variable "ethereum_node_url" {}
variable "gnosis_safe_address" {}
variable "gnosis_web_tg_arn" {}
variable "proxy_factory_address" {}

