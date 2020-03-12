// Common Variables
variable "name" {
  description = "Solution name, e.g. 'app' or 'ecs'"
}

variable "namespace" {
  description = "Organization namespace"
}

variable environment {
  description = "Name of environment (dev, stable, production, etc)"
}

variable region {
  description = "AWS region to provision infrastrucutre"
  default     = "us-east-1"
}

variable "cloudwatch_retention_days" {
  type    = number
  default = 7
}

variable "tags" {
  type        = map(string)
  description = "Tags for infrastructure"
  default     = {}
}

// Networking
variable availability_zones {
  description = "List of AZ used for provisioning network. Best practice to provide at least 2."
}

variable "vpc_cidr_block" {
  description = "CIDR block for VPC"
}

variable "domain" {
  description = "Domain for DNS provisioning"
  default     = "example.org"
}

// App Config
variable "build_environment" {
  description = "Environment for config from augur-artifacts/src/environments"
  type        = string
}

variable "ethereum_node_url" {
  type = string
}

variable "ipfs_pubkey" {
  type = string
}
