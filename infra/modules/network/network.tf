/* network.tf */

// VPC
module "vpc" {
  source     = "git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=tags/0.8.1"
  namespace  = var.namespace
  stage      = var.environment
  name       = var.name
  cidr_block = var.vpc_cidr_block
}

// Subnets
module "subnets" {
  source               = "git::https://github.com/cloudposse/terraform-aws-dynamic-subnets.git?ref=tags/0.18.1"
  availability_zones   = var.availability_zones
  namespace            = var.namespace
  stage                = var.environment
  name                 = var.name
  vpc_id               = module.vpc.vpc_id
  igw_id               = module.vpc.igw_id
  cidr_block           = module.vpc.vpc_cidr_block
  nat_gateway_enabled  = false
  nat_instance_enabled = false
  subnet_type_tag_key  = "SubnetType"
}

// ALB
module "alb_security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 3.0"

  name                = "web-traffic-sg"
  vpc_id              = module.vpc.vpc_id
  ingress_cidr_blocks = ["0.0.0.0/0"]
  ingress_rules = [
    "https-443-tcp",
    "http-80-tcp",
  ]
  ingress_with_cidr_blocks = [
    {
      from_port   = 60556
      to_port     = 60559
      protocol    = "tcp"
      description = "0x-mesh"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
  egress_rules = ["all-all"]
}

data aws_acm_certificate "default" {
  domain = "*.${var.domain}"
  statuses = ["ISSUED"]
  most_recent = true
}

module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 5.0"

  name = "${var.environment}-${var.name}-ALB"

  vpc_id  = module.vpc.vpc_id
  subnets = module.subnets.public_subnet_ids
  security_groups = [
    module.vpc.vpc_default_security_group_id,
    module.alb_security_group.this_security_group_id
  ]
  target_groups = [
    {
      name             = "${var.environment}-augur-ui"
      backend_protocol = "HTTP"
      backend_port     = 80
      target_type      = "ip"
      health_check = {
        enabled             = true
        protocol            = "HTTP"
        path                = "/"
        port                = "traffic-port"
        healthy_threshold   = 5
        unhealthy_threshold = 2
        timeout             = 5
        interval            = 30
        matcher             = "200,301"
      }
    },
    {
      name             = "${var.environment}-0x-mesh-ws"
      backend_protocol = "HTTP"
      backend_port     = 60557
      target_type      = "ip"
      health_check = {
        enabled             = true
        protocol            = "HTTP"
        path                = "/"
        port                = 60557
        healthy_threshold   = 5
        unhealthy_threshold = 2
        timeout             = 5
        interval            = 30
        matcher             = "200,400"
      }
    },
    {
      name             = "${var.environment}-0x-mesh-boostrap"
      backend_protocol = "HTTP"
      backend_port     = 60559
      target_type      = "ip"
      health_check = {
        enabled             = true
        protocol            = "HTTP"
        path                = "/"
        port                = "traffic-port"
        healthy_threshold   = 5
        unhealthy_threshold = 2
        timeout             = 5
        interval            = 30
        matcher             = "200,400"
      }
    }
  ]

  http_tcp_listeners = [
    {
      port               = 80
      protocol           = "HTTP"
      target_group_index = 0
    },
    {
      port               = 60559
      protocol           = "HTTP"
      target_group_index = 2
    },
  ]

  https_listeners = [
    {
      port               = 443
      protocol           = "HTTPS"
      certificate_arn    = data.aws_acm_certificate.default.arn
      target_group_index = 0
    },
  ]
}

/* Ingress Rules for subdomains*/
// Corroborate with DNS settings
module "ingress-0x-mesh-bootstrap" {
  source                       = "git::https://github.com/cloudposse/terraform-aws-alb-ingress.git?ref=0.9.0"
  namespace                    = var.namespace
  stage                        = var.environment
  name                         = var.name
  vpc_id                       = module.vpc.vpc_id
  default_target_group_enabled = false
  target_group_arn             = module.alb.target_group_arns[2]
  unauthenticated_listener_arns = [
    module.alb.http_tcp_listener_arns[0],
    module.alb.http_tcp_listener_arns[1],
    module.alb.https_listener_arns[0]
  ]
  unauthenticated_listener_arns_count = 3
  unauthenticated_hosts               = ["${var.environment}-bootstrap.${var.domain}"]
  unauthenticated_priority            = 101
}

module "ingress-0x-mesh-rpc" {
  source                       = "git::https://github.com/cloudposse/terraform-aws-alb-ingress.git?ref=0.9.0"
  namespace                    = var.namespace
  stage                        = var.environment
  name                         = var.name
  vpc_id                       = module.vpc.vpc_id
  default_target_group_enabled = false
  target_group_arn             = module.alb.target_group_arns[1]
  unauthenticated_listener_arns = [
    module.alb.http_tcp_listener_arns[0],
    module.alb.https_listener_arns[0]
  ]
  unauthenticated_listener_arns_count = 2
  unauthenticated_paths               = ["/0x-ws"]
  unauthenticated_priority            = 105
}
