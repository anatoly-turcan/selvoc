#!/bin/bash
set -e
# set -x

# Variables
AWS_REGION="${region}"
GITHUB_REPOSITORY_URL="${repository_url}"
GITHUB_TOKEN="${token}"
EKS_CLUSTER_NAME="${eks_cluster_name}"
VERSION="${version}"
ENVIRONMENT="${environment}"

# Update and install dependencies
yum update -y
yum install -y jq yum-utils

# Install .NET Core 6.0 runtime (required for GitHub runner)
yum install -y dotnet-runtime-6.0

# Install terraform
yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
yum -y install terraform

# Install kubectl
cat <<EOF | tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.33/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.33/rpm/repodata/repomd.xml.key
EOF
yum install -y kubectl

# Install helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Configure EKS access
aws eks update-kubeconfig --region $${AWS_REGION} --name $${EKS_CLUSTER_NAME}

# Create a directory for the runner
mkdir /actions-runner && cd /actions-runner

# Download and install GitHub Actions runner
curl -o actions-runner-linux-x64-$${VERSION}.tar.gz -L https://github.com/actions/runner/releases/download/v$${VERSION}/actions-runner-linux-x64-$${VERSION}.tar.gz
tar xzf ./actions-runner-linux-x64-$${VERSION}.tar.gz

chown -R ec2-user:ec2-user /actions-runner

# Configure runner as ec2-user
sudo -u ec2-user bash -c "cd /actions-runner && ./config.sh --url $${GITHUB_REPOSITORY_URL} --token $${GITHUB_TOKEN} --name \"aws-runner-$(hostname)\" --labels \"self-hosted,aws,$${ENVIRONMENT}\" --unattended --replace" || { echo "Runner config failed"; exit 1; }

# Install and start service
./svc.sh install
./svc.sh start

# Clean up
unset GITHUB_TOKEN
rm -f ./actions-runner-linux-x64-$${VERSION}.tar.gz
