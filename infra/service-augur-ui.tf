locals {
  augur_ui_name = "augur-ui"
  augur_ui_port = 80
}

module "augur-ui-security-group" {
  source = "terraform-aws-modules/security-group/aws"
  name   = "augur-ui-sg"
  vpc_id = module.vpc.vpc_id
  ingress_with_cidr_blocks = [
    {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
}

module "task-augur-ui" {
  source           = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
  container_name   = "augur-ui"
  container_image  = "augurproject/augur-ui:kovan"
  container_memory = 512
  container_cpu    = 256
  command          = []
  port_mappings = [
    {
      hostPort : local.augur_ui_port,
      protocol : "tcp",
      containerPort : local.augur_ui_port
    }
  ]
  log_configuration = {
    logDriver = "awslogs"
    options = {
      "awslogs-group" : aws_cloudwatch_log_group.ecs.name,
      "awslogs-region" : var.region,
      "awslogs-stream-prefix" : "augur-ui"
    }
    secretOptions = null
  }
}

module "discovery-augur-ui" {
  source       = "./modules/discovery"
  namespace    = aws_service_discovery_private_dns_namespace.ecs.id
  service_name = local.augur_ui_name
}

module "service-augur-ui" {
  source                         = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=tags/0.21.0"
  stage                          = var.environment
  name                           = local.augur_ui_name
  alb_security_group             = module.alb_security_group.this_security_group_id
  container_definition_json      = module.task-augur-ui.json
  ignore_changes_task_definition = false
  ecs_cluster_arn                = aws_ecs_cluster.ecs.arn
  launch_type                    = "FARGATE"
  network_mode                   = "awsvpc"
  assign_public_ip               = true
  vpc_id                         = module.vpc.vpc_id
  security_group_ids = [
    module.vpc.vpc_default_security_group_id,
    module.augur-ui-security-group.this_security_group_id
  ]
  subnet_ids    = module.subnets.public_subnet_ids
  desired_count = 3
  ecs_load_balancers = [
    {
      container_name   = local.augur_ui_name
      container_port   = 80
      elb_name         = null
      target_group_arn = module.alb.target_group_arns[0]
    }
  ]
  service_registries = [
    {
      registry_arn   = module.discovery-augur-ui.arn
      port           = null
      container_name = null
      container_port = null
    }
  ]
}
