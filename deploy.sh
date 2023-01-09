#!/bin/bash

# Before using this script:
# (1) Update URLs in `serverless-workflow/src/main/resources/application.properties` if needed.
# (2) Replace all `paulovmr-dev` occurrences with your namespace in the `resources.yaml` file.
# (3) Export the following environment variables:
# 	OPENSHIFT_TOKEN
# 	OPENSHIFT_SERVER

oc login --token=$OPENSHIFT_TOKEN --server=$OPENSHIFT_SERVER

APPS=("action-inferrer" "ansible" "monitoring-system" "ticket-manager" "serverless-workflow")

echo -e "\nDeleting old resources..."
for item in "${APPS[@]}"
do
  echo "- $item"
  oc delete all -l app=$item
done
echo "Deleting old resources...done"

echo -e "\nCreating new resources..."
oc apply -f resources.yaml
echo "Creating new resources...done"

echo -e "\nStart building resources..."
for item in "${APPS[@]}"
do
  echo "- $item"
  oc start-build $item
done
echo "Start building resources...done"
