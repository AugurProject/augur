// Cluster
resource "aws_ecs_cluster" "ecs" {
  name               = "${var.environment}-${var.name}"
  capacity_providers = ["FARGATE"]
}

// Service Discovery
resource "aws_service_discovery_private_dns_namespace" "ecs" {
  name        = var.environment
  description = "Private service discovery for ${var.environment} ECS cluster."
  vpc         = var.vpc_id
}

// Log Group
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "${var.environment}-${var.name}"
  retention_in_days = var.cloudwatch_retention_days
}
