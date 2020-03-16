output "service_discover_namespace_id" {
  value = aws_service_discovery_private_dns_namespace.ecs.id
}

output "ecs_log_group" {
  value = aws_cloudwatch_log_group.ecs.name
}

output "ecs_cluster_arn" {
  value = aws_ecs_cluster.ecs.arn
}
