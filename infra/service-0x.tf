/* ECS Service for 0x */

locals {
  bootstrap_name   = "0x-mesh-bootstrap"
  bootstrap_ports  = [60558, 60559]
  rpc_name         = "0x-mesh-rpc"
  rpc_port         = 60557
  zerox-trade-addr = jsondecode(data.local_file.contract-addresses.content)[var.ethereum_chain_id]["ZeroXTrade"]
}

// Security Group
module "zeroX-security-group" {
  source = "terraform-aws-modules/security-group/aws"

  name   = "0x-sg"
  vpc_id = module.vpc.vpc_id
  ingress_with_cidr_blocks = [
    {
      from_port   = 60556
      to_port     = 60559
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
  source           = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name   = local.bootstrap_name
  container_image  = "0xorg/mesh-bootstrap:9.0.1"
  container_memory = 512
  container_cpu    = 256
  entrypoint = [
    "sh",
    "-c",
    "mkdir -p ./0x_mesh/keys && echo $PRIVATE_KEY > ./0x_mesh/keys/privkey && ./mesh-bootstrap"
  ]
  port_mappings = [
    {
      hostPort : local.bootstrap_ports[0],
      protocol : "tcp",
      containerPort : local.bootstrap_ports[0]
    },
    {
      hostPort : local.bootstrap_ports[1],
      protocol : "tcp",
      containerPort : local.bootstrap_ports[1]
    }
  ]
  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-group" : aws_cloudwatch_log_group.ecs.name,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : local.bootstrap_name
    }
    secretOptions = null
  }
  environment = [
    {
      name : "ETHEREUM_CHAIN_ID",
      value : var.ethereum_chain_id
    },
    {
      name : "P2P_ADVERTISE_ADDRS",
      value : "/dns4/${var.environment}.${var.domain}/tcp/${local.bootstrap_ports[1]}/ws/ipfs/${var.ipfs_pubkey}"
    },
    {
      name : "P2P_BIND_ADDRS",
      value : "/ip4/0.0.0.0/tcp/${local.bootstrap_ports[0]},/ip4/0.0.0.0/tcp/${local.bootstrap_ports[1]}/ws"
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
  source           = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name   = local.rpc_name
  container_image  = "0xorg/mesh:9.0.1"
  container_memory = 512
  container_cpu    = 256
  port_mappings = [
    {
      hostPort : local.rpc_port,
      protocol : "tcp",
      containerPort : local.rpc_port
    }
  ]
  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-group" : aws_cloudwatch_log_group.ecs.name,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : local.rpc_name
    }
    secretOptions = null
  }
  environment = [
    {
      name : "ETHEREUM_CHAIN_ID",
      value : "42"
    },
    {
      name : "CUSTOM_CONTRACT_ADDRESS",
      value : ""
    },
    {
      name : "ETHEREUM_RPC_URL",
      value : "https://eth-kovan.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM"
    },
    {
      name : "USE_BOOTSTRAP_LIST",
      value : "true"
    },
    {
      name : "BOOTSTRAP_LIST",
      value : "/dns4/${local.bootstrap_name}.${var.environment}/tcp/60558/ipfs/${var.ipfs_pubkey},/dns4/${local.bootstrap_name}.${var.environment}/tcp/60559/ws/ipfs/${var.ipfs_pubkey}"
    },
    {
      name : "BLOCK_POLLING_INTERVAL"
      value : "1s"
    },
    {
      name : "ETHEREUM_RPC_MAX_REQUESTS_PER_24_HR_UTC",
      value : "169120"
    },
    {
      name : "WS_RPC_ADDR",
      value : "0.0.0.0:60557"
    },
    {
      name : "VERBOSITY",
      value : "4"
    },
    {
      name : "P2P_TCP_PORT",
      value : "60558"
    },
    {
      name : "P2P_WEBSOCKETS_PORT",
      value : "60558"
    },
    {
      name : "CUSTOM_ORDER_FILTER",
      value : "{\"properties\":{\"makerAssetData\":{\"pattern\":\".*${local.zerox-trade-addr}.*\"}}}"
    }
  ]
}


/* Services */
module "discovery-0x-mesh-bootstrap" {
  source       = "./modules/discovery"
  namespace    = aws_service_discovery_private_dns_namespace.ecs.id
  service_name = local.bootstrap_name
}

module "service-0x-mesh-bootstrap" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = local.bootstrap_name
  alb_security_group             = module.alb_security_group.this_security_group_id
  container_definition_json      = module.task-0x-mesh-bootstrap.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = aws_ecs_cluster.ecs.arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = module.vpc.vpc_id
  security_group_ids = [
    module.vpc.vpc_default_security_group_id,
    module.zeroX-security-group.this_security_group_id
  ]
  subnet_ids = module.subnets.public_subnet_ids
  ecs_load_balancers = [
    {
      container_name   = local.bootstrap_name
      container_port   = local.bootstrap_ports[1]
      elb_name         = null
      target_group_arn = module.alb.target_group_arns[2]
    }
  ]
  desired_count = 1
  service_registries = [
    {
      registry_arn   = module.discovery-0x-mesh-bootstrap.arn
      port           = null
      container_name = null
      container_port = null
  }]
}

module "discovery-0x-mesh-rpc" {
  source       = "./modules/discovery"
  namespace    = aws_service_discovery_private_dns_namespace.ecs.id
  service_name = local.rpc_name
}

module "service-0x-rpc" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = local.rpc_name
  alb_security_group             = module.alb_security_group.this_security_group_id
  container_definition_json      = module.task-0x-mesh-rpc.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = aws_ecs_cluster.ecs.arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = module.vpc.vpc_id
  security_group_ids = [
    module.vpc.vpc_default_security_group_id,
    module.zeroX-security-group.this_security_group_id
  ]
  subnet_ids    = module.subnets.public_subnet_ids
  desired_count = 1
  ecs_load_balancers = [
    {
      container_name   = local.rpc_name
      container_port   = local.rpc_port
      elb_name         = null
      target_group_arn = module.ingress-0x-mesh-rpc.target_group_arn
    }
  ]
  service_registries = [
    {
      registry_arn   = module.discovery-0x-mesh-rpc.arn
      port           = null
      container_name = null
      container_port = null
    }
  ]
}
