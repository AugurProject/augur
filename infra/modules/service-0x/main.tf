/* ECS Service for 0x */

locals {
  bootstrap_name = "0x-mesh-bootstrap"
  rpc_name       = "0x-mesh-rpc"
  zerox_ports    = {
    rpc_http : 60556
    rpc_ws : 60557
    p2p_tcp : 60558
    p2p_ws : 60559
  }
}

// Security Group
module "zeroX-security-group" {
  source = "terraform-aws-modules/security-group/aws"

  name                     = "0x-sg"
  vpc_id                   = var.vpc_id
  ingress_with_cidr_blocks = [
    {
      from_port   = local.zerox_ports.rpc_http
      to_port     = local.zerox_ports.p2p_ws
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
}

// Secrets
data aws_secretsmanager_secret "zero-x-privatekey" {
  name = "0x-privatekey"
}

data aws_secretsmanager_secret_version "zero-x-privatekey" {
  secret_id = data.aws_secretsmanager_secret.zero-x-privatekey.id
}

/* Tasks */
module "task-0x-mesh-bootstrap" {
  source            = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name    = local.bootstrap_name
  container_image   = "0xorg/mesh-bootstrap:9.4.0"
  container_memory  = 512
  container_cpu     = 256
  entrypoint        = [
    "sh",
    "-c",
    "mkdir -p ./0x_mesh/keys && echo $PRIVATE_KEY > ./0x_mesh/keys/privkey && ./mesh-bootstrap"
  ]
  port_mappings     = [
    {
      hostPort : local.zerox_ports.p2p_tcp,
      protocol : "tcp",
      containerPort : local.zerox_ports.p2p_tcp
    },
    {
      hostPort : local.zerox_ports.p2p_ws,
      protocol : "tcp",
      containerPort : local.zerox_ports.p2p_ws
    }
  ]
  log_configuration = {
    logDriver     = "awslogs"
    options       = {
      "awslogs-group" : var.ecs_log_group,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : local.bootstrap_name
    }
    secretOptions = null
  }
  environment       = [
    {
      name : "ETHEREUM_CHAIN_ID",
      value : var.ethereum_chain_id
    },
    {
      name : "P2P_ADVERTISE_ADDRS",
      value : "/dns4/${var.environment}-bootstrap.${var.domain}/tcp/${local.zerox_ports.p2p_ws}/wss/ipfs/${var.ipfs_pubkey}"
    },
    {
      name : "P2P_BIND_ADDRS",
      value : "/ip4/0.0.0.0/tcp/${local.zerox_ports.p2p_tcp},/ip4/0.0.0.0/tcp/${local.zerox_ports.p2p_ws}/wss"
    },
    {
      name : "PRIVATE_KEY",
      value : jsondecode(data.aws_secretsmanager_secret_version.zero-x-privatekey.secret_string)["PRIVATE_KEY"]
    },
    {
      name : "VERBOSITY",
      value : "4"
    }
  ]
}

module "task-0x-mesh-rpc" {
  source            = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name    = local.rpc_name
  container_image   = "0xorg/mesh:9.4.0"
  container_memory  = 8192
  container_cpu     = 4096
  port_mappings     = [
    {
      hostPort : local.zerox_ports.rpc_http
      protocol : "tcp",
      containerPort : local.zerox_ports.rpc_http
    },
    {
      hostPort : local.zerox_ports.rpc_ws
      protocol : "tcp",
      containerPort : local.zerox_ports.rpc_ws
    },
    {
      hostPort : local.zerox_ports.p2p_tcp
      protocol : "tcp",
      containerPort : local.zerox_ports.p2p_tcp
    },
    {
      hostPort : local.zerox_ports.p2p_ws
      protocol : "tcp",
      containerPort : local.zerox_ports.p2p_ws
    }
  ]
  log_configuration = {
    logDriver     = "awslogs"
    options       = {
      "awslogs-group" : var.ecs_log_group,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : local.rpc_name
    }
    secretOptions = null
  }
  environment       = [
    {
      name : "BLOCK_POLLING_INTERVAL"
      value : "5s"
    },
    {
      name : "BOOTSTRAP_LIST",
      value : "/dns4/${local.bootstrap_name}.${var.environment}/tcp/${local.zerox_ports.p2p_tcp}/ipfs/${var.ipfs_pubkey},/dns4/${local.bootstrap_name}.${var.environment}/tcp/${local.zerox_ports.p2p_ws}/wss/ipfs/${var.ipfs_pubkey}"
    },
    {
      name : "CUSTOM_ORDER_FILTER",
      value : "{\"properties\":{\"makerAssetData\":{\"pattern\":\".*${lower(trimprefix(var.zerox_trade_address, "0x"))}.*\"}}}"
    },
    {
      name : "ETHEREUM_CHAIN_ID",
      value : "42"
    },
    {
      name : "ETHEREUM_RPC_MAX_REQUESTS_PER_24_HR_UTC",
      value : "5000000"
    },
    {
      name : "ETHEREUM_RPC_URL",
      value : "https://kovan.augur.net/ethereum-http"
    },
    {
      name : "HTTP_RPC_ADDR",
      value : "0.0.0.0:${local.zerox_ports.rpc_http}"
    },
    {
      name : "P2P_TCP_PORT",
      value : local.zerox_ports.p2p_tcp
    },
    {
      name : "P2P_WEBSOCKETS_PORT",
      value : local.zerox_ports.p2p_ws
    },
    {
      name : "USE_BOOTSTRAP_LIST",
      value : "true"
    },
    {
      name : "VERBOSITY",
      value : "5"
    },
    {
      name : "WS_RPC_ADDR",
      value : "0.0.0.0:${local.zerox_ports.rpc_ws}"
    },
    {
      name : "ZEROX_CONTRACT_ADDRESS"
      value : var.zerox_trade_address
    }
  ]
}

/* Services */
module "discovery-0x-mesh-bootstrap" {
  source       = "./../discovery"
  namespace    = var.service_discovery_namespace_id
  service_name = local.bootstrap_name
}

module "service-0x-mesh-bootstrap" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = local.bootstrap_name
  alb_security_group             = var.alb_sg
  container_definition_json      = module.task-0x-mesh-bootstrap.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = var.ecs_cluster_arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = var.vpc_id
  security_group_ids             = [
    var.vpc_sg,
    module.zeroX-security-group.this_security_group_id
  ]
  subnet_ids                     = var.public_subnets
  ecs_load_balancers             = [
    {
      container_name   = local.bootstrap_name
      container_port   = local.zerox_ports.p2p_ws
      elb_name         = null
      target_group_arn = var.zerox_bootstrap_tg_arn
    }
  ]
  desired_count                  = 1
  service_registries             = [
    {
      registry_arn   = module.discovery-0x-mesh-bootstrap.arn
      port           = null
      container_name = null
      container_port = null
    }]
}

module "discovery-0x-mesh-rpc" {
  source       = "./../discovery"
  namespace    = var.service_discovery_namespace_id
  service_name = local.rpc_name
}

module "service-0x-rpc" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = local.rpc_name
  alb_security_group             = var.alb_sg
  container_definition_json      = module.task-0x-mesh-rpc.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = var.ecs_cluster_arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = var.vpc_id
  task_memory                    = 8192
  task_cpu                       = 4096
  security_group_ids             = [
    var.vpc_sg,
    module.zeroX-security-group.this_security_group_id
  ]
  subnet_ids                     = var.public_subnets
  desired_count                  = 1
  ecs_load_balancers             = [
    {
      container_name   = local.rpc_name
      container_port   = local.zerox_ports.rpc_ws
      elb_name         = null
      target_group_arn = var.zerox_rpc_tg_arn
    }
  ]
  service_registries             = [
    {
      registry_arn   = module.discovery-0x-mesh-rpc.arn
      port           = null
      container_name = null
      container_port = null
    }
  ]
}
