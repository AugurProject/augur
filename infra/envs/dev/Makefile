# Tasks
# Assumes aws-vault is setup with MFA. See: (https://github.com/99designs/aws-vault)

ORG = augur

.PHONY lint:
 lint:
	terraform init && terraform fmt && terraform validate

.PHONY: plan
plan:
	aws-vault exec ${ORG} -- terraform plan

.PHONY: apply
apply:
	aws-vault exec ${ORG} -- terraform apply

# Forces remote state unlock. Only use if you know what you're doing.
.PHONY unlock:
unlock:
	aws-vault exec ${ORG} -- terraform force-unlock augur/default

# Opens AWS console in web browser
.PHONY browser:
browser:
	aws-vault login ${ORG}

# Taint service resources to force redeploy. This is neccessary for immutable service attriburtes (i.e Service Discovery)
.PHONY taint-services:
taint-services:
	aws-vault exec ${ORG} -- terraform state list | grep 'aws_ecs_service' | xargs -L 1 terraform taint

.PHONY: destroy
destroy:
	aws-vault exec ${ORG} -- terraform destroy
