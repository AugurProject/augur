#Augur Terraform
Sample architecture for running Augur 3rd party
dependencies on AWS ECS
## Getting Started
###Install Terraform
This project uses Terraform >=0.12 which contains some semi-breaking changes. Update your CLI if needed.

MacOS:
```
brew install terraform
```

Ubuntu/Debian:
```
wget https://releases.hashicorp.com/terraform/0.11.13/terraform_0.12.21_linux_amd64.zip
sudo unzip ./terraform_0.12.21_linux_amd64.zip -d /usr/local/bin/
```

### Config
1.  Terraform cli config with your org's tf cloud credentials
    ```
    # ~/.terraformrc

    credentials "app.terraform.io" {
        token = "<TF_CLOUD_TOKEN>"
    }
    ```
2. [aws-vault](https://github.com/99designs/aws-vault) installed (For Makefile targets, they're your credentials to manage)
3. MFA enabled on your AWS IAM profile + CLI config
    ```ini
   # ~/.aws/config

   [profile augur]
   mfa_serial = arn:aw:iam::<AWS_ACCOUNT_ID>:mfa/<USERNAME>
    ```

### Workflow

Terraform uses a declarative DSL called HCL. The general workflow is:
1. Make changes in HCL
2. `terraform init` (download 3rd party modules, validate code)
3. `terraform plan` (generate diff)
4. `terraform apply` (apply diff)

This folder contains make targets to make this simpler namely `make lint`, `make plan`, and `make apply`. It's recommended to execute commands in that order.
