.DEFAULT_GOAl: help

#############################
# variables
#############################
ENV="" # local, dev, stg, prd
COMMAND="" # fmt, init, plan, apply

#############################
# help
#############################
.PHONY: help
help:
	@echo "Usage:"
	@echo "- make format"
	@echo "- make terraform.init.[env]"
	@echo "- make terraform.plan.[env]"
	@echo "- make terraform.apply.[env]"

#############################
# command
#############################
.PHONY: terraform.command
terraform.command:
	@TF_DATA_DIR=environments/${ENV}/.terraform terraform ${COMMAND}

#############################
# format
#############################
.PHONY: fmt
fmt:
	@terraform fmt -recursive

#############################
# init
#############################
.PHONY: terraform.init.local
terraform.init.local:
	@make terraform.command ENV=local COMMAND="init -upgrade -backend-config environments/local/backend.tfvars"

.PHONY: terraform.init.dev
terraform.init.dev:
	@make terraform.command ENV=dev COMMAND="init -upgrade -backend-config environments/dev/backend.tfvars"

.PHONY: terraform.init.stg
terraform.init.stg:
	@make terraform.command ENV=stg COMMAND="init -upgrade -backend-config environments/stg/backend.tfvars"

.PHONY: terraform.init.prd
terraform.init.prd:
	@make terraform.command ENV=prd COMMAND="init -upgrade -backend-config environments/prd/backend.tfvars"

#############################
# plan
#############################
.PHONY: terraform.plan.local
terraform.plan.local:
	@make terraform.command ENV=local COMMAND="plan -var-file=environments/local/terraform.tfvars"

.PHONY: terraform.plan.dev
terraform.plan.dev:
	@make terraform.command ENV=dev COMMAND="plan -var-file=environments/dev/terraform.tfvars"

.PHONY: terraform.plan.stg
terraform.plan.stg:
	@make terraform.command ENV=stg COMMAND="plan -var-file=environments/stg/terraform.tfvars"

.PHONY: terraform.plan.prd
terraform.plan.prd:
	@make terraform.command ENV=prd COMMAND="plan -var-file=environments/prd/terraform.tfvars"

#############################
# apply
#############################
.PHONY: terraform.apply.local
terraform.apply.local:
	@make terraform.command ENV=local COMMAND="apply -var-file=environments/local/terraform.tfvars"

.PHONY: terraform.apply.dev
terraform.apply.dev:
	@make terraform.command ENV=dev COMMAND="apply -var-file=environments/dev/terraform.tfvars"

.PHONY: terraform.apply.stg
terraform.apply.stg:
	@make terraform.command ENV=stg COMMAND="apply -var-file=environments/stg/terraform.tfvars"

.PHONY: terraform.apply.prd
terraform.apply.prd:
	@make terraform.command ENV=prd COMMAND="apply -var-file=environments/prd/terraform.tfvars"
