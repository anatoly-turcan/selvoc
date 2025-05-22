#!/bin/bash

# Usage: ./backup_state.sh <load|upload> <bucket_name>
# Uploads or downloads the Terraform state file to/from an S3 bucket.

if [ "$#" -ne 2 ]; then
    echo "Error: Usage: $0 <load|upload> <bucket_name>"
    exit 1
fi

STATE_FILE="terraform.tfstate"
BACKUP_KEY="bootstrap/$STATE_FILE.backup"
ACTION="$1"
BUCKET_NAME="$2"

# Validate action
if [ "$ACTION" != "load" ] && [ "$ACTION" != "upload" ]; then
    echo "Error: Action must be 'load' or 'upload'"
    exit 1
fi

# Upload action
if [ "$ACTION" = "upload" ]; then
    # Check if state file exists
    if [ ! -f "$STATE_FILE" ]; then
        echo "Error: $STATE_FILE not found in current directory"
        exit 1
    fi

    echo "Uploading $STATE_FILE to s3://$BUCKET_NAME/$BACKUP_KEY"
    aws s3 cp "$STATE_FILE" "s3://$BUCKET_NAME/$BACKUP_KEY"
    if [ $? -eq 0 ]; then
        echo "Upload successful"
    else
        echo "Error: Upload failed"
        exit 1
    fi
fi

# Load action
if [ "$ACTION" = "load" ]; then
    echo "Downloading s3://$BUCKET_NAME/$BACKUP_KEY to $STATE_FILE"
    aws s3 cp "s3://$BUCKET_NAME/$BACKUP_KEY" "$STATE_FILE"
    if [ $? -eq 0 ]; then
        echo "Download successful"
    else
        echo "Error: Download failed"
        exit 1
    fi
fi
