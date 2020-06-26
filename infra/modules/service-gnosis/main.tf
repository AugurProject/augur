/* ECS Service for 0x */

locals {
  web_name           = "gnosis-web"
  web_port           = 8888
  postgres_name      = "gnosis-postgres"
  postgres_port      = 5432
  redis_name         = "gnosis-redis"
  redis_port         = 6379
  worker_name        = "gnosis-worker"
  scheduler_name     = "gnosis-scheduler"
}

// Secrets
data aws_secretsmanager_secret "gnosis-funder-private-key" {
  name = "gnosis-funder-private-key"
}

data aws_secretsmanager_secret_version "gnosis-funder-private-key" {
  secret_id = data.aws_secretsmanager_secret.gnosis-funder-private-key.id
}

data aws_secretsmanager_secret "gnosis-sender-private-key" {
  name = "gnosis-sender-private-key"
}

data aws_secretsmanager_secret_version "gnosis-sender-private-key" {
  secret_id = data.aws_secretsmanager_secret.gnosis-sender-private-key.id
}

// Security Group
module "gnosis-security-group" {
  source = "terraform-aws-modules/security-group/aws"

  name                = "gnosis-web-sg"
  vpc_id              = var.vpc_id
  ingress_cidr_blocks = ["0.0.0.0/0"]
  ingress_rules = [
    "postgresql-tcp",
    "redis-tcp"
  ]
  ingress_with_cidr_blocks = [
    {
      from_port   = local.web_port
      to_port     = local.web_port
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
}

/* Tasks */
module "task-gnosis-web" {
  source           = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name   = local.web_name
  container_image  = "augurproject/safe-relay-service_web:latest"
  container_memory = 512
  container_cpu    = 256
  command          = ["docker/web/run_web.sh"]
  port_mappings = [
    {
      hostPort : local.web_port,
      protocol : "tcp",
      containerPort : local.web_port
    }
  ]
  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-group" : var.ecs_log_group,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : local.web_name
    }
    secretOptions = null
  }
  environment = [
    {
      name : "ALLOWED_HOSTS",
      value : "*"
    },
    {
      name : "C_FORCE_ROOT",
      value : "true"
    },
    {
      name : "CELERY_BROKER_URL",
      value : "redis://${local.redis_name}.${var.environment}"
    },
    {
      name : "DATABASE_URL",
      value : "psql://postgres@${local.postgres_name}.${var.environment}:${local.postgres_port}/postgres"
    },
    {
      name : "DEBUG",
      value : "False"
    },
    {
      name : "DEPLOY_MASTER_COPY_ON_INIT",
      value : "0"
    },
    {
      name : "DJANGO_SECRET_KEY",
      value : "test-secret#-!key"
    },
    {
      name : "DJANGO_SETTINGS_MODULE",
      value : "config.settings.local"
    },
    {
      name : "ETHEREUM_NODE_URL",
      value : "https://kovan.augur.net/ethereum-http"
    },
    {
      name : "PYTHONPATH",
      value : "/app/safe_relay_service"
    },
    {
      name : "REDIS_URL",
      value : "redis://gnosis-redis.${var.environment}"
    },
    {
      name : "SAFE_AUTO_APPROVE_TOKEN",
      value : "True"
    },
    {
      name : "SAFE_AUTO_FUND",
      value : "True"
    },
    {
      name : "SAFE_CONTRACT_ADDRESS",
      value : var.gnosis_safe_address
    },
    {
      name : "SAFE_FUNDER_PRIVATE_KEY",
      value : jsondecode(data.aws_secretsmanager_secret_version.gnosis-funder-private-key.secret_string)["SAFE_FUNDER_PRIVATE_KEY"]
    },
    {
      name : "SAFE_OLD_CONTRACT_ADDRESS",
      value : var.gnosis_safe_address
    },
    {
      name : "SAFE_PROXY_FACTORY_ADDRESS",
      value : var.proxy_factory_address
    },
    {
      name : "SAFE_TX_SENDER_PRIVATE_KEY",
      value : jsondecode(data.aws_secretsmanager_secret_version.gnosis-sender-private-key.secret_string)["SAFE_TX_SENDER_PRIVATE_KEY"]
    },
    {
      name : "USE_DOCKER",
      value : "True"
    }
  ]
}

//TODO: Add real auth
module "task-gnosis-postgres" {
  source           = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name   = local.postgres_name
  container_image  = "postgres:10-alpine"
  container_memory = 512
  container_cpu    = 256
  command          = []
  environment = [
    {
      name : "POSTGRES_HOST_AUTH_METHOD"
      value : "trust"
    }
  ]
  port_mappings = [
    {
      hostPort : local.postgres_port,
      protocol : "tcp",
      containerPort : local.postgres_port
    }
  ]
  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-group" : var.ecs_log_group,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : local.postgres_name
    }
    secretOptions = null
  }
}

module "task-gnosis-redis" {
  source           = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name   = local.redis_name
  container_image  = "redis:4-alpine"
  container_memory = 512
  container_cpu    = 256
  command          = []
  port_mappings = [
    {
      hostPort : local.redis_port,
      protocol : "tcp",
      containerPort : local.redis_port
    }
  ]
  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-group" : var.ecs_log_group,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : local.redis_name
    }
    secretOptions = null
  }
  environment = []
}

module "task-gnosis-worker" {
  source           = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name   = local.worker_name
  container_image  = "augurproject/safe-relay-service_worker:latest"
  container_memory = 512
  container_cpu    = 256
  command          = ["docker/web/celery/worker/run.sh"]
  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-group" : var.ecs_log_group,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : local.worker_name
    }
    secretOptions = null
  }
  environment = [
    {
      name : "C_FORCE_ROOT",
      value : "true"
    },
    {
      name : "CELERY_BROKER_URL",
      value : "redis://${local.redis_name}.${var.environment}"
    },
    {
      name : "DATABASE_URL",
      value : "psql://postgres@${local.postgres_name}.${var.environment}:${local.postgres_port}/postgres"
    },
    {
      name : "DEBUG",
      value : "0"
    },
    {
      name : "DEPLOY_MASTER_COPY_ON_INIT",
      value : "0"
    },
    {
      name : "DJANGO_SECRET_KEY",
      value : "test-secret#-!key"
    },
    {
      name : "DJANGO_SETTINGS_MODULE",
      value : "config.settings.local"
    },
    {
      name : "ETHEREUM_NODE_URL",
      value : var.ethereum_node_url
    },
    {
      name : "PYTHONPATH",
      value : "/app/safe_relay_service"
    },
    {
      name : "REDIS_URL",
      value : "redis://${local.redis_name}.${var.environment}"
    },
    {
      name : "SAFE_CONTRACT_ADDRESS",
      value : var.gnosis_safe_address
    },
    {
      name : "SAFE_FUNDER_PRIVATE_KEY",
      value : jsondecode(data.aws_secretsmanager_secret_version.gnosis-funder-private-key.secret_string)["SAFE_FUNDER_PRIVATE_KEY"]
    },
    {
      name : "SAFE_OLD_CONTRACT_ADDRESS",
      value : var.gnosis_safe_address
    },
    {
      name : "SAFE_PROXY_FACTORY_ADDRESS",
      value : var.proxy_factory_address
    },
    {
      name : "SAFE_TX_SENDER_PRIVATE_KEY",
      value : jsondecode(data.aws_secretsmanager_secret_version.gnosis-sender-private-key.secret_string)["SAFE_TX_SENDER_PRIVATE_KEY"]
    },
    {
      name : "USE_DOCKER",
      value : "True"
    }
  ]
}

module "task-gnosis-scheduler" {
  source           = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name   = local.worker_name
  container_image  = "augurproject/safe-relay-service_scheduler:latest"
  container_memory = 512
  container_cpu    = 256
  command          = ["docker/web/celery/scheduler/run.sh"]
  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-group" : var.ecs_log_group,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : local.scheduler_name
    }
    secretOptions = null
  }
  environment = [
    {
      name : "C_FORCE_ROOT",
      value : "true"
    },
    {
      name : "CELERY_BROKER_URL",
      value : "redis://${local.redis_name}.${var.environment}"
    },
    {
      name : "DATABASE_URL",
      value : "psql://postgres@${local.postgres_name}.${var.environment}:${local.postgres_port}/postgres"
    },
    {
      name : "DEBUG",
      value : "0"
    },
    {
      name : "DEPLOY_MASTER_COPY_ON_INIT",
      value : "0"
    },
    {
      name : "DJANGO_SECRET_KEY",
      value : "test-secret#-!key"
    },
    {
      name : "DJANGO_SETTINGS_MODULE",
      value : "config.settings.local"
    },
    {
      name : "ETHEREUM_NODE_URL",
      value : "https://kovan.augur.net/ethereum-http"
    },
    {
      name : "PYTHONPATH",
      value : "/app/safe_relay_service"
    },
    {
      name : "REDIS_URL",
      value : "redis://${local.redis_name}.${var.environment}"
    },
    {
      name : "SAFE_CONTRACT_ADDRESS",
      value : var.gnosis_safe_address
    },
    {
      name : "SAFE_FUNDER_PRIVATE_KEY",
      value : jsondecode(data.aws_secretsmanager_secret_version.gnosis-funder-private-key.secret_string)["SAFE_FUNDER_PRIVATE_KEY"]
    },
    {
      name : "SAFE_OLD_CONTRACT_ADDRESS",
      value : var.gnosis_safe_address
    },
    {
      name : "SAFE_PROXY_FACTORY_ADDRESS",
      value : var.proxy_factory_address
    },
    {
      name : "SAFE_TX_SENDER_PRIVATE_KEY",
      value : jsondecode(data.aws_secretsmanager_secret_version.gnosis-sender-private-key.secret_string)["SAFE_TX_SENDER_PRIVATE_KEY"]
    },
    {
      name : "USE_DOCKER",
      value : "True"
    }
  ]
}


/* Services */
module "discovery-gnosis-web" {
  source       = "../../modules/discovery"
  namespace    = var.service_discovery_namespace_id
  service_name = local.web_name
}

module "service-gnosis-web" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = local.web_name
  alb_security_group             = var.alb_sg
  container_definition_json      = module.task-gnosis-web.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = var.ecs_cluster_arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = var.vpc_id
  security_group_ids = [
    var.vpc_sg,
    module.gnosis-security-group.this_security_group_id
  ]
  subnet_ids    = var.public_subnets
  desired_count = 1
  ecs_load_balancers = [
    {
      container_name   = local.web_name
      container_port   = local.web_port
      elb_name         = null
      target_group_arn = var.gnosis_web_tg_arn
    }
  ]
  service_registries = [
    {
      registry_arn   = module.discovery-gnosis-web.arn
      port           = null
      container_name = null
      container_port = null
    }
  ]
}

module "discovery-gnosis-postgres" {
  source       = "../../modules/discovery"
  namespace    = var.service_discovery_namespace_id
  service_name = local.postgres_name
}

module "service-gnosis-postgres" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = local.postgres_name
  alb_security_group             = var.alb_sg
  container_definition_json      = module.task-gnosis-postgres.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = var.ecs_cluster_arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = var.vpc_id
  security_group_ids = [
    var.vpc_sg,
    module.gnosis-security-group.this_security_group_id
  ]
  subnet_ids    = var.public_subnets
  desired_count = 1
  service_registries = [
    {
      registry_arn   = module.discovery-gnosis-postgres.arn
      port           = null
      container_name = null
      container_port = null
    }
  ]
}

module "discovery-gnosis-redis" {
  source       = "../../modules/discovery"
  namespace    = var.service_discovery_namespace_id
  service_name = local.redis_name
}

module "service-gnosis-redis" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = local.redis_name
  alb_security_group             = var.alb_sg
  container_definition_json      = module.task-gnosis-redis.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = var.ecs_cluster_arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = var.vpc_id
  security_group_ids = [
    var.vpc_sg,
    module.gnosis-security-group.this_security_group_id
  ]
  subnet_ids    = var.public_subnets
  desired_count = 1
  service_registries = [
    {
      registry_arn   = module.discovery-gnosis-redis.arn
      port           = null
      container_name = null
      container_port = null
    }
  ]
}

module "discovery-gnosis-worker" {
  source       = "../../modules/discovery"
  namespace    = var.service_discovery_namespace_id
  service_name = local.worker_name
}

module "service-gnosis-worker" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = local.worker_name
  alb_security_group             = var.alb_sg
  container_definition_json      = module.task-gnosis-worker.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = var.ecs_cluster_arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = var.vpc_id
  security_group_ids = [
    var.vpc_sg,
    module.gnosis-security-group.this_security_group_id
  ]
  subnet_ids    = var.public_subnets
  desired_count = 1
  service_registries = [
    {
      registry_arn   = module.discovery-gnosis-worker.arn
      port           = null
      container_name = null
      container_port = null
    }
  ]
}

module "discovery-gnosis-scheduler" {
  source       = "../../modules/discovery"
  namespace    = var.service_discovery_namespace_id
  service_name = local.scheduler_name
}

module "service-gnosis-scheduler" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = local.scheduler_name
  alb_security_group             = var.alb_sg
  container_definition_json      = module.task-gnosis-scheduler.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = var.ecs_cluster_arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = var.vpc_id
  security_group_ids = [
    var.vpc_sg,
    module.gnosis-security-group.this_security_group_id
  ]
  subnet_ids    = var.public_subnets
  desired_count = 1
  service_registries = [
    {
      registry_arn   = module.discovery-gnosis-scheduler.arn
      port           = null
      container_name = null
      container_port = null
    }
  ]
}
