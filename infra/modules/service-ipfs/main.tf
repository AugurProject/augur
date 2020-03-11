locals {
  ipfs_port = 4001
}

module "ipfs-security-group" {
  source = "terraform-aws-modules/security-group/aws"

  name   = "ipfs-sg"
  vpc_id = var.vpc_id
  ingress_with_cidr_blocks = [
    {
      from_port   = 4001
      to_port     = 4001
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
}

module "task-ipfs" {
  source           = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name   = "ipfs"
  container_image  = "augurproject/augur-ipfs:v2"
  container_memory = 512
  container_cpu    = 256
  command          = []
  port_mappings = [
    {
      hostPort : local.ipfs_port,
      protocol : "tcp",
      containerPort : local.ipfs_port
    }
  ]
  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-group" : var.ecs_log_group,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : "ipfs"
    }
    secretOptions = null
  }
}

module "discovery-ipfs" {
  source       = "../../modules/discovery"
  namespace    = var.service_discovery_namespace_id
  service_name = "ipfs"
}

module "service-ipfs" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = "ipfs"
  alb_security_group             = var.alb_sg
  container_definition_json      = module.task-ipfs.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = var.ecs_cluster_arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = var.vpc_id
  security_group_ids = [
    var.vpc_sg,
    module.ipfs-security-group.this_security_group_id
  ]
  subnet_ids    = var.public_subnets
  desired_count = 2
  service_registries = [
    {
      registry_arn   = module.discovery-ipfs.arn
      port           = null
      container_name = null
      container_port = null
    }
  ]
}
