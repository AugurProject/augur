# service-ipfs/variables.tf

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
