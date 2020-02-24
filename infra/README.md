# Terraform

This directory contains sample architecture for running Augur 3rd party
dependencies on AWS ECS (0x Safe Relayer, Gnosis Safe Relayer, Augur SDK
Server)

## Terraform Concepts

## Getting Started

Install Terraform

MacOS:
```
brew install terraform
```

Ubuntu/Debian:
```
wget https://releases.hashicorp.com/terraform/0.11.13/terraform_0.11.13_linux_amd64.zip
sudo unzip ./terraform_0.11.13_linux_amd64.zip -d /usr/local/bin/
```


## Things you'll need

1. ~/.terraformrc with your org's tf cloud credentials
2. [aws-vault])https://github.com/99designs/aws-vault) installed (optional but recommended)
