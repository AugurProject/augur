#Augur Terraform
Sample architecture for running Augur 3rd party
dependencies on AWS ECS
## Getting Started
### Install Terraform
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
1.  Terraform cli config with your org's Terraform cloud credentials
    ```
    # ~/.terraformrc

    credentials "app.terraform.io" {
        token = "<TF_CLOUD_TOKEN>"
    }
    ```
2. [aws-vault](https://github.com/99designs/aws-vault) installed (for Makefile targets)
3. MFA enabled on your AWS IAM profile + CLI config
    ```ini
   # ~/.aws/config

   [profile augur]
   mfa_serial = arn:aw:iam::<AWS_ACCOUNT_ID>:mfa/<USERNAME>
    ```

### Workflow

Terraform uses a declarative DSL called HCL. The general workflow is:
1. `cd` to the environment you'd like to modify, example:

        $ cd envs/v2
2. Make changes in HCL files
3. `terraform init` (download 3rd party resources, link modules)
4. `terraform plan` (generate diff)
5. `terraform apply` (apply diff)

This folder contains make targets to make these steps more robust

1. `make lint`
2. `make plan`
3. `make apply`

### FAQs
####How to clear orphaned resource
```
Error: orphan resource <RESOURCE_ADDR> still has a non-empty state after apply; this is a bug in Terraform
```
Clear resource state and apply again:
```
terrafrom state rm <RESOURCE_ADDRR
make apply
```

#### Help! Terraform claims the state is locked!
Locking is a mechanism to keep competing changes from landing at the same time and fudging your infrastructure. In general the lock will clear as soon as there are no more
