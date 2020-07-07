# network/outputs.tf

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "vpc_default_sg" {
  value = module.vpc.vpc_default_security_group_id
}

output "alb_sg" {
  value = module.alb_security_group.this_security_group_id
}

output "public_subnets" {
  value = module.subnets.public_subnet_ids
}

output "private_subnets" {
  value = module.subnets.private_subnet_ids
}

output "zerox_bootstrap_tg_arn" {
  value = module.ingress-0x-mesh-bootstrap.target_group_arn
}

output "zerox_rpc_tg_arn" {
  value = module.ingress-0x-mesh-rpc.target_group_arn
}

output "alb_url" {
  value = module.alb.this_lb_dns_name
}

output "certificate_arn" {
  value = data.aws_acm_certificate.default.arn
}
