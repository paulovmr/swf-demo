#!/bin/bash

# Before using this script:
# (1) Update URLs in `serverless-workflow/src/main/resources/application.properties` if needed.
# (2) Export the following environment variables:
#    OPENSHIFT_TOKEN
#    OPENSHIFT_SERVER
#    OPENSHIFT_NAMESPACE

oc login --token=$OPENSHIFT_TOKEN --server=$OPENSHIFT_SERVER

APPS=("action-inferrer" "ansible" "monitoring-system" "ticket-manager" "waiting-room" "webapp" "serverless-workflow")

echo -e "\nCreating the deploy template..."
if oc get template/deploy-swf-demo-template >/dev/null 2>&1; then
  oc delete template/deploy-swf-demo-template
fi
oc create -f deploy-swf-demo-template.yaml
echo "Creating the template...done"

echo -e "\nDeleting old resources..."
for item in "${APPS[@]}"; do
  echo "- $item"
  oc delete all -l app=$item
done
echo "Deleting old resources...done"

echo -e "\nCreating new resources..."
oc process -f deploy-swf-demo-template.yaml -p OPENSHIFT_NAMESPACE=$OPENSHIFT_NAMESPACE | oc create -f -
echo "Creating new resources...done"

echo -e "\nStart building resources..."
for item in "${APPS[@]}"; do
  echo "- $item"
  oc start-build $item
done
echo "Start building resources...done"
