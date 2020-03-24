# demo.tf

provider "aws" {
  region = var.region
}

terraform {
  backend "remote" {
    organization = "augur"
    workspaces {
      name = "demo"
    }
  }
}


// Network (VPC, ALB, etc) & ECS Cluster
module network {
  source = "./../../modules/network"

  name               = var.name
  namespace          = var.namespace
  environment        = var.environment
  domain             = var.domain
  availability_zones = var.availability_zones
  vpc_cidr_block     = var.vpc_cidr_block
}

module ecs-cluster {
  source = "./../../modules/ecs-cluster"

  name        = var.name
  environment = var.environment
  vpc_id      = module.network.vpc_id
}


// ECS Services
module "app-config" {
  source = "./../../modules/app-config"

  build_environment = var.build_environment
}

module zeroX {
  source = "./../../modules/service-0x"

  alb_sg                         = module.network.alb_sg
  domain                         = var.domain
  ecs_cluster_arn                = module.ecs-cluster.ecs_cluster_arn
  ecs_log_group                  = module.ecs-cluster.ecs_log_group
  environment                    = var.environment
  private_subnets                = module.network.private_subnets
  public_subnets                 = module.network.public_subnets
  region                         = var.region
  service_discovery_namespace_id = module.ecs-cluster.service_discover_namespace_id
  vpc_id                         = module.network.vpc_id
  vpc_sg                         = module.network.vpc_default_sg

  ethereum_chain_id      = module.app-config.ethereum_chain_id
  ipfs_pubkey            = var.ipfs_pubkey
  zerox_trade_address    = module.app-config.zerox_trade_address
  zerox_bootstrap_tg_arn = module.network.zerox_bootstrap_tg_arn
  zerox_rpc_tg_arn       = module.network.zerox_rpc_tg_arn
}

module ipfs {
  source = "./../../modules/service-ipfs"

  alb_sg                         = module.network.alb_sg
  domain                         = var.domain
  ecs_cluster_arn                = module.ecs-cluster.ecs_cluster_arn
  ecs_log_group                  = module.ecs-cluster.ecs_log_group
  environment                    = var.environment
  private_subnets                = module.network.private_subnets
  public_subnets                 = module.network.public_subnets
  region                         = var.region
  service_discovery_namespace_id = module.ecs-cluster.service_discover_namespace_id
  vpc_id                         = module.network.vpc_id
  vpc_sg                         = module.network.vpc_default_sg
}
