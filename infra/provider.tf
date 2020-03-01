/* provider.tf */
// Containers config for cloud provider (AWS) and remote state management

provider "aws" {
  region = var.region
}

terraform {
  backend "remote" {
    organization = "augur"
    workspaces {
      name = "default"
    }
  }
}
